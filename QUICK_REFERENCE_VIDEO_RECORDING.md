# Quick Reference: Video Playback & Recording State Management

## TL;DR

When a user plays a video during recording:
1. ⏸️ Recording automatically pauses
2. 📹 Video plays normally
3. 🎬 Video ends and resets to beginning
4. ▶️ Recording automatically resumes
5. 🔔 User gets toast notifications at each step

## Key Features

### 1. Video Auto-Reset
```typescript
// After video ends, it automatically resets to beginning
// WITHOUT locking controls (ready for immediate replay)
videoRef.current.pause();
videoRef.current.currentTime = 0;
// Note: We do NOT use load() to avoid control lock
```

### 2. Recording Pause on Video Play
```typescript
// When video plays during recording
if (isRecording && !isPaused) {
  setWasRecordingBeforePlayback(true);  // Remember state
  onPauseRecording();                    // Pause recording
  toast({ title: "Recording Paused" }); // Notify user
}
```

### 3. Recording Resume on Video End
```typescript
// When video ends
if (wasRecordingBeforePlayback) {
  setWasRecordingBeforePlayback(false); // Clear flag
  onResumeRecording();                   // Resume recording
  toast({ title: "Recording Resumed" }); // Notify user
}
```

## Component Props

```typescript
<QuestionDisplay 
  question={currentQuestion}
  onAudioEnded={handleAudioEnded}
  isRecording={isRecording}        // Pass recording state
  isPaused={isPaused}              // Pass pause state
  onPauseRecording={pauseRecording}   // Pass pause callback
  onResumeRecording={resumeRecording} // Pass resume callback
/>
```

## State Variables

| Variable | Type | Purpose |
|----------|------|---------|
| `isPlayingAudio` | boolean | Tracks if video is currently playing |
| `wasRecordingBeforePlayback` | boolean | Remembers if recording was active before video played |
| `videoRef` | RefObject | Reference to HTML5 video element |

## User Feedback

### Toast Notifications
- **Recording Paused**: Shown when video starts playing during recording
- **Recording Resumed**: Shown when video ends and recording resumes

### Visual Indicator
Orange banner shown during video playback if recording was paused:
```tsx
{wasRecordingBeforePlayback && isPlayingAudio && (
  <div>Recording paused during video playback</div>
)}
```

## Testing Checklist

- [ ] Start recording → Play video → Recording pauses
- [ ] Video ends → Recording resumes automatically
- [ ] Video resets to beginning after playback
- [ ] Toast notifications appear correctly
- [ ] Visual indicator shows during paused recording
- [ ] Multiple play/pause cycles work correctly
- [ ] Works with both HTML5 video and YouTube videos

## Common Issues

### Issue: Video controls locked after playback
**Solution:** Fixed by using `pause()` + `currentTime = 0` instead of `load()`

### Issue: Recording doesn't resume after video
**Solution:** Check that `onResumeRecording` prop is passed correctly

### Issue: Video doesn't reset to beginning
**Solution:** Verify `videoRef.current` is not null

### Issue: Multiple pause notifications
**Solution:** Check that state conditions prevent duplicate calls

## Code Locations

- **Component**: `src/components/practice/question-display.tsx`
- **Parent**: `src/pages/PracticePage.tsx`
- **Documentation**: `VIDEO_RECORDING_STATE_MANAGEMENT.md`

## Quick Debug

Enable console logs to see state transitions:
```
🔍 [QuestionDisplay] Checking media
✅ [QuestionDisplay] Video file detected
▶️ [QuestionDisplay] Video playing
⏸️ [QuestionDisplay] Auto-pausing recording
🎬 [QuestionDisplay] Video ended
🔄 [QuestionDisplay] Video reset to beginning
▶️ [QuestionDisplay] Auto-resuming recording
```
