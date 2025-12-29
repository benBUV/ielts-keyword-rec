# Video Playback & Recording State Flow Diagram

## Complete State Transition Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         APPLICATION START                                │
│                    (No Recording, No Playback)                          │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ User clicks "Start Recording"
                                 ▼
                    ┌────────────────────────────┐
                    │   RECORDING ACTIVE         │
                    │   isRecording = true       │
                    │   isPaused = false         │
                    │   isPlayingAudio = false   │
                    └────────────┬───────────────┘
                                 │
                                 │ User clicks play on video
                                 │
                                 ▼
                    ┌────────────────────────────┐
                    │   AUTO-PAUSE RECORDING     │
                    │   ⏸️ pauseRecording()      │
                    │   wasRecordingBefore = true│
                    │   Toast: "Recording Paused"│
                    └────────────┬───────────────┘
                                 │
                                 ▼
                    ┌────────────────────────────┐
                    │   VIDEO PLAYBACK ACTIVE    │
                    │   isRecording = true       │
                    │   isPaused = true          │
                    │   isPlayingAudio = true    │
                    │   📹 Video playing...      │
                    └────────────┬───────────────┘
                                 │
                                 │ Video ends naturally
                                 │
                                 ▼
                    ┌────────────────────────────┐
                    │   VIDEO RESET              │
                    │   🔄 pause()               │
                    │   🔄 currentTime = 0       │
                    │   ✅ Controls unlocked     │
                    │   isPlayingAudio = false   │
                    └────────────┬───────────────┘
                                 │
                                 │ Check wasRecordingBefore
                                 │
                                 ▼
                    ┌────────────────────────────┐
                    │   AUTO-RESUME RECORDING    │
                    │   ▶️ resumeRecording()     │
                    │   wasRecordingBefore = false│
                    │   Toast: "Recording Resumed"│
                    └────────────┬───────────────┘
                                 │
                                 ▼
                    ┌────────────────────────────┐
                    │   RECORDING ACTIVE         │
                    │   isRecording = true       │
                    │   isPaused = false         │
                    │   isPlayingAudio = false   │
                    │   ✅ User can continue     │
                    └────────────────────────────┘
```

## Detailed Event Flow

### Event 1: Video Play During Recording

```
User Action: Clicks play button on video
     │
     ▼
┌─────────────────────────────────────────┐
│  Video onPlay Event Triggered           │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Check: isRecording && !isPaused?       │
└─────────────────┬───────────────────────┘
                  │
         ┌────────┴────────┐
         │ YES             │ NO
         ▼                 ▼
┌──────────────────┐  ┌──────────────────┐
│ Pause Recording  │  │ Just play video  │
│ Set memory flag  │  │ No state change  │
│ Show toast       │  └──────────────────┘
└──────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  setIsPlayingAudio(true)                 │
│  setWasRecordingBeforePlayback(true)     │
│  onPauseRecording()                      │
│  toast("Recording Paused")               │
└──────────────────────────────────────────┘
```

### Event 2: Video End

```
Video Playback Completes
     │
     ▼
┌─────────────────────────────────────────┐
│  Video onEnded Event Triggered          │
│  handleVideoEnd() called                │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  setIsPlayingAudio(false)               │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Reset Video to Beginning               │
│  videoRef.current.pause()               │
│  videoRef.current.currentTime = 0       │
│  (Controls remain unlocked & ready)     │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Check: wasRecordingBeforePlayback?     │
└─────────────────┬───────────────────────┘
                  │
         ┌────────┴────────┐
         │ YES             │ NO
         ▼                 ▼
┌──────────────────┐  ┌──────────────────┐
│ Resume Recording │  │ Do nothing       │
│ Clear flag       │  │ Video just ends  │
│ Show toast       │  └──────────────────┘
└──────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  setWasRecordingBeforePlayback(false)    │
│  onResumeRecording()                     │
│  toast("Recording Resumed")              │
└──────────────────────────────────────────┘
```

## State Variable Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                    State Variables                           │
└─────────────────────────────────────────────────────────────┘

isRecording (from parent)
    │
    ├─ true + !isPaused → Recording is actively capturing
    ├─ true + isPaused → Recording is paused (by video or user)
    └─ false → No recording session

isPaused (from parent)
    │
    ├─ true → Recording paused (can be resumed)
    └─ false → Recording active or not started

isPlayingAudio (local)
    │
    ├─ true → Video is currently playing
    └─ false → Video is stopped/paused

wasRecordingBeforePlayback (local)
    │
    ├─ true → Recording was active before video started
    │          (should resume when video ends)
    └─ false → Recording was not active
               (don't resume when video ends)
```

## Decision Tree

```
                    Video Play Button Clicked
                              │
                              ▼
                    ┌──────────────────┐
                    │ Is Recording?    │
                    └────────┬─────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                   YES               NO
                    │                 │
                    ▼                 ▼
          ┌──────────────────┐  ┌──────────────┐
          │ Is Paused?       │  │ Just play    │
          └────────┬─────────┘  │ video        │
                   │            └──────────────┘
          ┌────────┴────────┐
          │                 │
         YES               NO
          │                 │
          ▼                 ▼
    ┌──────────┐   ┌──────────────────┐
    │ Just play│   │ Pause recording  │
    │ video    │   │ Set memory flag  │
    └──────────┘   │ Show toast       │
                   └──────────────────┘
```

## Component Communication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      PracticePage                            │
│  (Parent Component - Manages Recording State)               │
│                                                              │
│  State:                                                      │
│  - isRecording                                              │
│  - isPaused                                                 │
│                                                              │
│  Functions:                                                  │
│  - pauseRecording()                                         │
│  - resumeRecording()                                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Props passed down
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   QuestionDisplay                            │
│  (Child Component - Manages Video Playback)                 │
│                                                              │
│  Props Received:                                             │
│  - isRecording                                              │
│  - isPaused                                                 │
│  - onPauseRecording                                         │
│  - onResumeRecording                                        │
│                                                              │
│  Local State:                                                │
│  - isPlayingAudio                                           │
│  - wasRecordingBeforePlayback                               │
│                                                              │
│  Actions:                                                    │
│  - Detects video play → Calls onPauseRecording()           │
│  - Detects video end → Calls onResumeRecording()           │
│  - Manages video reset                                      │
│  - Shows toast notifications                                │
└─────────────────────────────────────────────────────────────┘
```

## Timeline Example

```
Time    Recording State    Video State       Action
────────────────────────────────────────────────────────────
0:00    Not Started        Not Playing       User clicks "Start Recording"
0:01    Active             Not Playing       Recording audio...
0:05    Active             Not Playing       User clicks play on video
0:05    Paused (auto)      Playing           Toast: "Recording Paused"
0:05    Paused             Playing           Video playing...
0:35    Paused             Playing           Video still playing...
1:05    Paused             Ended             Video ends
1:05    Paused             Reset (0:00)      Video resets to beginning
1:05    Active (auto)      Not Playing       Toast: "Recording Resumed"
1:06    Active             Not Playing       Recording audio again...
1:15    Active             Not Playing       User clicks play on video again
1:15    Paused (auto)      Playing           Toast: "Recording Paused"
1:15    Paused             Playing           Video playing again...
2:20    Paused             Ended             Video ends
2:20    Paused             Reset (0:00)      Video resets to beginning
2:20    Active (auto)      Not Playing       Toast: "Recording Resumed"
2:21    Active             Not Playing       Recording continues...
```

## Error Handling Flow

```
                    Video Error Occurs
                           │
                           ▼
              ┌────────────────────────┐
              │  onError Event         │
              │  Triggered             │
              └────────┬───────────────┘
                       │
                       ▼
              ┌────────────────────────┐
              │  Log Error Details     │
              │  - Error code          │
              │  - Error message       │
              │  - Video source        │
              └────────┬───────────────┘
                       │
                       ▼
              ┌────────────────────────┐
              │  setMediaError()       │
              │  Display error message │
              └────────┬───────────────┘
                       │
                       ▼
              ┌────────────────────────┐
              │  setIsPlayingAudio     │
              │  (false)               │
              │  Reset playback state  │
              └────────┬───────────────┘
                       │
                       ▼
              ┌────────────────────────┐
              │  Recording state       │
              │  remains unchanged     │
              │  (user can manually    │
              │   resume if needed)    │
              └────────────────────────┘
```

## Key Takeaways

1. **Automatic Pause**: Recording automatically pauses when video plays
2. **Automatic Resume**: Recording automatically resumes when video ends
3. **Video Reset**: Video resets to beginning with controls unlocked (ready for immediate replay)
4. **Clear Feedback**: Toast notifications inform user of state changes
5. **Visual Indicator**: Orange banner shows when recording is paused for video
6. **Robust**: Handles edge cases and errors gracefully
7. **Stateless Video**: Video element doesn't maintain recording state
8. **Parent Control**: Recording state managed by parent component
9. **Child Coordination**: Video component coordinates with parent via callbacks
10. **Memory Flag**: `wasRecordingBeforePlayback` ensures correct resume behavior

## Critical Fix: Video Control Lock Issue

### Problem (Before Fix)
Using `videoRef.current.load()` to reset the video caused the video element to:
- Enter a loading/buffering state
- Lock the video controls
- Require user to manually pause recording before playing video again
- Create poor UX with delayed interactivity

### Solution (After Fix)
Using `videoRef.current.pause()` + `videoRef.current.currentTime = 0`:
- ✅ Video immediately ready for replay
- ✅ Controls remain unlocked and interactive
- ✅ No loading delay
- ✅ User can play video anytime, even during recording
- ✅ Smooth, seamless experience

### Technical Explanation
```typescript
// ❌ OLD (Causes control lock)
videoRef.current.currentTime = 0;
videoRef.current.load(); // Reloads entire media element

// ✅ NEW (Keeps controls unlocked)
videoRef.current.pause(); // Ensures paused state
videoRef.current.currentTime = 0; // Rewinds to start
// Video stays in "ready" state, controls remain interactive
```
