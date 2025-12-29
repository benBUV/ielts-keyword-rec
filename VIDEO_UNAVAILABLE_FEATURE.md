# Video Unavailable Auto-Start Feature

## Date: 2025-11-18

## Overview
This feature implements automatic recording start and visual indicators when video content is unavailable, ensuring users can continue practicing even when media fails to load.

---

## Features Implemented

### 1. ✅ Visual Indicator for Unavailable Video

**Primary Alert Message:**
```
⚠️ Video unavailable - you may begin speaking
[Error details displayed below]
```

**Design:**
- **Color**: Orange background with orange border (warning color)
- **Icon**: ⚠️ Warning emoji for immediate visual recognition
- **Layout**: Centered, prominent display
- **Accessibility**: `role="alert"` and `aria-live="assertive"` for screen readers

**When it appears:**
- Video fails to load (404, network error, etc.)
- Invalid video URL
- Unsupported video format
- CORS or permission errors

---

### 2. ✅ Auto-Start Recording Countdown

**Countdown Timer Display:**
```
[Spinning Circle with Number]
Recording will start automatically
Get ready to speak...
```

**Timing:**
- **Countdown Duration**: 5 seconds
- **Update Frequency**: Every 1 second
- **Visual Feedback**: Animated spinning circle with countdown number

**Design Features:**
- **Animation**: Pulsing background + spinning border
- **Color**: Primary theme color
- **Countdown Display**: Large, bold number in center
- **Status Text**: Clear instructions for user
- **Accessibility**: `role="status"` and `aria-live="polite"` for screen readers

**Behavior:**
1. Media error detected
2. Visual indicator appears immediately
3. Countdown starts at 5 seconds
4. Number decreases every second
5. At 0, recording starts automatically
6. Toast notification confirms recording started

---

## User Experience Flow

### Scenario 1: Video Fails to Load

```
1. User clicks "Start Practice"
   └─> Question loads with video URL

2. Video fails to load (network error, 404, etc.)
   └─> mediaError state is set
   └─> Visual indicator appears:
       ┌─────────────────────────────────────────┐
       │ ⚠️ Video unavailable - you may begin    │
       │    speaking                             │
       │    Video error: Failed to load video    │
       └─────────────────────────────────────────┘

3. Countdown timer appears immediately:
   ┌─────────────────────────────────────────┐
   │  [5] Recording will start automatically │
   │      Get ready to speak...              │
   └─────────────────────────────────────────┘

4. Countdown updates every second:
   5 → 4 → 3 → 2 → 1 → 0

5. At 0, recording starts automatically
   └─> Toast notification: "Recording Started"
   └─> Description: "Video unavailable - recording started automatically"

6. User can now speak and record their response
```

---

### Scenario 2: User Already Recording When Error Occurs

```
1. User is already recording
2. Video error occurs (e.g., playback failure)
3. Visual indicator appears
4. Auto-start countdown does NOT trigger
   └─> Reason: User is already recording
5. User continues recording without interruption
```

---

## Technical Implementation

### State Management

```tsx
// New state variables
const [mediaError, setMediaError] = useState<string | null>(null);
const [autoStartCountdown, setAutoStartCountdown] = useState<number | null>(null);

// New refs
const autoStartTimerRef = useRef<NodeJS.Timeout | null>(null);
```

### Auto-Start Logic

```tsx
useEffect(() => {
  // Clear any existing timer
  if (autoStartTimerRef.current) {
    clearInterval(autoStartTimerRef.current);
    autoStartTimerRef.current = null;
  }

  // Only auto-start if there's a media error and we're not already recording
  if (mediaError && !isRecording && onAudioEnded) {
    console.log('⚠️ [QuestionDisplay] Media unavailable - starting auto-start countdown');
    
    // Start countdown from 5 seconds
    let countdown = 5;
    setAutoStartCountdown(countdown);

    // Update countdown every second
    const intervalId = setInterval(() => {
      countdown -= 1;
      setAutoStartCountdown(countdown);

      if (countdown <= 0) {
        clearInterval(intervalId);
        setAutoStartCountdown(null);
        console.log('🎙️ [QuestionDisplay] Auto-starting recording after media failure');
        
        // Trigger recording start by calling onAudioEnded
        onAudioEnded();
        
        toast({
          title: "Recording Started",
          description: "Video unavailable - recording started automatically",
        });
      }
    }, 1000);

    autoStartTimerRef.current = intervalId;
  }

  // Cleanup on unmount or when dependencies change
  return () => {
    if (autoStartTimerRef.current) {
      clearInterval(autoStartTimerRef.current);
      autoStartTimerRef.current = null;
    }
  };
}, [mediaError, isRecording, onAudioEnded, toast]);
```

### Visual Indicator Component

```tsx
{/* Visual indicator when video is unavailable */}
{mediaError && (
  <div className="space-y-3">
    {/* Error message */}
    <div 
      className="flex items-center justify-center gap-3 px-6 py-4 bg-orange-50 dark:bg-orange-950 border-2 border-orange-300 dark:border-orange-700 rounded-lg"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
        <span className="text-2xl">⚠️</span>
        <div className="flex flex-col">
          <span className="font-semibold text-base">Video unavailable - you may begin speaking</span>
          <span className="text-sm opacity-90">{mediaError}</span>
        </div>
      </div>
    </div>

    {/* Auto-start countdown indicator */}
    {autoStartCountdown !== null && autoStartCountdown > 0 && (
      <div 
        className="flex items-center justify-center gap-3 px-6 py-4 bg-primary/10 border-2 border-primary/30 rounded-lg animate-pulse"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3 text-primary">
          <div className="relative flex items-center justify-center w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <span className="text-xl font-bold z-10">{autoStartCountdown}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base">Recording will start automatically</span>
            <span className="text-sm opacity-90">Get ready to speak...</span>
          </div>
        </div>
      </div>
    )}
  </div>
)}
```

---

## Error Detection

### Video Error Handling

```tsx
<video
  onError={(e) => {
    const video = e.currentTarget;
    const error = video.error;
    console.error('❌ [QuestionDisplay] Video error:', {
      code: error?.code,
      message: error?.message,
      src: question.media,
    });
    setMediaError(`Video error: ${error?.message || 'Failed to load video'}`);
  }}
>
  <source src={question.media} type={getMediaMimeType(question.media)} />
  <p className="text-white p-4">
    Your browser does not support the video element. Please refer to the question text above.
  </p>
</video>
```

### Common Error Types

| Error Code | Description | User Message |
|------------|-------------|--------------|
| 1 | MEDIA_ERR_ABORTED | Video loading was aborted |
| 2 | MEDIA_ERR_NETWORK | Network error while loading video |
| 3 | MEDIA_ERR_DECODE | Video decoding failed |
| 4 | MEDIA_ERR_SRC_NOT_SUPPORTED | Video format not supported |

---

## Accessibility Features

### Screen Reader Support

**Alert Announcement:**
```
"Alert: Video unavailable - you may begin speaking"
"Video error: Failed to load video"
```

**Countdown Announcement:**
```
"Status: Recording will start automatically"
"5"
"4"
"3"
"2"
"1"
"Recording Started"
```

### ARIA Attributes

**Error Message:**
- `role="alert"` - Announces immediately to screen readers
- `aria-live="assertive"` - Interrupts current reading to announce error

**Countdown Timer:**
- `role="status"` - Announces status updates
- `aria-live="polite"` - Announces after current reading completes

---

## Visual Design

### Color Scheme

**Error Indicator:**
- Light mode: Orange background (#FFF7ED), orange border (#FED7AA)
- Dark mode: Dark orange background (#7C2D12), orange border (#C2410C)
- Text: Orange-700 (light) / Orange-300 (dark)

**Countdown Timer:**
- Background: Primary color with 10% opacity
- Border: Primary color with 30% opacity
- Text: Primary color (full opacity)
- Animation: Pulse effect on container, spin effect on border

### Animations

**Countdown Container:**
```css
animate-pulse /* Pulsing background */
```

**Countdown Circle:**
```css
animate-spin /* Rotating border */
border-t-transparent /* Creates spinning effect */
```

---

## Testing Scenarios

### Test 1: Invalid Video URL
**Steps:**
1. Create question with invalid video URL
2. Load question
3. Observe error handling

**Expected Result:** ✅
- Error indicator appears immediately
- Countdown starts at 5 seconds
- Recording starts automatically at 0
- Toast notification confirms start

---

### Test 2: Network Failure
**Steps:**
1. Disconnect network
2. Load question with video
3. Observe error handling

**Expected Result:** ✅
- Network error detected
- Visual indicator shows error
- Auto-start countdown begins
- Recording starts after 5 seconds

---

### Test 3: Already Recording
**Steps:**
1. Start recording manually
2. Trigger video error
3. Observe behavior

**Expected Result:** ✅
- Error indicator appears
- Countdown does NOT start
- Recording continues uninterrupted
- User can continue speaking

---

### Test 4: Screen Reader
**Steps:**
1. Enable screen reader
2. Trigger video error
3. Listen to announcements

**Expected Result:** ✅
- Error announced immediately
- Countdown numbers announced
- Recording start confirmed
- All information accessible

---

## User Benefits

### For All Users
- ✅ No interruption to practice session
- ✅ Clear visual feedback about what's happening
- ✅ Automatic recovery from media failures
- ✅ No manual intervention required

### For Users with Slow Connections
- ✅ Can continue practicing even if video doesn't load
- ✅ 5-second buffer allows time to prepare
- ✅ Text content always available as fallback

### For Screen Reader Users
- ✅ Clear announcements of error state
- ✅ Countdown progress announced
- ✅ Recording start confirmed audibly
- ✅ Full context provided through ARIA

### For Mobile Users
- ✅ Responsive design works on small screens
- ✅ Touch-friendly interface
- ✅ Works with limited bandwidth
- ✅ Battery-efficient (no video playback)

---

## Configuration

### Adjustable Parameters

**Countdown Duration:**
```tsx
// Current: 5 seconds
let countdown = 5;

// To change to 3 seconds:
let countdown = 3;
```

**Update Interval:**
```tsx
// Current: 1 second
setInterval(() => { ... }, 1000);

// To change to 500ms:
setInterval(() => { ... }, 500);
```

---

## Edge Cases Handled

### 1. Multiple Errors
**Scenario:** Video fails, then fails again
**Handling:** Timer resets, countdown restarts from 5

### 2. User Starts Recording Manually
**Scenario:** User clicks record before countdown ends
**Handling:** Countdown stops, manual recording takes precedence

### 3. Question Changes During Countdown
**Scenario:** User navigates to next question
**Handling:** Timer cleared, no auto-start on new question

### 4. Component Unmounts
**Scenario:** User leaves practice session
**Handling:** Timer cleared in cleanup function

---

## Performance Considerations

### Memory Management
- Timer cleared on unmount
- Interval cleared when countdown completes
- No memory leaks

### CPU Usage
- Minimal: 1 update per second
- No heavy computations
- Efficient state updates

### Network Impact
- No additional network requests
- Works offline after initial load
- No polling or retries

---

## Future Enhancements

### Potential Improvements
- [ ] Allow user to cancel auto-start countdown
- [ ] Configurable countdown duration in settings
- [ ] Option to disable auto-start feature
- [ ] Retry video loading before auto-start
- [ ] Show video thumbnail as fallback

---

## Files Modified

### Primary Changes
- `src/components/practice/question-display.tsx`
  - Added `autoStartCountdown` state
  - Added `autoStartTimerRef` ref
  - Implemented auto-start useEffect
  - Added visual indicator components
  - Removed duplicate error message

---

## Conclusion

This feature significantly improves the user experience by:

1. **Providing clear visual feedback** when video is unavailable
2. **Automatically recovering** from media failures
3. **Maintaining practice flow** without manual intervention
4. **Supporting accessibility** with proper ARIA attributes
5. **Handling edge cases** gracefully

Users can now continue their IELTS speaking practice seamlessly, even when video content fails to load, ensuring an uninterrupted learning experience.
