/**
 * Keyword Matching Utility
 *
 * Optimized for runtime efficiency and deterministic matching.
 */

/**
 * Simple word stemming - removes common suffixes
 */
function stemWord(word: string): string {
  const lowerWord = word.toLowerCase();

  const suffixes = ["ing", "ed", "es", "s", "ly", "er", "est"];

  for (const suffix of suffixes) {
    if (lowerWord.endsWith(suffix) && lowerWord.length > suffix.length + 2) {
      return lowerWord.slice(0, -suffix.length);
    }
  }

  return lowerWord;
}

/**
 * Normalize text for matching
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Check if keyword exists in transcript
 */
function isKeywordInTranscript(
  keyword: string,
  transcriptWords: string[],
  transcriptSet: Set<string>,
  transcriptText: string
): boolean {
  const normalizedKeyword = normalizeText(keyword);

  // Fast phrase check
  if (normalizedKeyword.includes(" ")) {
    return transcriptText.includes(normalizedKeyword);
  }

  // Fast direct lookup
  if (transcriptSet.has(normalizedKeyword)) {
    return true;
  }

  // Stem comparison
  const stemmedKeyword = stemWord(normalizedKeyword);

  for (const word of transcriptWords) {
    if (stemWord(word) === stemmedKeyword) {
      return true;
    }
  }

  return false;
}

/**
 * Match keywords in transcript
 */
export function matchKeywords(
  requiredKeywords: string[],
  transcript: string,
  optionalKeywords?: string[]
): {
  isCorrect: boolean;
  quality?: "excellent" | "good";
  matchedKeywords: string[];
  missedKeywords: string[];
  matchedOptionalKeywords?: string[];
} {
  const normalizedTranscript = normalizeText(transcript);

  const transcriptWords = normalizedTranscript.length
    ? normalizedTranscript.split(" ")
    : [];

  const transcriptSet = new Set(transcriptWords);

  const matchedKeywords: string[] = [];
  const missedKeywords: string[] = [];

  // Required keywords
  for (const keyword of requiredKeywords) {
    if (
      isKeywordInTranscript(
        keyword,
        transcriptWords,
        transcriptSet,
        normalizedTranscript
      )
    ) {
      matchedKeywords.push(keyword);
    } else {
      missedKeywords.push(keyword);
    }
  }

  const isCorrect =
    requiredKeywords.length === 0 || missedKeywords.length === 0;

  let quality: "excellent" | "good" | undefined;
  let matchedOptionalKeywords: string[] | undefined;

  // Optional keywords
  if (isCorrect && optionalKeywords && optionalKeywords.length > 0) {
    matchedOptionalKeywords = [];

    for (const keyword of optionalKeywords) {
      if (
        isKeywordInTranscript(
          keyword,
          transcriptWords,
          transcriptSet,
          normalizedTranscript
        )
      ) {
        matchedOptionalKeywords.push(keyword);
      }
    }

    quality = matchedOptionalKeywords.length > 0 ? "excellent" : "good";
  }

  return {
    isCorrect,
    quality,
    matchedKeywords,
    missedKeywords,
    matchedOptionalKeywords,
  };
}

/**
 * Get percentage score
 */
export function getKeywordMatchScore(
  keywords: string[],
  transcript: string
): number {
  if (keywords.length === 0) return 100;

  const { matchedKeywords } = matchKeywords(keywords, transcript);

  return Math.round((matchedKeywords.length / keywords.length) * 100);
}