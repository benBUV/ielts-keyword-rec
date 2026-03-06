import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type FeedbackData = {
  isCorrect: boolean;
  quality?: "excellent" | "good";
  matchedKeywords: string[];
  missedKeywords: string[];
  matchedOptionalKeywords?: string[];
  hasOptionalKeywords: boolean;
};

type Props = {
  feedbackData: FeedbackData | null;
  hasCheckedAnswer: boolean;
};

export function AnswerFeedback({ feedbackData, hasCheckedAnswer }: Props) {
  if (!hasCheckedAnswer || !feedbackData) return null;

  const {
    isCorrect,
    quality,
    matchedKeywords,
    missedKeywords,
    matchedOptionalKeywords = [],
    hasOptionalKeywords,
  } = feedbackData;

  return (
    <Card
      className={cn(
        "mt-6 border-2",
        isCorrect
          ? "border-green-500 bg-green-50 dark:bg-green-950/30"
          : "border-red-500 bg-red-50 dark:bg-red-950/30"
      )}
    >
      <CardContent className="pt-6 space-y-6">

        {/* Result */}
        <div className="text-center text-lg font-semibold">
          {isCorrect ? "✅ Correct answer!" : "❌ Not quite right"}
        </div>

        {/* Quality Rating */}
        {quality && (
          <div className="flex justify-center">
            <span
              className={cn(
                "px-4 py-2 rounded-full text-sm font-bold",
                quality === "excellent"
                  ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                  : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
              )}
            >
              {quality === "excellent" ? "🌟 Excellent" : "✅ Good"}
            </span>
          </div>
        )}

        {/* Matched Required Keywords */}
        {matchedKeywords.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
              ✅ Matched Required Keywords ({matchedKeywords.length})
            </p>

            <div className="flex flex-wrap gap-2">
              {matchedKeywords.map((keyword, idx) => (
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

        {/* Bonus Keywords */}
        {hasOptionalKeywords && matchedOptionalKeywords.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 mb-2">
              ⭐ Bonus Keywords Found! ({matchedOptionalKeywords.length})
            </p>

            <div className="flex flex-wrap gap-2">
              {matchedOptionalKeywords.map((keyword, idx) => (
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

        {/* Missing Keywords */}
        {missedKeywords.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
              ❌ Missing Required Keywords ({missedKeywords.length})
            </p>

            <div className="flex flex-wrap gap-2">
              {missedKeywords.map((keyword, idx) => (
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
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground italic">
            {isCorrect
              ? quality === "excellent"
                ? "Keep up the amazing work! 🎉"
                : hasOptionalKeywords
                ? "Great job! Try including bonus keywords next time for an excellent rating! ⭐"
                : "Great job!"
              : "Review the missing keywords and try again on the next question! 💪"}
          </p>
        </div>

      </CardContent>
    </Card>
  );
}