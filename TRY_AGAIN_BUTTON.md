# Try Again Button Implementation

## Overview

Updated the Start Recording button to display as "Try Again" after feedback has been given, allowing users to re-record their answer for the same question.

## Changes Implemented

### Button State Logic

The recording button now has **three states** instead of two:

**1. Start Recording (Initial State)**
- Displayed when: No recording has been made yet
- Icon: Microphone (Mic)
- Text: "Start Recording"
- Action: Starts recording

**2. Stop Recording (Recording State)**
- Displayed when: Currently recording
- Icon: Square
- Text: "Stop Recording"
- Variant: Destructive (red)
- Action: Stops recording and checks answer

**3. Try Again (Post-Feedback State)** ✨ NEW
- Displayed when: Recording stopped and feedback given
- Icon: RotateCcw (circular arrow)
- Text: "Try Again"
- Action: Resets feedback and starts new recording

### Visual Flow

```
┌─────────────────┐
│ Start Recording │ ← Initial state
└────────┬────────┘
         │ Click
         ▼
┌─────────────────┐
│ Stop Recording  │ ← Recording in progress
└────────┬────────┘
         │ Click
         ▼
┌─────────────────┐
│   Try Again     │ ← Feedback shown
└────────┬────────┘
         │ Click
         ▼
┌─────────────────┐
│ Stop Recording  │ ← New recording started
└─────────────────┘
```

### Button Rendering Logic

```tsx
{isRecording ? (
  // State 2: Currently recording
  <>
    <Square className="w-5 h-5" />
    Stop Recording
  </>
) : hasCheckedAnswer ? (
  // State 3: Feedback given, allow retry
  <>
    <RotateCcw className="w-5 h-5" />
    Try Again
  </>
) : (
  // State 1: Initial state
  <>
    <Mic className="w-5 h-5" />
    Start Recording
  </>
)}
```

### Reset Logic on Try Again

When "Try Again" is clicked, the following are reset:

1. **hasCheckedAnswer**: Set to `false`
   - Removes feedback display from transcript
   - Disables Next Question button
   - Changes button back to recording state

2. **feedbackData**: Set to `null`
   - Clears quality rating
   - Clears matched/missed keywords
   - Removes feedback section from transcript

3. **transcript**: Cleared via `resetTranscript()`
   - Removes previous speech text
   - Clears interim transcript
   - Resets transcript display

4. **Recording**: Starts fresh
   - New audio recording begins
   - New transcript capture starts
   - Timer resets to 0:00

### Implementation Code

```typescript
const handleStartStopRecording = async () => {
  if (!isRecording) {
    // If feedback has been given, reset it for a new attempt
    if (hasCheckedAnswer) {
      console.log('🔄 [PracticePage] Try Again - Resetting feedback and transcript');
      setHasCheckedAnswer(false);
      setFeedbackData(null);
      resetTranscript();
    }
    // Start recording
    await handleStartRecording();
  } else {
    // Stop recording and check answer
    await handleCheckAnswer();
  }
};
```

## User Experience Flow

### Scenario 1: First Attempt

1. User sees question
2. Clicks "Start Recording" (Mic icon)
3. Speaks their answer
4. Clicks "Stop Recording" (Square icon)
5. Feedback appears in transcript section
6. Button changes to "Try Again" (RotateCcw icon)
7. "Next Question" button becomes enabled

### Scenario 2: Retry Same Question

1. User reviews feedback (sees missed keywords)
2. Clicks "Try Again" (RotateCcw icon)
3. Feedback disappears from transcript
4. Transcript clears
5. Recording starts immediately
6. Button changes to "Stop Recording"
7. User speaks improved answer
8. Clicks "Stop Recording"
9. New feedback appears
10. Button changes back to "Try Again"

### Scenario 3: Multiple Retries

1. User can click "Try Again" unlimited times
2. Each attempt:
   - Clears previous feedback
   - Clears previous transcript
   - Starts fresh recording
   - Generates new feedback
3. User can move to next question whenever satisfied

## Benefits

### 1. **Immediate Retry Capability**
- No need to navigate away and back
- Stay on same question for multiple attempts
- Practice until satisfied with answer

### 2. **Clear Visual Feedback**
- RotateCcw icon universally understood as "retry"
- Button text explicitly states "Try Again"
- Smooth transition between states

### 3. **Learning Opportunity**
- See what keywords were missed
- Try again with improved answer
- Immediate feedback loop for learning

### 4. **Flexible Practice**
- Users control when to move on
- Can retry as many times as needed
- No penalty for multiple attempts

### 5. **Clean State Management**
- All previous data properly cleared
- No confusion between attempts
- Fresh start for each recording

## Technical Details

### State Dependencies

The button display depends on two states:
- `isRecording`: Boolean indicating if currently recording
- `hasCheckedAnswer`: Boolean indicating if feedback has been given

**Truth Table**:
```
isRecording | hasCheckedAnswer | Button Display
------------|------------------|----------------
false       | false            | Start Recording
true        | false            | Stop Recording
false       | true             | Try Again
true        | true             | Stop Recording (during retry)
```

### Accessibility

**ARIA Labels**:
- Start Recording: "Start recording"
- Stop Recording: "Stop recording and check answer"
- Try Again: "Try again with a new recording"

**Keyboard Navigation**:
- Button is fully keyboard accessible
- Tab to focus, Enter/Space to activate
- Clear focus indicators

**Screen Reader Support**:
- Button text changes announced
- Icon changes have aria-hidden="true"
- State changes clearly communicated

### Icon Usage

**Mic Icon** (Start Recording):
- Represents audio input
- Universal symbol for recording
- Indicates ready to capture speech

**Square Icon** (Stop Recording):
- Standard stop symbol
- Clear action to end recording
- Red color (destructive variant) adds urgency

**RotateCcw Icon** (Try Again):
- Circular arrow indicates retry/redo
- Counterclockwise suggests going back
- Common pattern in UI design

## Edge Cases Handled

### 1. **Clicking Try Again During Recording**
- Not possible - button shows "Stop Recording" when recording
- User must stop current recording first

### 2. **Multiple Rapid Clicks**
- Button state updates immediately
- Async operations handled properly
- No race conditions

### 3. **Try Again Then Next Question**
- If user clicks Try Again but changes mind
- Can still click Next Question (if enabled)
- Next Question takes precedence

### 4. **Transcript Persistence**
- Previous transcript fully cleared on Try Again
- No mixing of old and new transcripts
- Clean slate for each attempt

### 5. **Feedback Persistence**
- Previous feedback fully cleared on Try Again
- No visual artifacts from previous attempt
- Fresh feedback display after new recording

## Comparison: Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| **Button States** | 2 (Start/Stop) | 3 (Start/Stop/Try Again) |
| **Retry Method** | Navigate away and back | Click Try Again button |
| **Feedback Clearing** | Manual (next question) | Automatic (try again) |
| **User Control** | Limited | Full control over retries |
| **Learning Loop** | One attempt per question | Unlimited attempts |
| **Visual Clarity** | Generic button | Context-specific text |

## Files Modified

1. **src/pages/PracticePage.tsx**:
   - Updated button rendering logic with three states
   - Added Try Again state with RotateCcw icon
   - Updated aria-label for accessibility
   - Modified handleStartStopRecording to reset feedback on retry
   - Added console logging for Try Again action

## Testing Checklist

- [x] Button shows "Start Recording" initially
- [x] Button shows "Stop Recording" when recording
- [x] Button shows "Try Again" after feedback given
- [x] RotateCcw icon displays for Try Again state
- [x] Clicking Try Again clears feedback
- [x] Clicking Try Again clears transcript
- [x] Clicking Try Again starts new recording
- [x] Multiple retries work correctly
- [x] Next Question button still works
- [x] Feedback appears correctly after retry
- [x] ARIA labels update correctly
- [x] Lint passes

## User Feedback Scenarios

### Scenario A: Missed Keywords
```
User: "I like computers."
Feedback: Missing keywords: "use", "often"
Action: Click "Try Again"
User: "I use computers often for work."
Feedback: All keywords matched! ✅
```

### Scenario B: Incomplete Answer
```
User: "I work."
Feedback: Missing keywords: "student", "study"
Action: Click "Try Again"
User: "I work full-time, but I also study part-time."
Feedback: All keywords matched! ✅
```

### Scenario C: Practice Until Perfect
```
Attempt 1: Missing 3 keywords
Action: Try Again
Attempt 2: Missing 1 keyword
Action: Try Again
Attempt 3: All keywords matched! ✅
Action: Next Question
```

## Future Enhancements

### Potential Additions:
1. **Attempt Counter**: Show "Attempt 2 of ∞"
2. **Best Score**: Track best attempt for each question
3. **Attempt History**: Show all previous attempts
4. **Comparison View**: Compare current vs previous attempt
5. **Hint System**: Show hints after failed attempts
6. **Progress Indicator**: Visual feedback on improvement

## Conclusion

The "Try Again" button provides:
- **Clear Intent**: Users know they can retry
- **Immediate Action**: One click to start over
- **Clean Reset**: All previous data cleared
- **Learning Support**: Practice until satisfied
- **Better UX**: No navigation required

This enhancement significantly improves the learning experience by allowing users to practice and improve their answers without leaving the current question.
