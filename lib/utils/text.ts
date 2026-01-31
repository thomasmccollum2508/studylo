/**
 * Strip markdown code fences (e.g. ```html, ```) that AI models sometimes
 * return in generated content. Use when displaying or storing AI notes/summaries.
 */
export function stripMarkdownCodeFences(text: string): string {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/\s*```[a-zA-Z0-9]*\s*/g, '')
    .trim();
}
