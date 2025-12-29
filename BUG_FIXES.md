# Bug Fixes - Toast Duplication & Button Alignment

## Date: 2025-11-18

---

## Issue #1: Toast Appearing Multiple Times

### Problem Description
The "Let me stop you there" toast message was appearing and disappearing 3 times when the stop time was reached.

### Root Cause
The auto-transition `useEffect` hook was running multiple times because:
1. The effect depends on `totalSpeechTime` which updates every second
2. Once `totalSpeechTime >= stopTime`, the condition remained true for subsequent renders
3. Each time the effect ran with the condition true, it triggered the toast and setTimeout again
4. This resulted in multiple toast notifications and multiple calls to `handleNextQuestion`

### Solution
Implemented a **ref-based flag** to ensure the stop sequence only triggers once per question:

1. **Added useRef**: Created `hasTriggeredStopRef` to track if stop sequence has been triggered
2. **Check before trigger**: Only execute stop logic if `!hasTriggeredStopRef.current`
3. **Set flag**: Mark `hasTriggeredStopRef.current = true` when stop sequence starts
4. **Reset on transition**: Reset flag to `false` in both `handleNextQuestion` and `handleStopRecording`

### Code Changes

#### 1. Import useRef
```tsx
// Before
import { useState, useEffect, useCallback } from 'react';

// After
import { useState, useEffect, useCallback, useRef } from 'react';
```

#### 2. Add ref declaration
```tsx
const [isTransitioning, setIsTransitioning] = useState(false);

// Added ref to track if stop sequence has been triggered for current question
const hasTriggeredStopRef = useRef(false);
```

#### 3. Update auto-transition logic
```tsx
// Before
if (totalSpeechTime >= stopTime) {
  // Toast and transition logic
}

// After
if (totalSpeechTime >= stopTime && !hasTriggeredStopRef.current) {
  hasTriggeredStopRef.current = true; // Mark as triggered
  // Toast and transition logic
}
```

#### 4. Reset flag in handleNextQuestion
```tsx
const handleNextQuestion = async () => {
  console.log('🔄 [PracticePage] ========== handleNextQuestion START ==========');
  console.log('📊 [PracticePage] Current question:', currentQuestion.id);
  console.log('📊 [PracticePage] isRecording:', isRecording);
  
  // Reset the stop trigger flag for the next question
  hasTriggeredStopRef.current = false;
  
  // ... rest of function
}
```

#### 5. Reset flag in handleStopRecording
```tsx
const handleStopRecording = async () => {
  console.log('🛑 [PracticePage] ========== handleStopRecording START ==========');
  console.log('📊 [PracticePage] Current question:', currentQuestion.id);
  console.log('📊 [PracticePage] isRecording:', isRecording);
  
  // Reset the stop trigger flag
  hasTriggeredStopRef.current = false;
  
  // ... rest of function
}
```

### Testing Scenarios

#### Scenario 1: Normal Stop Sequence
1. User speaks continuously past stop time
2. Toast appears **once**: "Let me stop you there"
3. After 2 seconds, transitions to next question
4. No duplicate toasts

#### Scenario 2: Multiple Questions
1. First question: Stop sequence triggers once
2. Transition to second question
3. Flag resets to `false`
4. Second question: Stop sequence can trigger again
5. Each question gets exactly one toast

#### Scenario 3: Part 2 Completion
1. User speaks for 2 minutes + 5 seconds
2. Toast appears **once**: "That's two minutes, great job!"
3. After 2 seconds, recording stops
4. Review screen appears
5. No duplicate toasts

### Benefits
✅ **Single Toast**: Each stop sequence triggers exactly once
✅ **Clean Transitions**: No multiple calls to handleNextQuestion
✅ **Predictable Behavior**: Consistent user experience
✅ **Performance**: Prevents unnecessary function calls and state updates

---

## Issue #2: Unequal Button Widths

### Problem Description
The control buttons (Pause/Resume and Next Question/Finish) had different widths based on their text content, causing misalignment and poor visual balance.

### Root Cause
Buttons were using `min-w-[44px]` which only set a minimum width, allowing them to grow based on content:
- "Pause" button: Shorter text = narrower button
- "Next Question" button: Longer text = wider button
- "Resume" vs "Pause": Different widths when toggling
- "Finish" vs "Next Question": Different widths on last question

### Solution
Set a **fixed width** of `180px` for both buttons to ensure consistent sizing regardless of content.

### Code Changes

#### Before
```tsx
<Button 
  className={cn(
    "gap-2 min-h-[44px] min-w-[44px] transition-all duration-200",
    // ... other classes
  )}
>
  {isPaused ? (
    <>
      <Play className="w-5 h-5" aria-hidden="true" />
      Resume
    </>
  ) : (
    <>
      <Pause className="w-5 h-5" aria-hidden="true" />
      Pause
    </>
  )}
</Button>

<Button 
  className={cn(
    "gap-2 min-h-[44px] min-w-[44px] transition-all duration-200",
    // ... other classes
  )}
>
  {/* Next Question or Finish */}
</Button>
```

#### After
```tsx
<Button 
  className={cn(
    "gap-2 min-h-[44px] w-[180px] transition-all duration-200",
    // ... other classes
  )}
>
  {isPaused ? (
    <>
      <Play className="w-5 h-5" aria-hidden="true" />
      Resume
    </>
  ) : (
    <>
      <Pause className="w-5 h-5" aria-hidden="true" />
      Pause
    </>
  )}
</Button>

<Button 
  className={cn(
    "gap-2 min-h-[44px] w-[180px] transition-all duration-200",
    // ... other classes
  )}
>
  {/* Next Question or Finish */}
</Button>
```

### Visual Comparison

#### Before (Unequal Widths)
```
┌─────────────┐  ┌──────────────────────┐
│   Pause     │  │   Next Question      │
└─────────────┘  └──────────────────────┘
   Narrower           Wider
```

#### After (Equal Widths)
```
┌──────────────────────┐  ┌──────────────────────┐
│       Pause          │  │   Next Question      │
└──────────────────────┘  └──────────────────────┘
     180px                      180px
```

### Benefits
✅ **Visual Balance**: Both buttons have identical width
✅ **Central Alignment**: Buttons are properly centered as a group
✅ **Consistent Layout**: No layout shift when text changes (Pause ↔ Resume, Next Question ↔ Finish)
✅ **Professional Appearance**: Clean, symmetrical button group
✅ **Better UX**: Predictable button positions improve muscle memory

### Width Selection Rationale
- **180px chosen** to comfortably fit the longest text: "Next Question"
- Provides adequate padding around text and icon
- Maintains responsive design (buttons stack on mobile if needed)
- Consistent with size="lg" button styling

---

## Files Modified

### src/pages/PracticePage.tsx
**Lines changed**: 
- Line 1: Added `useRef` import
- Line 30: Added `hasTriggeredStopRef` declaration
- Line 259: Added ref check in auto-transition condition
- Line 260: Set ref to true when triggered
- Line 373: Reset ref in `handleStopRecording`
- Line 452: Reset ref in `handleNextQuestion`
- Line 763: Changed button width from `min-w-[44px]` to `w-[180px]`
- Line 786: Changed button width from `min-w-[44px]` to `w-[180px]`

---

## Testing Checklist

### Issue #1: Toast Duplication
- [x] Toast appears exactly once when stop time reached
- [x] No duplicate toasts on Part 1 questions
- [x] No duplicate toasts on Part 2 questions
- [x] No duplicate toasts on Part 3 questions
- [x] Flag resets properly between questions
- [x] Multiple questions in sequence work correctly

### Issue #2: Button Alignment
- [x] Both buttons have equal width (180px)
- [x] Buttons remain centered as a group
- [x] No layout shift when toggling Pause ↔ Resume
- [x] No layout shift when showing Finish vs Next Question
- [x] Text and icons are properly centered within buttons
- [x] Buttons maintain equal width on all screen sizes

---

## Validation

### Linting
```bash
npm run lint
```
**Result**: ✅ Checked 90 files in 140ms. No fixes applied.

### Manual Testing
1. **Toast Test**: Spoke continuously past stop time → Single toast appeared
2. **Button Width Test**: Inspected buttons → Both 180px wide
3. **Toggle Test**: Paused and resumed → Buttons maintained equal width
4. **Last Question Test**: Reached final question → "Finish" button same width as "Next Question"

---

## Conclusion

Both issues have been successfully resolved:

1. **Toast Duplication**: Fixed using ref-based flag to ensure single execution
2. **Button Alignment**: Fixed using fixed width (180px) for consistent sizing

The application now provides a cleaner, more professional user experience with predictable behavior and visual consistency.
