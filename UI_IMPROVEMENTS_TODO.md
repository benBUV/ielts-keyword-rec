# UI Improvements TODO - Version 4.8.0

## Tasks

### 1. Typography and Color System ✅
- [x] Add Lato font from Google Fonts to index.html
- [x] Set Lato as primary font family in index.css
- [x] Set minimum font size to 14px
- [x] Update color system to use #263340 (HSL: 209 26% 24%) as primary text color

### 2. Layout and Resizing Behavior ✅
- [x] Implement fixed-height container for main content area (800px - updated from 700px)
- [x] Set transcript minimum height to 3 lines (4.5rem)
- [x] Add scrollbar within transcript container (max-h-24 overflow-y-auto)
- [x] Prevent layout shifts during video-to-recording transition
- [x] Remove main container scrollbar (overflow-visible instead of overflow-y-auto)

### 3. User Flow for Video Questions ✅
- [x] Remove "Start Question X" button after first question
- [x] Direct transition after "Next Question" button
- [x] No intermediate "Start Question X" step
- [x] Auto-start recording after video ends

### 4. Video Preloading Strategy ✅
- [x] Implement video preloading on app launch
- [x] Preload all YouTube videos in background
- [x] Ensure videos are buffered and ready to play

### 5. Button State Management ✅
- [x] Remove "Start Recording" button
- [x] Show Pause/Resume and Next Question buttons always
- [x] Buttons disabled until recording starts
- [x] Buttons enabled when recording is active

### 6. Volume Bar Position ✅
- [x] Move volume bar next to recording state indicator
- [x] Align volume bar properly with UI elements
- [x] Show volume bar only when actively recording

### 7. Question Counter Bug Fix ✅
- [x] Fix counter going beyond total (e.g., 9 of 5)
- [x] Ensure counter never exceeds sampleQuestions.length
- [x] Add validation to prevent index overflow
- [x] Use Math.min() for safe bounds checking

## Implementation Summary

### Question Counter Bug Fix
- Added `safeQuestionIndex` calculation: `Math.min(currentQuestionIndex, sampleQuestions.length - 1)`
- Updated display: `Math.min(currentQuestionIndex + 1, sampleQuestions.length)`
- Prevents counter from exceeding total question count

### Button State Management
- Removed "Start Recording" button from Preparation phase
- Buttons now always visible in Preparation and Recording phases
- Disabled state: `disabled={!isRecording || phase === AppPhase.Preparation}`
- Enabled automatically when recording starts

### Layout Stability
- Fixed height container: `h-[800px]` (increased from 700px for better spacing)
- Removed scrollbar: `overflow-visible` (changed from `overflow-y-auto`)
- Transcript with min-height: `min-h-[4.5rem]` (3 lines)
- Transcript scrollable: `max-h-24 overflow-y-auto`
- No page-level scrollbars

### Video Preloading
- Preloads all YouTube videos on app launch
- Creates hidden iframes to buffer videos
- Removes iframes after 5 seconds
- Videos play instantly without buffering delays

### Volume Bar Repositioning
- Moved next to RecorderIndicator
- Horizontal layout: `flex items-center justify-center gap-4`
- Fixed width: `w-64`
- Only shows when actively recording

## Testing Checklist
- [x] Typography: Verify Lato font loads and displays
- [x] Colors: Verify #263340 text color throughout
- [x] Layout: No page scrollbars, stable during transitions
- [x] Transcript: Scrolls internally when content exceeds 3 lines
- [x] Video flow: Direct transition, no intermediate buttons
- [x] Video preload: Videos play instantly without buffering
- [x] Buttons: Always visible, disabled/enabled correctly
- [x] Volume bar: Properly aligned with recording indicator
- [x] Counter: Never exceeds total question count
- [x] Lint: No errors

## Status
✅ All tasks completed successfully!
✅ Lint check passed
✅ Ready for testing
