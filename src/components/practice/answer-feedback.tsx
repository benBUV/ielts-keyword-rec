import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Star, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnswerFeedbackProps {
  isCorrect: boolean;
  quality?: 'excellent' | 'good';
  matchedKeywords: string[];
  missedKeywords: string[];
  matchedOptionalKeywords?: string[];
  onClose?: () => void;
}

export const AnswerFeedback = ({
  isCorrect,
  quality,
  matchedKeywords,
  missedKeywords,
  matchedOptionalKeywords,
}: AnswerFeedbackProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 50);
    
    // Show confetti for excellent ratings
    if (quality === 'excellent') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [quality]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* Confetti effect for excellent */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <Sparkles 
                className={cn(
                  "w-4 h-4",
                  i % 3 === 0 ? "text-yellow-400" : i % 3 === 1 ? "text-blue-400" : "text-green-400"
                )}
              />
            </div>
          ))}
        </div>
      )}

      <Card
        className={cn(
          "w-full max-w-2xl transform transition-all duration-500 border-4",
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4",
          isCorrect 
            ? quality === 'excellent'
              ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950"
              : "border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950"
            : "border-red-400 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950"
        )}
      >
        <CardContent className="p-8">
          {/* Main Icon and Title */}
          <div className="flex flex-col items-center text-center mb-6">
            {isCorrect ? (
              quality === 'excellent' ? (
                <>
                  <div className="relative mb-4">
                    <Star className="w-24 h-24 text-yellow-500 fill-yellow-400 animate-pulse" />
                    <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
                  </div>
                  <h2 className="text-4xl font-bold text-yellow-700 dark:text-yellow-300 mb-2">
                    🌟 Excellent!
                  </h2>
                  <p className="text-lg text-yellow-600 dark:text-yellow-400">
                    Outstanding response with bonus vocabulary!
                  </p>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-24 h-24 text-green-500 mb-4 animate-bounce" />
                  <h2 className="text-4xl font-bold text-green-700 dark:text-green-300 mb-2">
                    ✅ Good Job!
                  </h2>
                  <p className="text-lg text-green-600 dark:text-green-400">
                    All required keywords included!
                  </p>
                </>
              )
            ) : (
              <>
                <XCircle className="w-24 h-24 text-red-500 mb-4 animate-shake" />
                <h2 className="text-4xl font-bold text-red-700 dark:text-red-300 mb-2">
                  ⚠️ Incomplete
                </h2>
                <p className="text-lg text-red-600 dark:text-red-400">
                  Some required keywords are missing
                </p>
              </>
            )}
          </div>

          {/* Keywords Summary */}
          <div className="space-y-4">
            {/* Matched Keywords */}
            {matchedKeywords.length > 0 && (
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 border-2 border-green-300 dark:border-green-700">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-semibold text-green-700 dark:text-green-300">
                    Matched Required Keywords ({matchedKeywords.length})
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchedKeywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium animate-fadeIn"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      ✓ {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Optional Keywords */}
            {matchedOptionalKeywords && matchedOptionalKeywords.length > 0 && (
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 border-2 border-yellow-300 dark:border-yellow-700">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400 fill-yellow-500" />
                  <h3 className="font-semibold text-yellow-700 dark:text-yellow-300">
                    Bonus Keywords Found! ({matchedOptionalKeywords.length})
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchedOptionalKeywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium animate-fadeIn"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      ⭐ {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missed Keywords */}
            {missedKeywords.length > 0 && (
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 border-2 border-red-300 dark:border-red-700">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <h3 className="font-semibold text-red-700 dark:text-red-300">
                    Missing Required Keywords ({missedKeywords.length})
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {missedKeywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm font-medium animate-fadeIn"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      ✗ {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Encouragement Message */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isCorrect 
                ? quality === 'excellent'
                  ? "Keep up the amazing work! 🎉"
                  : "Great job! Try including bonus keywords next time for an excellent rating! ⭐"
                : "Review the missing keywords and try again on the next question! 💪"
              }
            </p>
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-confetti {
          animation: confetti linear forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};
