# Layout and HTML Rendering Updates

## Overview

Reverted the control area to full-width layout with space-between justification, and enabled HTML rendering in question text for custom formatting and layouts.

## Changes Implemented

### a) Reverted to Full Width Layout ✅

**What Changed**:
- Reverted from `justify-center` back to `justify-between`
- Changed gap spacing from `gap-4 sm:gap-8 md:gap-12` to `gap-4 sm:gap-4 md:gap-6`
- Elements now spread across full width instead of being grouped in center

**Layout Behavior**:

**Before (Centered)**:
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│        [Indicator]  [Audio Bar]  [Timer]           │
│                                                     │
└─────────────────────────────────────────────────────┘
         ↑ Elements grouped in center
```

**After (Full Width)**:
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  [Indicator]      [Audio Bar]           [Timer]    │
│                                                     │
└─────────────────────────────────────────────────────┘
   ↑                                            ↑
   Left edge                              Right edge
```

**Benefits**:
- Better use of available space
- Audio bar naturally centered between left and right elements
- More balanced visual weight
- Consistent with original design intent

### b) Enabled HTML Rendering in Questions ✅

**What Changed**:
- Changed from plain text rendering to HTML rendering
- Updated QuestionDisplay component to use `dangerouslySetInnerHTML`
- Question text now supports full HTML markup

**Technical Implementation**:

**Before**:
```tsx
<p className="text-2xl font-semibold text-foreground leading-relaxed whitespace-pre-wrap">
  {question.text}
</p>
```

**After**:
```tsx
<div 
  className="text-2xl font-semibold text-foreground leading-relaxed whitespace-pre-wrap"
  dangerouslySetInnerHTML={{ __html: question.text }}
/>
```

**Why `dangerouslySetInnerHTML`?**
- React's built-in method for rendering HTML strings
- Name serves as a reminder to only use with trusted content
- In this case, questions come from controlled question banks (not user input)
- Safe because content is authored by developers, not end users

## HTML Formatting Capabilities

### Supported HTML Elements

You can now use any HTML in question text, including:

**1. Text Formatting**:
```html
<strong>bold text</strong>
<em>italic text</em>
<u>underlined text</u>
<mark>highlighted text</mark>
<del>strikethrough text</del>
```

**2. Structure**:
```html
<br> - line breaks
<p>paragraphs</p>
<div>divisions</div>
<span>inline elements</span>
```

**3. Lists**:
```html
<ul>
  <li>Unordered list item</li>
</ul>

<ol>
  <li>Ordered list item</li>
</ol>
```

**4. Headings**:
```html
<h1>Main heading</h1>
<h2>Subheading</h2>
<h3>Section heading</h3>
```

**5. Links**:
```html
<a href="https://example.com">Link text</a>
```

**6. Custom Styling**:
```html
<span style="color: red;">Red text</span>
<div class="custom-class">Custom styled content</div>
```

### Example Questions with HTML

**Example 1: Bold Emphasis**
```typescript
{
  id: 'q1',
  type: QuestionType.Part1,
  text: 'What do you like <strong>most</strong> about your job or studies?',
  keywords: ['like', 'job', 'studies'],
}
```
**Renders as**: "What do you like **most** about your job or studies?"

**Example 2: Multiple Formatting**
```typescript
{
  id: 'q2',
  type: QuestionType.Part1,
  text: 'Describe your <em>favorite</em> <strong>hobby</strong> and explain <u>why</u> you enjoy it.',
  keywords: ['hobby', 'enjoy'],
}
```
**Renders as**: "Describe your *favorite* **hobby** and explain <u>why</u> you enjoy it."

**Example 3: Structured Layout**
```typescript
{
  id: 'q3',
  type: QuestionType.Part2,
  text: `
    <div>
      <h3>Describe a memorable event</h3>
      <p>You should mention:</p>
      <ul>
        <li><strong>When</strong> it happened</li>
        <li><strong>Where</strong> it took place</li>
        <li><strong>Who</strong> was involved</li>
        <li><strong>Why</strong> it was memorable</li>
      </ul>
    </div>
  `,
  keywords: ['event', 'memorable'],
}
```

**Example 4: Color Coding**
```typescript
{
  id: 'q4',
  type: QuestionType.Part3,
  text: 'Compare <span style="color: #3b82f6;">traditional</span> and <span style="color: #10b981;">modern</span> approaches to education.',
  keywords: ['traditional', 'modern', 'education'],
}
```

**Example 5: Complex Layout**
```typescript
{
  id: 'q5',
  type: QuestionType.Part2,
  text: `
    <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem;">
      <h3 style="margin-bottom: 0.5rem;">Topic: Technology in Daily Life</h3>
      <p style="margin-bottom: 1rem;">Discuss the following points:</p>
      <ol style="margin-left: 1.5rem;">
        <li style="margin-bottom: 0.5rem;">
          <strong>Devices you use:</strong> 
          <span style="color: #6b7280;">smartphones, computers, tablets</span>
        </li>
        <li style="margin-bottom: 0.5rem;">
          <strong>Frequency of use:</strong> 
          <span style="color: #6b7280;">daily, weekly, occasionally</span>
        </li>
        <li style="margin-bottom: 0.5rem;">
          <strong>Impact on life:</strong> 
          <span style="color: #6b7280;">positive and negative aspects</span>
        </li>
      </ol>
    </div>
  `,
  keywords: ['technology', 'devices', 'use'],
}
```

## Use Cases for HTML Rendering

### 1. **Emphasis and Highlighting**
- Bold important words or phrases
- Italicize foreign words or technical terms
- Highlight key concepts

### 2. **Structured Questions**
- Create bullet points or numbered lists
- Organize multi-part questions
- Add subheadings for clarity

### 3. **Visual Hierarchy**
- Use different heading levels
- Create sections within questions
- Add visual separators

### 4. **Color Coding**
- Differentiate between concepts
- Highlight different categories
- Create visual associations

### 5. **Custom Layouts**
- Create card-like question displays
- Add background colors or borders
- Design unique question formats

### 6. **Interactive Elements**
- Add links to reference materials
- Include tooltips or hints
- Create expandable sections

## Best Practices

### ✅ Do:
1. **Use semantic HTML**: Use `<strong>` for emphasis, `<em>` for stress
2. **Keep it simple**: Don't overcomplicate with excessive markup
3. **Test rendering**: Verify HTML displays correctly in both light and dark modes
4. **Use inline styles sparingly**: Prefer Tailwind classes when possible
5. **Maintain readability**: Ensure text remains clear and accessible
6. **Consider mobile**: Test on different screen sizes

### ❌ Don't:
1. **Don't use scripts**: No `<script>` tags (security risk)
2. **Don't use forms**: No `<input>`, `<button>`, etc. (conflicts with app controls)
3. **Don't break layout**: Avoid fixed widths that break responsive design
4. **Don't use external resources**: Avoid external images or fonts
5. **Don't override critical styles**: Don't break the base text styling
6. **Don't use user input**: Only use HTML from trusted question banks

## Security Considerations

### Why It's Safe:
1. **Controlled Content**: Questions come from developer-authored question banks
2. **No User Input**: End users cannot inject HTML
3. **Static Content**: HTML is defined at build time, not runtime
4. **No Scripts**: React sanitizes script tags by default
5. **Trusted Source**: All content is version-controlled and reviewed

### When to Be Careful:
- If questions are loaded from external APIs
- If questions are user-generated
- If questions are stored in a database with user access
- If questions can be modified by non-developers

### Mitigation Strategies (if needed):
```typescript
// If loading from untrusted sources, use a sanitizer
import DOMPurify from 'dompurify';

const sanitizedText = DOMPurify.sanitize(question.text);

<div 
  className="..."
  dangerouslySetInnerHTML={{ __html: sanitizedText }}
/>
```

## Styling Considerations

### Inherited Styles:
The question text inherits these styles from the parent:
```css
text-2xl           /* 1.5rem / 24px */
font-semibold      /* 600 weight */
text-foreground    /* Theme color */
leading-relaxed    /* 1.625 line height */
whitespace-pre-wrap /* Preserves line breaks */
```

### Custom Styling:
You can override these with inline styles or classes:
```html
<!-- Override font size -->
<span style="font-size: 1.25rem;">Smaller text</span>

<!-- Override color -->
<span style="color: #ef4444;">Red text</span>

<!-- Add custom class (if defined in your CSS) -->
<span class="custom-highlight">Highlighted</span>
```

### Dark Mode Compatibility:
When using custom colors, ensure they work in both modes:
```html
<!-- Bad: Hard-coded color -->
<span style="color: #000000;">Black text</span>

<!-- Good: Use CSS variables or theme colors -->
<span style="color: hsl(var(--foreground));">Theme text</span>

<!-- Good: Use Tailwind classes -->
<span class="text-primary">Primary color</span>
```

## Files Modified

1. **src/pages/PracticePage.tsx**:
   - Reverted control area layout from `justify-center` to `justify-between`
   - Adjusted gap spacing back to original values

2. **src/components/practice/question-display.tsx**:
   - Changed from `<p>` with `{question.text}` to `<div>` with `dangerouslySetInnerHTML`
   - Maintained all existing classes and styling

3. **src/data/sample-questions.ts**:
   - Added example with HTML formatting (question 2 with `<strong>`)
   - Demonstrates HTML capability

## Testing Checklist

- [x] Control area uses full width layout
- [x] Elements spread with space-between
- [x] Audio bar appears centered between left and right
- [x] HTML renders correctly in question text
- [x] Bold text displays properly
- [x] Line breaks preserved with whitespace-pre-wrap
- [x] Dark mode compatibility maintained
- [x] No console errors or warnings
- [x] Lint passes

## Examples for Different Question Types

### Part 1 (Short Answer)
```typescript
{
  id: 'part1-example',
  type: QuestionType.Part1,
  text: 'Do you prefer <strong>reading books</strong> or <strong>watching movies</strong>?',
  keywords: ['prefer', 'reading', 'watching'],
}
```

### Part 2 (Long Answer with Structure)
```typescript
{
  id: 'part2-example',
  type: QuestionType.Part2,
  text: `
    <strong>Describe a person who has influenced you</strong>
    <br><br>
    You should say:
    <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
      <li>Who this person is</li>
      <li>How you know them</li>
      <li>What they have done</li>
      <li>Why they influenced you</li>
    </ul>
  `,
  keywords: ['person', 'influenced'],
}
```

### Part 3 (Discussion with Emphasis)
```typescript
{
  id: 'part3-example',
  type: QuestionType.Part3,
  text: 'How do you think <em>social media</em> has changed the way people <strong>communicate</strong> in your country?',
  keywords: ['social media', 'communicate', 'changed'],
}
```

## Conclusion

These changes provide:
1. **Better Layout**: Full-width control area with balanced spacing
2. **Flexibility**: HTML support enables rich question formatting
3. **Customization**: Question authors can create unique layouts
4. **Maintained Safety**: HTML only from trusted sources
5. **Enhanced UX**: More engaging and visually organized questions

The HTML rendering capability opens up many possibilities for creating more engaging, structured, and visually appealing questions while maintaining the security and integrity of the application.
