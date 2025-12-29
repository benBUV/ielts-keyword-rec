# Quick Start Guide - Speech Recognition Keyword Matching App

## What Changed?

Your app has been converted from a video-prompted speaking practice tool to a **keyword-matching speech recognition app**. Instead of watching videos, users now:

1. **Read text questions** with keyword hints
2. **Speak their responses** while recording
3. **Get instant feedback** on whether they included all required keywords
4. **Review detailed results** showing which keywords were matched or missed

## How to Use

### For Users

1. **Start the App**
   - Open the app in Chrome or Edge (best browser support)
   - Grant microphone permissions when prompted

2. **Read the Question**
   - The question is displayed prominently at the top
   - Below the question, you'll see keyword hints (e.g., "computer", "use", "often")
   - These keywords should be included in your response

3. **Record Your Answer**
   - Click "Start Recording" button
   - Speak naturally, making sure to include the keywords
   - Your speech is transcribed in real-time (visible below)
   - Use "Pause" if you need to think
   - Click "Next Question" when you're done

4. **Get Instant Feedback**
   - ✅ "Correct!" - All keywords found
   - ⚠️ "Incomplete" - Some keywords missing

5. **Review Your Results**
   - After all questions, see your overall score
   - Each question shows:
     - ✅ Matched keywords (green badges)
     - ❌ Missed keywords (red badges)
     - Full transcript
     - Audio playback option

### For Developers

#### Running the App

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

#### Adding New Questions

Edit any question bank file (e.g., `src/data/question-banks/default.ts`):

```typescript
{
  id: 'q1',
  type: QuestionType.Part1,
  text: 'What is your favorite hobby?',
  keywords: ['hobby', 'favorite', 'enjoy', 'like', 'activity'],
  speakingDuration: 20,
}
```

**Keyword Tips:**
- Include 4-7 keywords per question
- Mix required words (from the question) with expected response words
- Include variations (e.g., "study", "studying", "studies")
- The algorithm handles basic stemming automatically

#### Keyword Matching Algorithm

The app uses intelligent matching:

```typescript
// Case-insensitive
"Computer" matches "computer" ✅

// Basic stemming
"studying" matches "study" ✅
"worked" matches "work" ✅

// Multi-word keywords
"environmental protection" matches if both words are present ✅

// Punctuation ignored
"don't" matches "dont" ✅
```

## Key Features

### 1. Text Questions with Keyword Hints
- Clear, readable questions
- Keywords displayed as visual hints
- No video loading delays

### 2. Real-Time Transcription
- See your words as you speak
- Verify you're including keywords
- Pause and resume anytime

### 3. Instant Feedback
- Know immediately if you got it right
- Toast notifications after each question
- Visual indicators (✅/❌)

### 4. Detailed Review
- Overall score with percentage
- Keyword analysis for each question
- Audio playback and download
- Full transcripts

### 5. Manual Progression
- "Next Question" button for user control
- No automatic timing
- Take as long as you need

## Question Banks

Switch between topics using URL parameters:

```
# Computers (default)
http://localhost:5173/

# Technology
http://localhost:5173/?bank=technology

# Education
http://localhost:5173/?bank=education

# Environment
http://localhost:5173/?bank=environment
```

## Browser Support

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| Recording | ✅ | ✅ | ✅ | ✅ |
| Transcription | ✅ | ✅ | ✅ | ⚠️ Limited |
| Keyword Matching | ✅ | ✅ | ✅ | ✅ |

**Recommendation:** Use Chrome or Edge for best experience.

## Troubleshooting

### "No transcript appearing"
- Check microphone permissions
- Ensure internet connection (speech recognition requires it)
- Try Chrome or Edge browser
- Speak clearly and at normal volume

### "Keywords not matching"
- Include the exact keywords or their variations
- Check the keyword hints before answering
- Review your transcript to see what was captured
- The algorithm handles basic variations (e.g., "studying" → "study")

### "Microphone not working"
- Ensure HTTPS connection (required for microphone access)
- Check browser permissions
- Reload page and grant permissions again
- Try a different browser

## What Was Removed

The following features were removed during conversion:

- ❌ Video/audio prompts
- ❌ YouTube player integration
- ❌ Video preloading
- ❌ Auto-start recording after video
- ❌ Media error handling

## What Was Kept

The following features remain unchanged:

- ✅ Audio recording
- ✅ Speech recognition
- ✅ Transcript display
- ✅ Audio playback
- ✅ Download functionality
- ✅ Question bank system
- ✅ Pause/Resume controls
- ✅ Silence detection

## Next Steps

1. **Test the app** with different questions
2. **Customize keywords** in question banks
3. **Add new question banks** for your topics
4. **Deploy** to your hosting platform
5. **Share** with users

## Need Help?

- Check `CONVERSION_SUMMARY.md` for technical details
- Review `README.md` for full documentation
- Check browser console for error messages
- Ensure HTTPS for microphone access

---

**Enjoy your new keyword-matching speech recognition app!** 🎉
