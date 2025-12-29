# Video Playback and Recording State Management

## Overview
This document describes the intelligent state management system that coordinates video playback and audio recording, ensuring mutually exclusive states and automatic transitions.

## System Architecture

### State Definitions

The system operates with two primary, mutually exclusive states:

1. **Recording State**: User's voice is being captured
   - `isRecording = true`
   - `isPaused = false`
   - Video playback is NOT active

2. **Playback State**: Video is playing
   - `isPlayingAudio = true`
   - Recording is paused (if it was active)
   - User can review video content

### State Transition Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Initial State                             │
│              (No Recording, No Playback)                     │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐         ┌──────────────┐
│   Recording   │         │   Playback   │
│    Active     │         │    Active    │
└───────┬───────┘         └──────┬───────┘
        │                        │
        │  User plays video      │
        │  ─────────────────────>│
        │                        │
        │  Video ends/stops      │
        │  <─────────────────────│
        │  (Auto-resume)         │
        │                        │
        ▼                        ▼
┌───────────────┐         ┌──────────────┐
│   Recording   │         │   Playback   │
│   Resumed     │         │    Ended     │
└───────────────┘         └──────────────┘
```

## Implementation Details

### 1. Component Props Interface

```typescript
interface QuestionDisplayProps {
  question: Question;
  onAudioEnded?: () => void;
  isRecording?: boolean;           // Current recording state
  isPaused?: boolean;              // Current pause state
  onPauseRecording?: () => void;   // Callback to pause recording
  onResumeRecording?: () => void;  // Callback to resume recording
}
```

### 2. State Management Variables

```typescript
// Playback state
const [isPlayingAudio, setIsPlayingAudio] = useState(false);

// Recording state memory
const [wasRecordingBeforePlayback, setWasRecordingBeforePlayback] = useState(false);

// Video element reference
const videoRef = useRef<HTMLVideoElement | null>(null);
```

### 3. Automatic Interception Logic

#### When Video Starts Playing During Recording

```typescript
// Triggered on video play event
onPlay={() => {
  console.log('▶️ [QuestionDisplay] Video playing');
  setIsPlayingAudio(true);
  
  // Auto-pause recording if playing during recording
  if (isRecording && !isPaused) {
    console.log('⏸️ [QuestionDisplay] Auto-pausing recording for video playback');
    setWasRecordingBeforePlayback(true);  // Remember recording was active
    onPauseRecording?.();                  // Pause the recording
    toast({
      title: "Recording Paused",
      description: "Recording paused while video is playing",
    });
  }
}}
```

**Logic Flow:**
1. Detect video play event
2. Check if recording is active (`isRecording && !isPaused`)
3. If yes:
   - Set `wasRecordingBeforePlayback = true` (memory flag)
   - Call `onPauseRecording()` to pause recording
   - Show toast notification to user
4. Set `isPlayingAudio = true`

#### Alternative Detection via useEffect

```typescript
// Intelligent state management: Pause recording when video starts playing
useEffect(() => {
  if (isPlayingAudio && isRecording && !isPaused) {
    console.log('⏸️ [QuestionDisplay] Video playback started during recording - auto-pausing recording');
    setWasRecordingBeforePlayback(true);
    onPauseRecording?.();
    toast({
      title: "Recording Paused",
      description: "Recording paused while video is playing",
    });
  }
}, [isPlayingAudio, isRecording, isPaused, onPauseRecording, toast]);
```

**Why Two Detection Methods?**
- `onPlay` event: Immediate detection when user clicks play
- `useEffect`: Catches edge cases and state changes from external sources
- Redundancy ensures robust state management

### 4. Automatic Resumption Logic

#### When Video Ends

```typescript
const handleVideoEnd = () => {
  console.log('🎬 [QuestionDisplay] Video ended');
  setIsPlayingAudio(false);
  
  // Reset video to beginning for replay
  if (videoRef.current) {
    videoRef.current.currentTime = 0;
    videoRef.current.load(); // Reset to initial state
    console.log('🔄 [QuestionDisplay] Video reset to beginning');
  }
  
  // Resume recording if it was paused for playback
  if (wasRecordingBeforePlayback && onResumeRecording) {
    console.log('▶️ [QuestionDisplay] Auto-resuming recording after video end');
    setWasRecordingBeforePlayback(false);  // Clear memory flag
    onResumeRecording();                    // Resume recording
    toast({
      title: "Recording Resumed",
      description: "Continue speaking - your response is being recorded",
    });
  }
  
  // Call the original callback if provided
  onAudioEnded?.();
};
```

**Logic Flow:**
1. Video ends (natural completion or user stops)
2. Set `isPlayingAudio = false`
3. Reset video to beginning:
   - `currentTime = 0` (rewind to start)
   - `load()` (reset player state)
4. Check if recording was paused for playback (`wasRecordingBeforePlayback`)
5. If yes:
   - Clear memory flag (`wasRecordingBeforePlayback = false`)
   - Call `onResumeRecording()` to resume recording
   - Show toast notification
6. Call original `onAudioEnded` callback if provided

### 5. Video Reset Mechanism

#### Why Reset is Important
- Allows immediate replay without manual rewinding
- Maintains consistent UX across multiple playbacks
- Ensures video is ready for next interaction
- **CRITICAL**: Keeps video controls interactive and unlocked

#### Implementation
```typescript
if (videoRef.current) {
  videoRef.current.pause();          // Ensure video is paused
  videoRef.current.currentTime = 0;  // Rewind to start
}
```

**Why NOT use `load()`:**
- `load()` resets the entire media element, causing it to enter a loading state
- This can "lock" the video controls, requiring user to manually pause recording
- Using `pause()` + `currentTime = 0` keeps video in "ready to play" state
- Video controls remain interactive immediately after reset

**What this approach does:**
- Pauses the video if it's still playing
- Rewinds to the beginning (currentTime = 0)
- Keeps the video in a ready state (no reload needed)
- Play button is immediately clickable
- No loading delay or control lock

### 6. User Interface Feedback

#### Recording Paused Indicator
```tsx
{wasRecordingBeforePlayback && isPlayingAudio && (
  <div className="text-sm text-orange-600 bg-orange-50 dark:bg-orange-950 dark:text-orange-400 px-4 py-2 rounded-md flex items-center gap-2">
    <Pause className="w-4 h-4" />
    <span>Recording paused during video playback</span>
  </div>
)}
```

**Display Conditions:**
- `wasRecordingBeforePlayback = true`: Recording was active before playback
- `isPlayingAudio = true`: Video is currently playing

**Visual Design:**
- Orange color scheme (warning/info state)
- Pause icon for visual clarity
- Clear message about state
- Dark mode support

#### Toast Notifications

**Recording Paused:**
```typescript
toast({
  title: "Recording Paused",
  description: "Recording paused while video is playing",
});
```

**Recording Resumed:**
```typescript
toast({
  title: "Recording Resumed",
  description: "Continue speaking - your response is being recorded",
});
```

## Edge Case Handling

### 1. Rapid Toggling
**Scenario:** User rapidly plays/pauses video while recording

**Solution:**
- State checks prevent duplicate pause/resume calls
- `wasRecordingBeforePlayback` flag ensures correct state memory
- Toast notifications debounced by React Toast system

### 2. Video Error During Playback
**Scenario:** Video fails to load or encounters error

**Solution:**
```typescript
onError={(e) => {
  const video = e.currentTarget;
  const error = video.error;
  console.error('❌ [QuestionDisplay] Video error:', {
    code: error?.code,
    message: error?.message,
    src: question.media,
  });
  setMediaError(`Video error: ${error?.message || 'Failed to load video'}`);
  setIsPlayingAudio(false);  // Reset playback state
}
```

- Error logged with details
- User-friendly error message displayed
- Playback state reset to prevent stuck state

### 3. Component Unmount During Playback
**Scenario:** User navigates away while video is playing

**Solution:**
- React cleanup functions handle state reset
- No memory leaks from event listeners
- Recording state managed by parent component (PracticePage)

### 4. Multiple Videos in Sequence
**Scenario:** User moves to next question while video is playing

**Solution:**
- `wasRecordingBeforePlayback` reset on component unmount
- New question gets fresh state
- Recording state preserved by parent component

## Performance Considerations

### 1. Minimal Re-renders
- State updates batched by React
- useEffect dependencies carefully managed
- Ref usage for video element (no re-render on ref change)

### 2. Event Handler Optimization
- Event handlers defined inline (React optimizes these)
- No unnecessary function recreations
- Direct state updates without intermediate calculations

### 3. Memory Management
- Video element properly cleaned up on unmount
- No memory leaks from event listeners
- Blob URLs properly managed (handled by parent component)

## Testing Scenarios

### Scenario 1: Normal Flow
1. User starts recording
2. User plays video → Recording pauses (toast shown)
3. Video ends → Recording resumes (toast shown)
4. Video reset to beginning

**Expected Result:** ✅ Recording continues seamlessly

### Scenario 2: Video Replay During Recording
1. User starts recording
2. User plays video → Recording pauses
3. Video ends → Recording resumes
4. User plays video again → Recording pauses again
5. Video ends → Recording resumes again

**Expected Result:** ✅ Multiple pause/resume cycles work correctly

### Scenario 3: Manual Video Stop
1. User starts recording
2. User plays video → Recording pauses
3. User manually pauses video (before end)
4. Recording should remain paused

**Expected Result:** ✅ Recording doesn't auto-resume until video ends

### Scenario 4: No Recording Active
1. User plays video (no recording active)
2. Video plays normally
3. Video ends and resets

**Expected Result:** ✅ No recording state changes, video works normally

### Scenario 5: Video Error
1. User starts recording
2. User plays video → Recording pauses
3. Video encounters error
4. Error message displayed
5. Recording state should be recoverable

**Expected Result:** ✅ User can manually resume recording

## Integration with Parent Component

### PracticePage Props Passed to QuestionDisplay

```typescript
<QuestionDisplay 
  question={currentQuestion} 
  onAudioEnded={handleAudioEnded}
  isRecording={isRecording}
  isPaused={isPaused}
  onPauseRecording={pauseRecording}
  onResumeRecording={resumeRecording}
/>
```

### State Flow
```
PracticePage (Parent)
  ├─ isRecording (from useAudioRecorder)
  ├─ isPaused (from useAudioRecorder)
  ├─ pauseRecording() (from useAudioRecorder)
  └─ resumeRecording() (from useAudioRecorder)
       │
       ▼
QuestionDisplay (Child)
  ├─ Receives recording state as props
  ├─ Manages video playback state internally
  ├─ Calls parent callbacks to control recording
  └─ Provides UI feedback for state transitions
```

## YouTube Video Support

The same logic applies to YouTube videos through the `useYouTubePlayer` hook:

```typescript
const { playerRef, isPlayerReady, isAPIReady } = useYouTubePlayer({
  videoId: youtubeVideoId,
  onVideoEnd: handleVideoEnd,  // Same handler as HTML5 video
  onReady: () => {
    console.log('✅ [QuestionDisplay] YouTube Player ready - auto-start enabled');
  },
});
```

**Note:** YouTube Player API doesn't provide direct access to play/pause events, so the interception logic relies on the useEffect hook for YouTube videos.

## Debugging and Logging

### Console Log Format

All logs follow a consistent format for easy debugging:

```
🔍 [QuestionDisplay] Checking media: /videos/example.mp4
✅ [QuestionDisplay] Video file detected: /videos/example.mp4
📹 [QuestionDisplay] MIME type: video/mp4
▶️ [QuestionDisplay] Video playing
⏸️ [QuestionDisplay] Auto-pausing recording for video playback
🎬 [QuestionDisplay] Video ended
🔄 [QuestionDisplay] Video reset to beginning
▶️ [QuestionDisplay] Auto-resuming recording after video end
```

### Log Symbols
- 🔍 Detection/checking
- ✅ Success/confirmation
- 📹 Video-related
- ▶️ Play/resume action
- ⏸️ Pause action
- 🎬 Video end
- 🔄 Reset action
- ❌ Error

## Summary

This implementation provides:

1. ✅ **Enhanced Video Playback Cycle**
   - Automatic reset to beginning after playback
   - Video ready for immediate replay
   - Consistent UX across multiple playbacks

2. ✅ **Intelligent State Management**
   - Mutually exclusive Recording and Playback states
   - Automatic recording pause when video plays
   - Automatic recording resume when video ends

3. ✅ **Clear User Feedback**
   - Toast notifications for state transitions
   - Visual indicator during paused recording
   - Informative messages for user guidance

4. ✅ **Robust Edge Case Handling**
   - Rapid toggling protection
   - Error recovery
   - Component lifecycle management
   - Multiple video playback support

5. ✅ **Performance Optimized**
   - Minimal re-renders
   - Efficient event handling
   - Proper memory management

The system ensures a seamless user experience where video playback and recording never interfere with each other, while providing clear feedback about the current state.
