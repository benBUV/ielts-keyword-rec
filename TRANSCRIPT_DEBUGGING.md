# Transcript Debugging Guide

## Issue
Transcripts are not appearing in the final review screen under each recording.

## Debugging Steps

### 1. Check Browser Console
Open your browser's Developer Tools (F12) and check the Console tab for these log messages:

#### During Recording:
- Look for the live transcript appearing in the "Live Transcript" box
- If you don't see any text appearing, speech recognition is not working

#### When Clicking "Stop Recording" or "Next Question":
```
Stopping recording with transcript: [your spoken text]
Created recording object: { id: "...", transcript: "...", transcriptLength: X }
```
- Check if `transcript` contains your spoken text
- Check if `transcriptLength` is greater than 0

#### When Clicking "Continue" (after stopping):
```
Confirming recording: { id: "...", transcript: "...", transcriptLength: X }
Total recordings: X
Recording 1: { id: "...", transcript: "...", transcriptLength: X }
```
- Verify the transcript is still present
- Check all recordings have transcripts

#### In Review Screen:
```
ReviewSection rendering with recordings: X
Review Recording 1: { id: "...", transcript: "...", transcriptLength: X, hasTranscript: true }
```
- Check if `hasTranscript` is `true`
- Check if `transcript` contains text

### 2. Common Issues and Solutions

#### Issue: Transcript is empty in console logs
**Cause**: Speech recognition is not working
**Solutions**:
1. Use Chrome or Edge browser (Firefox has limited support)
2. Grant microphone permissions
3. Ensure you have an active internet connection
4. Speak clearly and loudly enough for the microphone to pick up

#### Issue: Transcript appears during recording but is empty when stopped
**Cause**: Transcript is being reset before it's saved
**Solution**: This is a timing issue in the code - the transcript should be captured before stopping

#### Issue: Transcript is in console logs but not in review screen
**Cause**: The Recording object is not preserving the transcript
**Solution**: Check the console logs to see where the transcript is being lost

### 3. Visual Indicators

During recording, you should see:
1. **Live Transcript Box**: Shows your speech in real-time (if speech recognition is working)
2. **Warning Message**: If speech recognition is not supported, you'll see a yellow warning box

### 4. Test Procedure

1. Start a practice session
2. Click "Start" to begin recording
3. **Speak clearly** into your microphone
4. Watch the "Live Transcript" box - you should see your words appearing
5. Click "Stop Recording"
6. Check console for the transcript in the recording object
7. Click "Continue"
8. Check console to verify transcript is still there
9. Complete all questions
10. In review screen, check if transcripts appear under each question

### 5. Expected Behavior

In the review screen, under each question card, you should see:
- Question text (in gray box)
- Play/Pause and Download buttons
- **Transcript section** (in colored box with "Transcript:" label)

If the transcript section is missing, it means `recording.transcript` is empty or undefined.

### 6. Report Findings

Please check the console logs and report:
1. Which step shows the transcript correctly?
2. Which step shows the transcript as empty?
3. Are you using Chrome/Edge or another browser?
4. Do you see the live transcript during recording?
5. What do the console logs show?

This will help identify exactly where the transcript is being lost.
