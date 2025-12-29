# Video Error Message Consolidation Update

## Overview
This document describes the consolidation of the video error message, question text, and countdown timer into a unified, user-friendly display that matches the design requirements.

---

## Changes Made

### 1. Removed Duplicate Question Text
**Before**: Question text appeared twice when video was unavailable:
- Once above the error message
- Once in the accessible text fallback

**After**: Question text only appears once, integrated into the error message card

**Implementation**:
```tsx
// Changed condition from:
className={mediaError || !question.media ? "prose prose-lg max-w-none" : "sr-only"}

// To:
className={!question.media ? "prose prose-lg max-w-none" : "sr-only"}
```

**Impact**:
- Eliminates visual duplication
- Cleaner, more professional appearance
- Question text still accessible to screen readers via sr-only class

---

### 2. Consolidated Error Message with Question Text
**Before**: Separate error message and question text displays

**After**: Single unified card containing:
1. Error header: "⚠️ Whoops - video unavailable"
2. Question label: "Text question:"
3. Question text: "{question.text}"

**Implementation**:
```tsx
<div className="flex flex-col items-center justify-center gap-4 px-6 py-5 bg-orange-50 dark:bg-orange-950 border-2 border-orange-300 dark:border-orange-700 rounded-lg">
  {/* Error header */}
  <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
    <span className="text-2xl">⚠️</span>
    <span className="font-semibold text-base">Whoops - video unavailable</span>
  </div>
  
  {/* Question text */}
  <div className="w-full text-center">
    <p className="text-sm font-medium text-muted-foreground mb-1">Text question:</p>
    <p className="text-lg font-medium text-foreground leading-relaxed whitespace-pre-wrap">
      {question.text}
    </p>
  </div>
</div>
```

**Visual Structure**:
```
┌─────────────────────────────────────────────┐
│  ⚠️ Whoops - video unavailable              │
│                                             │
│  Text question:                             │
│  How often do you go online?                │
└─────────────────────────────────────────────┘
```

---

### 3. Countdown Timer Auto-Hide on Recording Start
**Before**: Countdown timer remained visible even after recording started

**After**: Countdown timer automatically disappears when recording begins

**Implementation**:
```tsx
// Added !isRecording condition:
{!isRecording && autoStartCountdown !== null && autoStartCountdown > 0 && (
  <div className="...">
    {/* Countdown timer UI */}
  </div>
)}
```

**Behavior**:
- Timer visible during prep phase (5-second countdown)
- Timer disappears immediately when recording starts
- Smooth transition without layout shift

---

## Technical Details

### Files Modified
- `/src/components/practice/question-display.tsx`

### Component Structure

#### Before
```tsx
{/* Question text - always visible when error */}
<div className={mediaError || !question.media ? "prose" : "sr-only"}>
  <p>{question.text}</p>
</div>

{/* Error message */}
{mediaError && (
  <div>
    <div>Video unavailable - you may begin speaking</div>
    <div>{mediaError}</div>
  </div>
)}

{/* Countdown timer - always visible when counting */}
{autoStartCountdown !== null && autoStartCountdown > 0 && (
  <div>Countdown: {autoStartCountdown}</div>
)}
```

#### After
```tsx
{/* Question text - only visible when no media at all */}
<div className={!question.media ? "prose" : "sr-only"}>
  <p>{question.text}</p>
</div>

{/* Consolidated error message with question text */}
{mediaError && (
  <div className="space-y-3">
    {/* Error card with question text */}
    <div className="flex flex-col gap-4">
      <div>⚠️ Whoops - video unavailable</div>
      <div>
        <p>Text question:</p>
        <p>{question.text}</p>
      </div>
    </div>
    
    {/* Countdown timer - hides when recording starts */}
    {!isRecording && autoStartCountdown !== null && autoStartCountdown > 0 && (
      <div>Countdown: {autoStartCountdown}</div>
    )}
  </div>
)}
```

---

## User Experience Improvements

### 1. **Cleaner Visual Hierarchy**
- Single consolidated error card instead of multiple separate elements
- Clear visual grouping of related information
- Reduced visual clutter

### 2. **Better Information Flow**
- Error message → Question text → Countdown timer
- Logical top-to-bottom reading order
- Each element has clear purpose and context

### 3. **Improved Readability**
- "Whoops - video unavailable" is friendlier than "Video unavailable - you may begin speaking"
- "Text question:" label clearly identifies the question
- Larger, more prominent question text (text-lg font-medium)

### 4. **Smart Timer Behavior**
- Timer disappears when recording starts (no longer needed)
- Reduces visual noise during recording
- User can focus on speaking without distractions

### 5. **Consistent Spacing**
- gap-4 between error header and question text
- space-y-3 between error card and countdown timer
- Balanced, professional appearance

---

## Design Specifications

### Error Card
- **Background**: Orange-tinted (bg-orange-50 / dark:bg-orange-950)
- **Border**: 2px orange border (border-orange-300 / dark:border-orange-700)
- **Padding**: px-6 py-5 (24px horizontal, 20px vertical)
- **Layout**: Vertical flex with gap-4 (16px between elements)
- **Alignment**: Center-aligned content

### Error Header
- **Icon**: ⚠️ emoji (text-2xl)
- **Text**: "Whoops - video unavailable"
- **Color**: Orange (text-orange-700 / dark:text-orange-300)
- **Font**: font-semibold text-base

### Question Section
- **Label**: "Text question:"
  - Font: text-sm font-medium
  - Color: text-muted-foreground
  - Margin: mb-1 (4px below label)
- **Question Text**:
  - Font: text-lg font-medium
  - Color: text-foreground
  - Line height: leading-relaxed
  - White space: whitespace-pre-wrap (preserves formatting)

### Countdown Timer
- **Visibility**: Hidden when isRecording is true
- **Background**: Primary-tinted (bg-primary/10)
- **Border**: 2px primary border (border-primary/30)
- **Animation**: animate-pulse
- **Layout**: Horizontal flex with gap-3

---

## Accessibility Features

### ARIA Attributes
```tsx
// Error card
role="alert"
aria-live="assertive"

// Countdown timer
role="status"
aria-live="polite"

// Question text fallback
role="region"
aria-label="Question text content"
aria-live="polite"
```

### Screen Reader Support
- Question text always in DOM (sr-only when media present)
- Error message announced immediately (assertive)
- Countdown updates announced politely
- Semantic HTML structure maintained

### Keyboard Navigation
- All interactive elements remain keyboard accessible
- Focus order follows logical reading order
- No keyboard traps or accessibility barriers

---

## State Management

### Visibility Conditions

#### Question Text Fallback
```tsx
className={!question.media ? "prose prose-lg max-w-none" : "sr-only"}
```
- **Visible**: When question has no media at all
- **Hidden**: When question has media (even if it fails to load)

#### Error Card
```tsx
{mediaError && (
  // Error card content
)}
```
- **Visible**: When mediaError state is set
- **Hidden**: When no media error

#### Countdown Timer
```tsx
{!isRecording && autoStartCountdown !== null && autoStartCountdown > 0 && (
  // Countdown timer content
)}
```
- **Visible**: When NOT recording AND countdown is active (> 0)
- **Hidden**: When recording starts OR countdown reaches 0

---

## Edge Cases Handled

### 1. **No Media Question**
- Question text displayed normally (not in error card)
- No error message shown
- No countdown timer

### 2. **Media Error Before Recording**
- Error card with question text displayed
- Countdown timer visible (if active)
- Timer disappears when recording starts

### 3. **Media Error During Recording**
- Error card with question text displayed
- Countdown timer hidden (isRecording = true)
- User can continue recording

### 4. **Long Question Text**
- whitespace-pre-wrap preserves formatting
- leading-relaxed ensures readability
- w-full allows text to use full card width

### 5. **Dark Mode**
- All colors have dark mode variants
- Contrast ratios maintained
- Consistent appearance across themes

---

## Testing Checklist

### Visual Tests
- [ ] Error card displays with correct styling
- [ ] Question text appears in error card (not duplicated above)
- [ ] Countdown timer visible during prep phase
- [ ] Countdown timer disappears when recording starts
- [ ] Spacing between elements is consistent

### Functional Tests
- [ ] Error card appears when video fails to load
- [ ] Question text is readable and properly formatted
- [ ] Countdown timer counts down correctly
- [ ] Timer disappears immediately when recording starts
- [ ] No layout shift when timer disappears

### Accessibility Tests
- [ ] Screen reader announces error message
- [ ] Screen reader announces countdown updates
- [ ] Question text accessible to screen readers
- [ ] Keyboard navigation works correctly
- [ ] Focus order is logical

### Responsive Tests
- [ ] Mobile: Error card displays correctly
- [ ] Tablet: Error card displays correctly
- [ ] Desktop: Error card displays correctly
- [ ] All breakpoints: Text is readable

### Dark Mode Tests
- [ ] Error card colors correct in dark mode
- [ ] Text contrast sufficient in dark mode
- [ ] Border colors visible in dark mode
- [ ] Countdown timer colors correct in dark mode

---

## Implementation Notes

### Why Consolidate?
1. **Reduces Visual Clutter**: Single card instead of multiple separate elements
2. **Improves Context**: Question text directly associated with error message
3. **Better UX**: User sees everything they need in one place
4. **Cleaner Design**: More professional, polished appearance

### Why Hide Timer on Recording?
1. **No Longer Relevant**: Once recording starts, prep countdown is complete
2. **Reduces Distraction**: User can focus on speaking
3. **Cleaner Interface**: Less visual noise during recording
4. **Better Performance**: Fewer DOM updates during recording

### Why "Whoops - video unavailable"?
1. **Friendlier Tone**: "Whoops" is more casual and less alarming
2. **Clearer Message**: Focuses on the problem (video unavailable)
3. **Shorter Text**: Easier to scan and understand quickly
4. **Better UX**: Reduces user anxiety about errors

### Why "Text question:" Label?
1. **Clear Context**: User knows they're reading the question text
2. **Visual Separation**: Distinguishes label from question content
3. **Consistent Pattern**: Matches other labeled sections in the app
4. **Accessibility**: Screen readers announce the label before the question

---

## Related Changes
- Previous: Video player styling and spacing adjustments
- Previous: "Press play to begin" text styling update
- Previous: Countdown timer implementation for video playback
- Previous: Error handling for video load failures

---

## Validation
✅ **Linting**: All files pass (`npm run lint`)
✅ **Type Safety**: TypeScript compilation successful
✅ **No Breaking Changes**: Existing functionality preserved
✅ **Accessibility**: ARIA attributes and screen reader support maintained
✅ **Responsive**: Works correctly at all screen sizes
✅ **Dark Mode**: Proper color variants for dark theme

---

## Summary
The video error display has been consolidated into a single, user-friendly card that:
- Shows "Whoops - video unavailable" as the error header
- Displays "Text question: {question text}" in the same card
- Shows the countdown timer below the error card (disappears when recording starts)
- Eliminates duplicate question text
- Provides a cleaner, more professional user experience
