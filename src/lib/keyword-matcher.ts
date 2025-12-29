/**
 * Keyword Matching Utility
 * 
 * Provides functions to match keywords in transcripts for speech recognition evaluation
 */

/**
 * Simple word stemming - removes common suffixes
 * This is a basic implementation for common English word variations
 */
function stemWord(word: string): string {
  const lowerWord = word.toLowerCase();
  
  // Remove common suffixes
  const suffixes = ['ing', 'ed', 'es', 's', 'ly', 'er', 'est'];
  
  for (const suffix of suffixes) {
    if (lowerWord.endsWith(suffix) && lowerWord.length > suffix.length + 2) {
      return lowerWord.slice(0, -suffix.length);
    }
  }
  
  return lowerWord;
}

/**
 * Normalize text for matching - converts to lowercase and removes punctuation
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Check if a keyword (or its variations) exists in the transcript
 */
function isKeywordInTranscript(keyword: string, transcript: string): boolean {
  const normalizedTranscript = normalizeText(transcript);
  const normalizedKeyword = normalizeText(keyword);
  
  // Direct match
  if (normalizedTranscript.includes(normalizedKeyword)) {
    return true;
  }
  
  // Check for stemmed variations
  const transcriptWords = normalizedTranscript.split(' ');
  const keywordWords = normalizedKeyword.split(' ');
  
  // For multi-word keywords, check if all words are present (not necessarily consecutive)
  if (keywordWords.length > 1) {
    return keywordWords.every(kw => 
      transcriptWords.some(tw => 
        tw === kw || stemWord(tw) === stemWord(kw)
      )
    );
  }
  
  // For single-word keywords, check with stemming
  const stemmedKeyword = stemWord(normalizedKeyword);
  return transcriptWords.some(word => 
    word === normalizedKeyword || stemWord(word) === stemmedKeyword
  );
}

/**
 * Match keywords in a transcript and return results with quality rating
 * 
 * @param requiredKeywords - Array of required keywords to match
 * @param transcript - The transcript text to search in
 * @param optionalKeywords - Optional array of keywords for "excellent" rating
 * @returns Object containing matched and missed keywords, correctness status, and quality rating
 */
export function matchKeywords(
  requiredKeywords: string[],
  transcript: string,
  optionalKeywords?: string[]
): {
  isCorrect: boolean;
  quality?: 'excellent' | 'good';
  matchedKeywords: string[];
  missedKeywords: string[];
  matchedOptionalKeywords?: string[];
} {
  const matchedKeywords: string[] = [];
  const missedKeywords: string[] = [];
  
  // Check required keywords
  for (const keyword of requiredKeywords) {
    if (isKeywordInTranscript(keyword, transcript)) {
      matchedKeywords.push(keyword);
    } else {
      missedKeywords.push(keyword);
    }
  }
  
  const isCorrect = missedKeywords.length === 0 && requiredKeywords.length > 0;
  
  // Check optional keywords if provided and all required keywords are matched
  let quality: 'excellent' | 'good' | undefined;
  let matchedOptionalKeywords: string[] | undefined;
  
  if (isCorrect && optionalKeywords && optionalKeywords.length > 0) {
    matchedOptionalKeywords = [];
    for (const keyword of optionalKeywords) {
      if (isKeywordInTranscript(keyword, transcript)) {
        matchedOptionalKeywords.push(keyword);
      }
    }
    
    // If at least one optional keyword is found, it's excellent, otherwise good
    quality = matchedOptionalKeywords.length > 0 ? 'excellent' : 'good';
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
 * Get a percentage score based on keyword matching
 */
export function getKeywordMatchScore(
  keywords: string[],
  transcript: string
): number {
  if (keywords.length === 0) return 0;
  
  const { matchedKeywords } = matchKeywords(keywords, transcript);
  return Math.round((matchedKeywords.length / keywords.length) * 100);
}
