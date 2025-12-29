# IELTS Speaking Practice App - Quick Start Guide

## 🚀 Your App is Ready!

The IELTS Speaking Practice App is fully functional and ready to use. Here's everything you need to know to get started.

---

## ✨ What's New

### 1. YouTube Video Support
- **Question 1** now uses a YouTube video: https://www.youtube.com/watch?v=NpEaa2P7qZI
- The video will embed automatically when you start the question
- Watch the video, then click "Start Recording" to record your response

### 2. Immediate Recording
- **No preparation time delay** - recording starts immediately when you're ready
- Text-only questions: Recording starts as soon as you click "Start"
- Media questions: Recording starts right after the video/audio ends (or when you click "Start Recording")

### 3. Prominent Recording Indicator
- Large **"RECORDING NOW"** banner with pulsing dots
- Clear visual feedback so you always know when recording is active

---

## 🎯 How to Use

### For Students

**Step 1: Start Practice**
1. Open the app in your browser
2. You'll see: "Ready? Click start to begin"
3. Click **"Start Question 1"**

**Step 2: Watch/Listen (if media present)**
1. For Question 1: YouTube video will appear
2. Watch the video (you can pause, rewind, adjust volume)
3. When ready, click **"Start Recording"**

**Step 3: Record Your Response**
1. **"RECORDING NOW"** banner appears immediately
2. Speak your response
3. Watch the timer and audio level bar
4. Recording will auto-stop based on question type:
   - Part 1: 20 seconds → "Let me stop you there"
   - Part 2: 2 minutes → "That's two minutes, great job!"
   - Part 3: 1 minute → "Nice response! Let me ask you something else…"

**Step 4: Continue or Retry**
1. After recording stops, you'll see two options:
   - **"Retry Question"**: Record this question again
   - **"Continue"**: Move to next question
2. Or click **"Next Question"** during recording to move on

**Step 5: Review Your Responses**
1. After all questions, you'll see the review screen
2. Play back your audio recordings
3. Read your transcripts (if available)
4. Download individual recordings or merged file
5. Click **"Retry"** to practice again

---

## 🎬 YouTube Video Example

### Question 1 Setup
The first question uses this YouTube video:
- **URL**: https://www.youtube.com/watch?v=NpEaa2P7qZI
- **Question**: "Do you work or are you a student?"
- **Duration**: 20 seconds (Part 1)

### What Happens
1. Click "Start Question 1"
2. Question text displays
3. YouTube video player appears
4. Watch the video
5. Click "Start Recording" when ready
6. Speak your response
7. Auto-transition after 20 seconds

---

## 🔧 Adding Your Own YouTube Videos

### Quick Steps
1. Find a YouTube video
2. Copy the URL (e.g., `https://www.youtube.com/watch?v=VIDEO_ID`)
3. Open `src/data/question-banks/default.ts`
4. Update the `media` field with your YouTube URL
5. Save and refresh

### Example
```typescript
{
  id: 'q1',
  type: QuestionType.Part1,
  text: 'Your question text here',
  media: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
  speakingDuration: 20,
}
```

### Supported URL Formats
- ✅ `https://www.youtube.com/watch?v=VIDEO_ID`
- ✅ `https://youtu.be/VIDEO_ID`
- ✅ `https://www.youtube.com/embed/VIDEO_ID`

---

## 🌐 Browser Compatibility

### Full Support (Recording + Transcripts)
- ✅ **Google Chrome** (Recommended)
- ✅ **Microsoft Edge**

### Partial Support (Recording Only)
- ⚠️ **Firefox** (No speech recognition)
- ⚠️ **Safari** (No speech recognition)

---

## 📱 Canvas LMS Integration

### Embedding in Canvas
```html
<iframe 
  src="YOUR_APP_URL" 
  width="100%" 
  height="800px" 
  frameborder="0"
  allow="microphone"
></iframe>
```

**Important**: Include `allow="microphone"` for audio recording.

---

## 🎓 Question Types

### Part 1: Short Answers (20 seconds)
- Quick, personal questions
- Auto-transition after 20 seconds

### Part 2: Long Monologue (2 minutes)
- Extended speaking on a topic
- Auto-stop after 2 minutes

### Part 3: Discussion (1 minute)
- Opinion and analysis questions
- Auto-transition after 1 minute

---

## 💾 Download Options

### Individual Recordings
- Click download icon next to each question
- Downloads as `recording-[ID].webm`

### Merged Recording
- Click **"Download All"** button
- Downloads as `ielts-practice-merged.wav`
- All questions combined

---

## 🆘 Troubleshooting

### Video Not Loading
- Some YouTube videos have embedding disabled
- Try a different video

### No Audio Recording
- Allow microphone access in browser
- Check microphone is not muted

### No Transcripts
- Use Chrome or Edge for speech recognition
- Firefox and Safari don't support transcripts

---

## 📚 Documentation

### For Users
- **USER_GUIDE.md**: Complete user guide
- **BROWSER_COMPATIBILITY.md**: Browser support details

### For Developers
- **TECHNICAL_DOCUMENTATION.md**: Architecture
- **API_REFERENCE.md**: Component API
- **QUESTION_BANK_GUIDE.md**: Custom question banks
- **YOUTUBE_VIDEO_SUPPORT.md**: YouTube setup
- **IMMEDIATE_RECORDING.md**: Recording feature

---

## 🎉 You're All Set!

The app is ready with:
- ✅ YouTube video support (Question 1)
- ✅ Immediate recording (no prep time)
- ✅ Live transcripts (Chrome/Edge)
- ✅ Professional design
- ✅ Canvas LMS ready

**Just open the app and click "Start Question 1" to begin!**

**Happy practicing! 🎤**
