import { Card, CardContent } from '@/components/ui/card';
import { Question } from '@/types';
import { decodeHtmlEntities } from '@/lib/html-utils';

interface QuestionDisplayProps {
  question: Question;
  currentQuestionIndex?: number;
  totalQuestions?: number;
  isRecording?: boolean;
  isPaused?: boolean;
  showKeywords?: boolean; // Control whether to display keywords
  showPlaceholder?: boolean; // Show placeholder instead of question (for video watching)
}

export const QuestionDisplay = ({ 
  question, 
  currentQuestionIndex,
  totalQuestions,
  isRecording = false,
  isPaused = false,
  showKeywords = true, // Show keywords by default
  showPlaceholder = false, // Show placeholder for video watching
}: QuestionDisplayProps) => {
  // Determine if card should be shown (for Part 2 questions during recording)
  const showCard = question.card && question.type === 'part2' && isRecording && !isPaused;

  // Decode HTML entities in question text
  const decodedQuestionText = decodeHtmlEntities(question.text);

  return (
    <Card className="w-full border-[0px] border-solid border-[rgb(225,231,239)]">
      <CardContent className="px-0 sm:px-4 md:px-6 pb-0 sm:pb-4 md:pb-6">
        <div className="space-y-5">

          {/* Question Counter */}
          {currentQuestionIndex !== undefined && totalQuestions !== undefined && (
            <div className="px-5 sm:px-0">
              <p className="w-full sm:min-w-[600px] sm:w-[70%] sm:max-w-4xl mx-auto text-left text-foreground mb-[5px]">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>
          )}

          {/* Question Text - Always visible and prominent */}
          <div 
            id={`question-text-${question.id}`}
            className="px-5 sm:px-0"
            role="region"
            aria-label="Question text content"
            aria-live="polite"
          >
            <div className="w-full sm:min-w-[600px] sm:w-[70%] sm:max-w-4xl mx-auto">
              <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6">
                {showPlaceholder ? (
                  // Placeholder when video hasn't been watched
                  <div className="text-2xl font-semibold text-muted-foreground leading-relaxed text-center py-8">
                    <p className="mb-2">📹</p>
                    <p>Watch the full video to show question</p>
                  </div>
                ) : (
                  // Actual question content
                  <div 
                    className="question-html-content text-xl text-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: decodedQuestionText }}
                  />
                )}
                {!showPlaceholder && showKeywords && question.keywords && question.keywords.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-primary/20">
                    <p className="text-sm text-muted-foreground mb-2">
                      💡 Required keywords:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {question.keywords.map((keyword, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {!showPlaceholder && showKeywords && question.optionalKeywords && question.optionalKeywords.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground mb-2">
                      ⭐ Bonus keywords:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {question.optionalKeywords.map((keyword, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Part 2 Cue Card - Show when recording for Part 2 questions */}
          {showCard && (
            <div className="px-5 sm:px-0">
              <div className="w-full sm:min-w-[600px] sm:w-[70%] sm:max-w-4xl mx-auto">
                <div className="mt-6 p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary rounded-lg">
                  <h3 className="text-xl font-bold text-primary mb-4">
                    {question.card.title}
                  </h3>
                  
                  {question.card.subtitle && (
                    <p className="font-semibold text-foreground mb-3 text-base">
                      {question.card.subtitle}
                    </p>
                  )}
                  
                  <ul className="space-y-3">
                    {question.card.bullets.map((bullet, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-primary font-bold text-lg mt-0.5">•</span>
                        <span className="text-foreground text-base leading-relaxed">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
