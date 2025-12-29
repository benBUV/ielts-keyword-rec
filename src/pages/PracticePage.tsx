import { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Pause, Play, Loader2, ArrowRight, Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AudioLevelBar } from '@/components/ui/audio-level-bar';
import { QuestionDisplay } from '@/components/practice/question-display';
import { ReviewSection } from '@/components/practice/review-section';
import { RecorderIndicator } from '@/components/practice/recorder-indicator';
import { SilenceIndicator } from '@/components/practice/silence-indicator';
import { useAudioRecorder } from '@/hooks/use-audio-recorder';
import { useSpeechDetection } from '@/hooks/use-speech-detection';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useToast } from '@/hooks/use-toast';
import { AppPhase, Recording, QuestionType, Question, QuestionBank } from '@/types';
import { downloadAudioBlob, mergeAudioBlobs } from '@/lib/audio-utils';
import { loadQuestionBank } from '@/utils/question-bank-loader';
import { matchKeywords } from '@/lib/keyword-matcher';
import { cn } from '@/lib/utils';

export default function PracticePage() {
  const { toast } = useToast();
  const [phase, setPhase] = useState<AppPhase>(AppPhase.Loading);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [sampleQuestions, setSampleQuestions] = useState<Question[]>([]);
  const [questionBankInfo, setQuestionBankInfo] = useState<QuestionBank | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false); // Track if current answer has been checked
  const [feedbackData, setFeedbackData] = useState<{
    isCorrect: boolean;
    quality?: 'excellent' | 'good';
    matchedKeywords: string[];
    missedKeywords: string[];
    matchedOptionalKeywords?: string[];
  } | null>(null);
  
  // Check URL parameter for keywords display
  const searchParams = new URLSearchParams(window.location.search);
  const showKeywords = searchParams.get('keywords') !== 'false'; // Show by default unless explicitly set to false

  // Ref to track if stop sequence has been triggered for current question
  const hasTriggeredStopRef = useRef(false);

  const {
    isRecording,
    isPaused,
    audioLevel,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const {
    silenceDuration,
    totalSpeechTime,
    hasSpeechDetected,
    silenceState,
    resetDetection,
  } = useSpeechDetection(audioLevel, isRecording, isPaused);

  const {
    transcript,
    interimTranscript,
    isSupported: isSpeechRecognitionSupported,
    startListening,
    stopListening,
    resetTranscript,
    getCurrentTranscript,
  } = useSpeechRecognition();

  // Ensure currentQuestionIndex never exceeds bounds
  const safeQuestionIndex = Math.min(currentQuestionIndex, sampleQuestions.length - 1);
  const currentQuestion = sampleQuestions[safeQuestionIndex] || sampleQuestions[0];

  // 🔍 DIAGNOSTIC: Log recordings whenever they change
  useEffect(() => {
    console.log('🔍 [DIAGNOSTIC] Recordings array updated:', recordings.length);
    recordings.forEach((rec, idx) => {
      console.log(`🔍 [DIAGNOSTIC] Recording ${idx + 1}:`, {
        id: rec.id,
        questionId: rec.questionId,
        hasAudioBlob: !!rec.audioBlob,
        audioBlobSize: rec.audioBlob?.size || 0,
        hasTranscript: !!rec.transcript,
        transcriptLength: rec.transcript?.length || 0,
        transcriptPreview: rec.transcript?.substring(0, 50) || '(empty)',
        duration: rec.duration,
      });
    });
  }, [recordings]);

  // 🔍 DIAGNOSTIC: Log transcript whenever it changes
  useEffect(() => {
    console.log('🔍 [DIAGNOSTIC] Transcript state updated:', {
      length: transcript.length,
      preview: transcript.substring(0, 100) || '(empty)',
      interimLength: interimTranscript.length,
    });
  }, [transcript, interimTranscript]);

  // Persist timer values to localStorage
  useEffect(() => {
    if (phase === AppPhase.Recording || phase === AppPhase.Preparation) {
      const timerData = {
        totalSpeechTime,
        questionIndex: currentQuestionIndex,
        timestamp: Date.now(),
      };
      localStorage.setItem('ielts-practice-timer', JSON.stringify(timerData));
    }
  }, [totalSpeechTime, currentQuestion, currentQuestionIndex, phase]);

  // Canvas LMS iframe resize functionality
  useEffect(() => {
    const sendResizeMessage = () => {
      try {
        // Get the actual content height
        const contentHeight = document.documentElement.scrollHeight;
        
        // Send resize message to Canvas LMS parent window
        if (window.parent && window.parent !== window) {
          // Canvas LMS expects this specific message format
          window.parent.postMessage(
            JSON.stringify({
              subject: 'lti.frameResize',
              height: contentHeight,
            }),
            '*'
          );
          
          console.log('📏 [Canvas LMS] Sent resize message:', contentHeight);
        }
      } catch (error) {
        console.error('Failed to send resize message:', error);
      }
    };

    // Send initial resize
    sendResizeMessage();

    // Create ResizeObserver to watch for content changes
    const resizeObserver = new ResizeObserver(() => {
      sendResizeMessage();
    });

    // Observe the document body for size changes
    if (document.body) {
      resizeObserver.observe(document.body);
    }

    // Also send resize on phase changes and window resize
    window.addEventListener('resize', sendResizeMessage);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', sendResizeMessage);
    };
  }, [phase, currentQuestionIndex, recordings.length]);

  // Restore timer values from localStorage on mount
  useEffect(() => {
    const savedTimer = localStorage.getItem('ielts-practice-timer');
    if (savedTimer) {
      try {
        const timerData = JSON.parse(savedTimer);
        // Only restore if less than 1 hour old
        if (Date.now() - timerData.timestamp < 3600000) {
          console.log('⏱️ [PracticePage] Restored timer data from localStorage:', timerData);
        }
      } catch (error) {
        console.error('Failed to restore timer data:', error);
      }
    }
  }, []);

  // Load question bank on mount
  useEffect(() => {
    const loadBank = async () => {
      try {
        const { questions, bankInfo, error } = await loadQuestionBank();
        
        setSampleQuestions(questions);
        setQuestionBankInfo(bankInfo);

        if (error) {
          toast({
            title: 'Question Bank Not Found',
            description: error,
            variant: 'destructive',
          });
        }

        // Skip Ready phase and go directly to first question
        setTimeout(() => {
          setPhase(AppPhase.Preparation);
          
          if (!isSpeechRecognitionSupported) {
            toast({
              title: 'Speech Recognition Unavailable',
              description: 'Your browser does not support speech recognition. Audio will be recorded but transcripts will not be available. For best experience, use Chrome or Edge.',
              variant: 'destructive',
            });
          }
        }, 1500);
      } catch (error) {
        console.error('Failed to load question bank:', error);
        toast({
          title: 'Error Loading Questions',
          description: 'Failed to load question bank. Please refresh the page.',
          variant: 'destructive',
        });
        setPhase(AppPhase.Preparation);
      }
    };

    loadBank();
  }, [isSpeechRecognitionSupported, toast]);

  // Silence detection with natural transitions (no intrusive toasts)
  useEffect(() => {
    if (!isRecording || !hasSpeechDetected || isPaused) return;

    // Medium silence (10s): Auto-pause recording
    if (silenceState === 'medium') {
      console.log('⏸️ [PracticePage] Medium silence - auto-pausing recording');
      pauseRecording();
    }

    // Long silence (25s): Already paused, just show gentle prompt in UI
    if (silenceState === 'long') {
      console.log('⏸️ [PracticePage] Long silence - showing gentle prompt');
      // UI will show "Ready when you're ready — tap to continue"
    }
  }, [silenceState, isRecording, hasSpeechDetected, isPaused, pauseRecording]);


  const handleStartRecording = useCallback(async () => {
    console.log('🎤 [PracticePage] handleStartRecording called');
    try {
      console.log('🔄 [PracticePage] Resetting transcript and detection...');
      resetTranscript();
      resetDetection();
      
      console.log('🎙️ [PracticePage] Starting audio recording...');
      await startRecording();
      console.log('✅ [PracticePage] Audio recording started successfully');
      
      if (isSpeechRecognitionSupported) {
        console.log('🗣️ [PracticePage] Starting speech recognition...');
        startListening();
        console.log('✅ [PracticePage] Speech recognition started');
      } else {
        console.warn('⚠️ [PracticePage] Speech recognition not supported');
      }
      
      // Move to Recording phase
      setPhase(AppPhase.Recording);
    } catch (error) {
      console.error('❌ [PracticePage] Recording error:', error);
      toast({
        title: 'Recording Error',
        description: 'Failed to start recording. Please check microphone permissions.',
        variant: 'destructive',
      });
    }
  }, [
    startRecording,
    startListening,
    isSpeechRecognitionSupported,
    resetTranscript,
    resetDetection,
    toast,
  ]);

  // Combined Start/Stop Recording handler
  const handleStartStopRecording = async () => {
    if (!isRecording) {
      // If feedback has been given, reset it for a new attempt
      if (hasCheckedAnswer) {
        console.log('🔄 [PracticePage] Try Again - Resetting feedback and transcript');
        setHasCheckedAnswer(false);
        setFeedbackData(null);
        resetTranscript();
      }
      // Start recording
      await handleStartRecording();
    } else {
      // Stop recording and check answer
      await handleCheckAnswer();
    }
  };

  // Check answer function - stops recording and evaluates keywords
  const handleCheckAnswer = async () => {
    console.log('🛑 [PracticePage] ========== handleCheckAnswer START ==========');
    console.log('📊 [PracticePage] Current question:', currentQuestion.id);
    console.log('📊 [PracticePage] isRecording:', isRecording);
    
    // STEP 1: Stop listening FIRST (prevents new transcripts from coming in)
    if (isSpeechRecognitionSupported) {
      stopListening();
      console.log('✅ [PracticePage] Speech recognition stopped');
    }
    
    // STEP 2: Wait for ALL final speech results to arrive
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('⏱️ [PracticePage] Waited 500ms for final speech results');
    
    // STEP 3: Capture the transcript using getCurrentTranscript
    const currentTranscript = getCurrentTranscript();
    console.log('📝 [PracticePage] Captured transcript:', currentTranscript.substring(0, 100) + '...');
    console.log('📝 [PracticePage] Transcript length:', currentTranscript.length, 'characters');
    
    // STEP 4: Perform keyword matching with optional keywords
    const keywords = currentQuestion.keywords || [];
    const optionalKeywords = currentQuestion.optionalKeywords;
    const matchResult = matchKeywords(keywords, currentTranscript, optionalKeywords);
    console.log('🔑 [PracticePage] Keyword matching result:', matchResult);
    
    // STEP 5: Stop audio recording
    console.log('🎙️ [PracticePage] Stopping audio recording...');
    const blob = await stopRecording();
    console.log('✅ [PracticePage] Audio recording stopped, blob size:', blob?.size || 0, 'bytes');

    // STEP 6: Save the recording with keyword matching results
    if (blob) {
      const recording: Recording = {
        id: `recording-${Date.now()}`,
        questionId: currentQuestion.id,
        audioBlob: blob,
        transcript: currentTranscript,
        duration: totalSpeechTime,
        timestamp: Date.now(),
        isCorrect: matchResult.isCorrect,
        quality: matchResult.quality,
        matchedKeywords: matchResult.matchedKeywords,
        missedKeywords: matchResult.missedKeywords,
        matchedOptionalKeywords: matchResult.matchedOptionalKeywords,
      };

      console.log('💾 [PracticePage] Saving recording...');
      setRecordings((prev) => [...prev, recording]);
      
      // Set feedback data for display in transcript section
      setFeedbackData({
        isCorrect: matchResult.isCorrect,
        quality: matchResult.quality,
        matchedKeywords: matchResult.matchedKeywords,
        missedKeywords: matchResult.missedKeywords,
        matchedOptionalKeywords: matchResult.matchedOptionalKeywords,
      });
      
      // Mark answer as checked - this enables the Next Question button
      setHasCheckedAnswer(true);
    } else {
      console.warn('⚠️ [PracticePage] No audio blob available, recording not saved');
    }
    
    console.log('🛑 [PracticePage] ========== handleCheckAnswer END ==========');
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resumeRecording();
      if (isSpeechRecognitionSupported) {
        startListening();
      }
    } else {
      pauseRecording();
      if (isSpeechRecognitionSupported) {
        stopListening();
      }
    }
  };

  const handleNextQuestion = async () => {
    console.log('🔄 [PracticePage] ========== handleNextQuestion START ==========');
    console.log('📊 [PracticePage] Current question:', currentQuestion.id);
    console.log('📊 [PracticePage] isRecording:', isRecording);
    
    // Clear feedback data
    setFeedbackData(null);
    
    // Reset the stop trigger flag for the next question
    hasTriggeredStopRef.current = false;
    
    // Set transitioning state for smooth UX
    setIsTransitioning(true);
    
    // Clear transcript for next question
    console.log('🧹 [PracticePage] Clearing transcript for next question...');
    resetTranscript();
    console.log('✅ [PracticePage] Transcript cleared');

    // Check if there are more questions
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      console.log('➡️ [PracticePage] Moving to next question:', currentQuestionIndex + 1);
      
      // Move to next question
      setCurrentQuestionIndex((prev) => prev + 1);
      
      // Reset the checked answer flag for the new question
      setHasCheckedAnswer(false);
      
      // Get next question to determine how to start it
      const nextQuestion = sampleQuestions[currentQuestionIndex + 1];
      console.log('📋 [PracticePage] Next question:', nextQuestion.id, 'Type:', nextQuestion.type);
      
      // Brief delay for smooth transition
      setTimeout(() => {
        // Always start preparation phase for next question
        console.log('📝 [PracticePage] Starting preparation phase for next question');
        setPhase(AppPhase.Preparation);
        setIsTransitioning(false);
      }, 300);
    } else {
      // All questions completed - go to review
      console.log('✅ [PracticePage] All questions completed - showing review');
      setTimeout(() => {
        setPhase(AppPhase.Review);
        setIsTransitioning(false);
      }, 300);
    }
    
    console.log('🔄 [PracticePage] ========== handleNextQuestion END ==========');
  };

  const handleRetry = () => {
    setPhase(AppPhase.Preparation);
    setCurrentQuestionIndex(0);
    setRecordings([]);
    
    resetRecording();
    resetTranscript();
    resetDetection();
  };

  const handleDownloadIndividual = (recordingId: string) => {
    const recording = recordings.find((r) => r.id === recordingId);
    if (recording) {
      downloadAudioBlob(recording.audioBlob, `recording-${recordingId}.webm`);
    }
  };

  const handleDownloadMerged = async () => {
    try {
      const blobs = recordings.map((r) => r.audioBlob);
      const mergedBlob = await mergeAudioBlobs(blobs);
      downloadAudioBlob(mergedBlob, 'ielts-practice-merged.wav');
      toast({
        title: 'Success',
        description: 'Merged audio downloaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to merge audio files',
        variant: 'destructive',
      });
    }
  };

  if (phase === AppPhase.Loading || sampleQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="text-lg text-foreground">
              Hi, just a moment while I prepare your question(s)
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === AppPhase.Review) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <ReviewSection
            recordings={recordings}
            questions={sampleQuestions}
            onDownloadIndividual={handleDownloadIndividual}
            onDownloadMerged={handleDownloadMerged}
          />
          <div className="flex justify-center">
            <Button onClick={handleRetry} size="lg" className="gap-2">
              <RotateCcw className="w-5 h-5" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fluid external container with responsive padding */}
      <div className="p-2 sm:p-4 md:p-6">
        <div className="w-full max-w-7xl mx-auto">
          <Card className="border-0">
            <CardContent className="p-0">
              {/* Three-Zone Layout with responsive spacing - Mobile-first approach */}
              <div className="flex flex-col gap-1 sm:gap-4 md:gap-6 px-0 sm:px-4 md:px-6 pb-4 sm:pb-6">
                
                {/* ZONE 1: INPUT ZONE - Video/Question Display */}
                <section 
                  className="w-full"
                  aria-label="Question input zone"
                >
                  {(phase === AppPhase.Preparation || phase === AppPhase.Recording) && (
                    <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
                      <QuestionDisplay 
                        question={currentQuestion} 
                        isRecording={isRecording}
                        isPaused={isPaused}
                        currentQuestionIndex={currentQuestionIndex}
                        totalQuestions={sampleQuestions.length}
                        showKeywords={showKeywords}
                      />
                    </div>
                  )}
                </section>

                {/* ZONE 2: CONTROL ZONE - Recording Controls and Feedback */}
                <section 
                  className="w-full space-y-[10px] px-6 sm:px-0"
                  aria-label="Recording control zone"
                >
                  {(phase === AppPhase.Preparation || phase === AppPhase.Recording) && (
                    <>
                      {/* Status Indicators Row - Full width layout with space-between */}
                      <div className={cn(
                        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-4 md:gap-6 transition-opacity duration-300",
                        phase === AppPhase.Preparation && "opacity-40 pointer-events-none"
                      )}
                      role="region"
                      aria-label="Recording status indicators"
                      >
                        {/* Left: Recording Status */}
                        <div className="flex items-center justify-center h-12">
                          <RecorderIndicator isRecording={isRecording} isPaused={isPaused} />
                        </div>
                        
                        {/* Center: Volume Bar */}
                        <div className="flex justify-center">
                          <div className="h-12 flex items-center">
                            <AudioLevelBar 
                              level={phase === AppPhase.Recording ? audioLevel : 0}
                              aria-label="Audio level indicator"
                              aria-live="polite"
                            />
                          </div>
                        </div>
                        
                        {/* Right: Timer Display */}
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-1">
                            Speaking Time
                          </p>
                          <p className="text-2xl font-bold tabular-nums text-foreground">
                            {Math.floor(totalSpeechTime / 60)}:{(totalSpeechTime % 60).toString().padStart(2, '0')}
                          </p>
                        </div>
                      </div>

                      {/* Silence Indicator */}
                      {phase === AppPhase.Recording && (
                        <SilenceIndicator 
                          silenceState={silenceState} 
                          isPaused={isPaused}
                          onResume={resumeRecording}
                        />
                      )}

                      {/* Control Buttons - Enhanced visual feedback */}
                      <div className="flex justify-center gap-4 pt-2">
                        {/* Start/Stop/Try Again Recording Button */}
                        <Button 
                          onClick={handleStartStopRecording} 
                          variant={isRecording ? "destructive" : "default"}
                          size="lg"
                          className={cn(
                            "gap-2 min-h-[44px] w-[180px] transition-all duration-200",
                            "hover:opacity-80 active:scale-95"
                          )}
                          aria-label={
                            isRecording 
                              ? "Stop recording and check answer" 
                              : hasCheckedAnswer 
                                ? "Try again with a new recording" 
                                : "Start recording"
                          }
                        >
                          {isRecording ? (
                            <>
                              <Square className="w-5 h-5" aria-hidden="true" />
                              Stop Recording
                            </>
                          ) : hasCheckedAnswer ? (
                            <>
                              <RotateCcw className="w-5 h-5" aria-hidden="true" />
                              Try Again
                            </>
                          ) : (
                            <>
                              <Mic className="w-5 h-5" aria-hidden="true" />
                              Start Recording
                            </>
                          )}
                        </Button>
                        
                        {/* Next Question Button - Only enabled after checking answer */}
                        <Button 
                          onClick={handleNextQuestion} 
                          size="lg" 
                          className={cn(
                            "gap-2 min-h-[44px] w-[180px] transition-all duration-200",
                            "hover:opacity-80 active:scale-95",
                            "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:opacity-40"
                          )}
                          disabled={!hasCheckedAnswer || isTransitioning || isRecording}
                          aria-label={currentQuestionIndex === sampleQuestions.length - 1 ? "Finish practice" : "Move to next question"}
                        >
                          {isTransitioning ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                              Loading...
                            </>
                          ) : currentQuestionIndex === sampleQuestions.length - 1 ? (
                            <>
                              Finish
                            </>
                          ) : (
                            <>
                              Next Question
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </section>

                {/* ZONE 3: OUTPUT ZONE - Transcript Display */}
                <section 
                  className="w-full px-6 sm:px-0"
                  aria-label="Transcript output zone"
                >
                  {(phase === AppPhase.Preparation || phase === AppPhase.Recording) && (
                    <div className="relative">
                      {isSpeechRecognitionSupported ? (
                        <div 
                          className={cn(
                            "relative p-6 rounded-lg min-h-[8rem] overflow-visible mt-[30px] transition-all duration-500",
                            hasCheckedAnswer && feedbackData
                              ? feedbackData.isCorrect
                                ? "bg-green-50 dark:bg-green-950/30 border-2 border-green-500"
                                : "bg-red-50 dark:bg-red-950/30 border-2 border-red-500"
                              : "bg-[#F5F7FA] dark:bg-muted/20 border border-border/50"
                          )}
                          role="region"
                          aria-label="Live transcript"
                          aria-live="polite"
                          aria-atomic="false"
                        >
                          {/* Checkmark or Cross Overlay - Positioned outside the box */}
                          {hasCheckedAnswer && feedbackData && (
                            <div className="absolute -top-6 -left-6 z-10">
                              <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-background",
                                feedbackData.isCorrect 
                                  ? "bg-green-500" 
                                  : "bg-red-500"
                              )}>
                                {feedbackData.isCorrect ? (
                                  <svg 
                                    className="w-7 h-7 text-white" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                    strokeWidth="3"
                                  >
                                    <path 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                ) : (
                                  <svg 
                                    className="w-7 h-7 text-white" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                    strokeWidth="3"
                                  >
                                    <path 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <h3 className={cn(
                            "text-sm font-semibold mb-3 transition-colors duration-500",
                            hasCheckedAnswer && feedbackData
                              ? feedbackData.isCorrect
                                ? "text-green-700 dark:text-green-400"
                                : "text-red-700 dark:text-red-400"
                              : "text-muted-foreground"
                          )}>
                            Live Transcript
                            {hasCheckedAnswer && feedbackData && (
                              <span className="ml-2">
                                {feedbackData.isCorrect ? "✓" : "✗"}
                              </span>
                            )}
                          </h3>
                          
                          {/* Transcript Text */}
                          <div className="text-foreground whitespace-pre-wrap leading-relaxed mb-4">
                            {transcript || interimTranscript ? (
                              <>
                                <span className="text-foreground">{transcript}</span>
                                {interimTranscript && (
                                  <span className="text-muted-foreground italic">
                                    {transcript && ' '}
                                    {interimTranscript}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-muted-foreground italic">
                                Your speech will appear here as you speak...
                              </span>
                            )}
                          </div>
                          
                          {/* Feedback Details Section */}
                          {hasCheckedAnswer && feedbackData && (
                            <div className="mt-6 pt-4 border-t border-current/20 space-y-4">
                              {/* Quality Rating */}
                              {feedbackData.quality && (
                                <div className="flex items-center gap-2">
                                  <span className={cn(
                                    "px-4 py-2 rounded-full text-sm font-bold",
                                    feedbackData.quality === 'excellent' 
                                      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300" 
                                      : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                                  )}>
                                    {feedbackData.quality === 'excellent' ? '🌟 Excellent' : '✅ Good'}
                                  </span>
                                </div>
                              )}
                              
                              {/* Matched Required Keywords */}
                              {feedbackData.matchedKeywords.length > 0 && (
                                <div>
                                  <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                                    ✅ Matched Required Keywords ({feedbackData.matchedKeywords.length})
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {feedbackData.matchedKeywords.map((keyword, idx) => (
                                      <span
                                        key={idx}
                                        className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium"
                                      >
                                        {keyword}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Matched Optional Keywords */}
                              {feedbackData.matchedOptionalKeywords && feedbackData.matchedOptionalKeywords.length > 0 && (
                                <div>
                                  <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 mb-2">
                                    ⭐ Bonus Keywords Found! ({feedbackData.matchedOptionalKeywords.length})
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {feedbackData.matchedOptionalKeywords.map((keyword, idx) => (
                                      <span
                                        key={idx}
                                        className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium"
                                      >
                                        {keyword}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Missed Keywords */}
                              {feedbackData.missedKeywords.length > 0 && (
                                <div>
                                  <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                                    ❌ Missing Required Keywords ({feedbackData.missedKeywords.length})
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {feedbackData.missedKeywords.map((keyword, idx) => (
                                      <span
                                        key={idx}
                                        className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm font-medium"
                                      >
                                        {keyword}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Encouragement Message */}
                              <div className="text-sm text-muted-foreground italic">
                                {feedbackData.isCorrect 
                                  ? feedbackData.quality === 'excellent'
                                    ? "Keep up the amazing work! Your vocabulary is impressive! 🎉"
                                    : "Great job! Try including bonus keywords next time for an excellent rating! ⭐"
                                  : "Review the missing keywords and try again on the next question! 💪"
                                }
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div 
                          className="bg-muted/50 border border-border p-6 rounded-lg min-h-[8rem] flex items-center justify-center"
                          role="alert"
                        >
                          <p className="text-sm text-warning text-center">
                            ⚠️ Speech recognition is not supported in your browser. Audio will be recorded but transcripts will not be available.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </section>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
