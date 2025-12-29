# Timer Implementation - Three-State System

## Overview
This document describes the implementation of the three-state timer system for the IELTS Speaking Practice App, which provides visual feedback and automatic transitions based on speaking duration.

---

## Timer Configuration

### Parameters
- **TargetTime**: Defined in question schema (`speakingDuration` field)
  - Part 1: 20 seconds
  - Part 2: 120 seconds (2 minutes)
  - Part 3: 60 seconds (1 minute)
- **StopTime**: `TargetTime + 5 seconds` (grace period)

### Example
For a question with `speakingDuration = 15` seconds:
- **TargetTime**: 15 seconds
- **StopTime**: 20 seconds (15 + 5)

---

## Three Visual States

### State 1: Normal (0 to TargetTime)
**Condition**: `totalSpeechTime <= speakingDuration`

**Visual Appearance**:
- Timer displays in default foreground color (black/white depending on theme)
- No warning indicators
- Counts up from 0:00

**User Experience**:
- User is within the target time
- Recording continues normally
- No visual alerts

**Implementation**:
```tsx
<p className={cn(
  "text-2xl font-bold tabular-nums transition-colors duration-300",
  totalSpeechTime > currentQuestion.speakingDuration 
    ? "text-destructive" 
    : "text-foreground" // Normal state
)}>
```

---

### State 2: Warning (TargetTime to StopTime)
**Condition**: `speakingDuration < totalSpeechTime <= speakingDuration + 5`

**Visual Appearance**:
- Timer turns **red** (`text-destructive` class)
- Smooth color transition (300ms duration)
- Continues counting up

**User Experience**:
- Visual warning that target time has been exceeded
- User can still continue speaking
- 5-second grace period before automatic stop
- Recording is still active and accepting input

**Example Timeline** (for 15-second target):
- At 15.1 seconds: Timer turns red
- At 16 seconds: Still recording, timer red
- At 19 seconds: Still recording, timer red
- At 20 seconds: Triggers stop sequence

**Implementation**:
```tsx
totalSpeechTime > currentQuestion.speakingDuration 
  ? "text-destructive" // Warning state: red
  : "text-foreground"
```

---

### State 3: Stop (at StopTime)
**Condition**: `totalSpeechTime >= speakingDuration + 5`

**Behavior**:
1. **Toast Notification**: Display appropriate message based on question type
2. **2-Second Delay**: Allow user to read the prompt
3. **Auto-Advance**: Automatically move to next question or stop recording

**Toast Messages by Question Type**:
- **Part 1**: "Let me stop you there"
- **Part 2**: "That's two minutes, great job!"
- **Part 3**: "Nice response! Let me ask you something else…"

**Implementation**:
```tsx
const stopTime = speakingDuration + 5; // Add 5 seconds grace period

if (totalSpeechTime >= stopTime) {
  if (type === QuestionType.Part1) {
    toast({
      title: 'Let me stop you there',
      duration: 2000,
    });
    // Add 2-second delay before moving to next question
    setTimeout(() => {
      handleNextQuestion();
    }, 2000);
  }
  // ... similar for Part 2 and Part 3
}
```

---

## Implementation Logic Summary

### Pseudo-code
```
IF currentTime <= TargetTime:
  - Display timer in normal state (default color)
  - Continue recording
  
ELSE IF TargetTime < currentTime <= StopTime:
  - Display timer in warning state (red color)
  - Continue recording
  - User input still accepted
  
ELSE IF currentTime > StopTime:
  - Show toast notification
  - Wait 2 seconds
  - Trigger auto-advance to next question
```

### State Transition Diagram
```
┌─────────────────────────────────────────────────────────┐
│                    Timer States                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  0s ──────────────► TargetTime ──────────► StopTime    │
│       Normal State      │        Warning      │         │
│       (Black/White)     │        (Red)        │ Stop    │
│                         │                     │         │
│  ◄─── Recording ───────►│◄─── Recording ─────►│         │
│                         │                     │         │
│                         │                     ▼         │
│                         │              Toast Message    │
│                         │                     │         │
│                         │                     ▼         │
│                         │              2s Delay         │
│                         │                     │         │
│                         │                     ▼         │
│                         │              Next Question    │
└─────────────────────────────────────────────────────────┘
```

---

## Example Timeline (15-second target)

| Time | State | Visual | Action |
|------|-------|--------|--------|
| 0:00 | Normal | Black timer | Recording starts |
| 0:05 | Normal | Black timer | User speaking |
| 0:10 | Normal | Black timer | User speaking |
| 0:15 | Normal | Black timer | Target time reached |
| 0:16 | **Warning** | **Red timer** | Grace period begins |
| 0:17 | **Warning** | **Red timer** | Still recording |
| 0:18 | **Warning** | **Red timer** | Still recording |
| 0:19 | **Warning** | **Red timer** | Still recording |
| 0:20 | **Stop** | **Red timer** | Toast: "Let me stop you there" |
| 0:22 | - | - | Auto-advance to next question |

---

## Technical Implementation Details

### Files Modified
- `src/pages/PracticePage.tsx`

### Key Changes

#### 1. Auto-Transition Logic (Lines 248-289)
**Before**:
```tsx
if (totalSpeechTime >= speakingDuration) {
  // Immediate transition
  handleNextQuestion();
}
```

**After**:
```tsx
const stopTime = speakingDuration + 5; // Add 5 seconds grace period

if (totalSpeechTime >= stopTime) {
  toast({
    title: 'Let me stop you there',
    duration: 2000,
  });
  // Add 2-second delay before moving to next question
  setTimeout(() => {
    handleNextQuestion();
  }, 2000);
}
```

#### 2. Timer Visual State (Lines 716-732)
**Before**:
```tsx
<p className="text-2xl font-bold text-foreground tabular-nums">
```

**After**:
```tsx
<p className={cn(
  "text-2xl font-bold tabular-nums transition-colors duration-300",
  totalSpeechTime > currentQuestion.speakingDuration 
    ? "text-destructive" // Warning state: red when exceeded target
    : "text-foreground" // Normal state: default color
)}>
```

---

## User Benefits

### Clear Visual Feedback
✅ **Normal State**: User knows they're within target time
✅ **Warning State**: Immediate visual alert when target exceeded
✅ **Smooth Transition**: 300ms color fade prevents jarring changes

### Grace Period
✅ **5-Second Buffer**: Allows users to complete their thought
✅ **No Abrupt Cutoff**: Prevents mid-sentence interruptions
✅ **Fair Assessment**: Mimics real IELTS examiner behavior

### Automatic Progression
✅ **No Manual Action**: System handles transitions automatically
✅ **Consistent Timing**: Ensures fair practice conditions
✅ **Clear Notifications**: Toast messages explain what's happening

### Accessibility
✅ **Color + Text**: Red color plus toast message for multiple feedback channels
✅ **Smooth Animations**: Gradual transitions prevent disorientation
✅ **Readable Delays**: 2-second pause allows users to read notifications

---

## Testing Scenarios

### Scenario 1: User Finishes Within Target Time
1. User speaks for 12 seconds (target: 15s)
2. User stops speaking
3. Timer remains black throughout
4. No automatic transition (user controls next step)

### Scenario 2: User Exceeds Target but Stops Before StopTime
1. User speaks for 17 seconds (target: 15s, stop: 20s)
2. Timer turns red at 15 seconds
3. User stops speaking at 17 seconds
4. No automatic transition yet
5. User can manually proceed or continue speaking

### Scenario 3: User Reaches StopTime
1. User speaks continuously
2. Timer turns red at 15 seconds
3. User continues speaking
4. At 20 seconds: Toast appears "Let me stop you there"
5. After 2 seconds: Automatically moves to next question

### Scenario 4: Part 2 Long Answer
1. User speaks for 2 minutes (target: 120s)
2. Timer turns red at 2:00
3. User continues speaking
4. At 2:05: Toast appears "That's two minutes, great job!"
5. After 2 seconds: Recording stops, review screen appears

---

## Configuration Reference

### Question Schema
```typescript
interface Question {
  id: string;
  type: QuestionType;
  text: string;
  speakingDuration: number; // TargetTime in seconds
  prepTime: number;
  media?: string;
}
```

### Calculated Values
```typescript
const targetTime = currentQuestion.speakingDuration;
const stopTime = targetTime + 5; // Grace period

// Visual state
const isWarning = totalSpeechTime > targetTime;
const shouldStop = totalSpeechTime >= stopTime;
```

---

## Color Reference

### Design System Colors
- **Normal State**: `text-foreground`
  - Light mode: Black (#000000 or similar)
  - Dark mode: White (#FFFFFF or similar)
  
- **Warning State**: `text-destructive`
  - Light mode: Red (#DC2626 or similar)
  - Dark mode: Red (#EF4444 or similar)

### Transition
- **Duration**: 300ms
- **Easing**: Default (ease)
- **Property**: `color` only

---

## Conclusion

The three-state timer system provides:

1. **Clear Visual Hierarchy**: Normal → Warning → Stop
2. **Fair Grace Period**: 5 seconds to complete thoughts
3. **Smooth User Experience**: Gradual transitions and clear notifications
4. **Automatic Management**: No manual intervention required
5. **Consistent Behavior**: Same logic across all question types

This implementation ensures users have a clear understanding of their time usage while maintaining a smooth, professional practice experience that mirrors real IELTS Speaking test conditions.
