/**
 * HTML utility functions for decoding and sanitizing HTML content
 */

/**
 * Decode HTML entities in a string
 * Converts &lt; to <, &gt; to >, &amp; to &, etc.
 * 
 * @param html - String containing HTML entities
 * @returns Decoded HTML string
 */
export const decodeHtmlEntities = (html: string): string => {
  if (!html) return '';
  
  // Create a temporary textarea element to leverage browser's built-in HTML entity decoding
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
};

/**
 * Decode HTML entities and prepare for rendering
 * This function is safe to use with dangerouslySetInnerHTML for trusted content
 * 
 * @param html - String containing HTML entities
 * @returns Decoded HTML string ready for rendering
 */
export const prepareHtmlForRendering = (html: string): string => {
  if (!html) return '';
  
  // Decode HTML entities
  const decoded = decodeHtmlEntities(html);
  
  return decoded;
};