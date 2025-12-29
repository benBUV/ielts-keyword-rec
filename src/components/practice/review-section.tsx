import { useState } from 'react';
import { Play, Pause, Download, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Recording, Question } from '@/types';
import { cn } from '@/lib/utils';

interface ReviewSectionProps {
  recordings: Recording[];
  questions: Question[];
  onDownloadIndividual: (recordingId: string) => void;
  onDownloadMerged: () => void;
}

export const ReviewSection = ({
  recordings,
  questions,
  onDownloadIndividual,
  onDownloadMerged,
}: ReviewSectionProps) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioElements] = useState<Map<string, HTMLAudioElement>>(new Map());

  console.log('ReviewSection rendering with recordings:', recordings.length);
  recordings.forEach((rec, idx) => {
    console.log(`Review Recording ${idx + 1}:`, {
      id: rec.id,
      transcript: rec.transcript,
      transcriptLength: rec.transcript?.length || 0,
      hasTranscript: !!rec.transcript,
      isCorrect: rec.isCorrect,
      matchedKeywords: rec.matchedKeywords?.length || 0,
      missedKeywords: rec.missedKeywords?.length || 0,
    });
  });

  const handlePlayPause = (recording: Recording) => {
    if (playingId === recording.id) {
      const audio = audioElements.get(recording.id);
      audio?.pause();
      setPlayingId(null);
    } else {
      audioElements.forEach((audio, id) => {
        if (id !== recording.id) {
          audio.pause();
        }
      });

      let audio = audioElements.get(recording.id);
      if (!audio) {
        audio = new Audio(URL.createObjectURL(recording.audioBlob));
        audio.onended = () => setPlayingId(null);
        audioElements.set(recording.id, audio);
      }

      audio.play();
      setPlayingId(recording.id);
    }
  };

  const getQuestionForRecording = (recording: Recording) => {
    return questions.find((q) => q.id === recording.questionId);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate overall score
  const correctCount = recordings.filter(r => r.isCorrect).length;
  const totalCount = recordings.length;
  const scorePercentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            Well done! Review your response(s) below
          </h2>
          <Button onClick={onDownloadMerged} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Download All
          </Button>
        </div>
        
        {/* Overall Score Card */}
        <Card className={cn(
          "border-2",
          scorePercentage >= 80 ? "border-green-500 bg-green-50 dark:bg-green-950" :
          scorePercentage >= 60 ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950" :
          "border-red-500 bg-red-50 dark:bg-red-950"
        )}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Overall Score</p>
                <p className="text-3xl font-bold text-foreground">
                  {correctCount} / {totalCount} Correct
                </p>
                <p className="text-lg text-muted-foreground mt-1">
                  {scorePercentage}% Keywords Matched
                </p>
              </div>
              <div className={cn(
                "text-6xl",
                scorePercentage >= 80 ? "text-green-500" :
                scorePercentage >= 60 ? "text-yellow-500" :
                "text-red-500"
              )}>
                {scorePercentage >= 80 ? "🎉" : scorePercentage >= 60 ? "👍" : "📝"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {recordings.map((recording, index) => {
          const question = getQuestionForRecording(recording);
          const isPlaying = playingId === recording.id;

          return (
            <Card key={recording.id} className={cn(
              "border-2",
              recording.isCorrect ? "border-green-500/30" : "border-red-500/30"
            )}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {recording.isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                    <span className="text-lg">
                      Question {index + 1} - {question?.type.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-normal text-muted-foreground">
                    {formatDuration(recording.duration)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Question:</p>
                  <p className="text-foreground">{question?.text}</p>
                </div>

                {/* Keyword Matching Results */}
                {question?.keywords && question.keywords.length > 0 && (
                  <div className="space-y-3">
                    {/* Quality Rating Badge */}
                    {recording.quality && (
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-4 py-2 rounded-full text-sm font-bold",
                          recording.quality === 'excellent' 
                            ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300" 
                            : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        )}>
                          {recording.quality === 'excellent' ? '🌟 Excellent' : '✅ Good'}
                        </span>
                      </div>
                    )}
                    
                    {recording.matchedKeywords && recording.matchedKeywords.length > 0 && (
                      <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">
                          ✅ Matched Required Keywords ({recording.matchedKeywords.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {recording.matchedKeywords.map((keyword, idx) => (
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
                    
                    {recording.matchedOptionalKeywords && recording.matchedOptionalKeywords.length > 0 && (
                      <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
                          ⭐ Matched Bonus Keywords ({recording.matchedOptionalKeywords.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {recording.matchedOptionalKeywords.map((keyword, idx) => (
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
                    
                    {recording.missedKeywords && recording.missedKeywords.length > 0 && (
                      <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
                        <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
                          ❌ Missed Required Keywords ({recording.missedKeywords.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {recording.missedKeywords.map((keyword, idx) => (
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
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => handlePlayPause(recording)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Play
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => onDownloadIndividual(recording.id)}
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>

                {recording.transcript && (
                  <div className="bg-secondary p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Transcript:</p>
                    <p className="text-foreground whitespace-pre-wrap">{recording.transcript}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
