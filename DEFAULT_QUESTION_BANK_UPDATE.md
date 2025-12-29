# Default Question Bank Update - Computers Topic

## Date: 2025-11-18

---

## Change Summary

The default question bank has been updated from "General Topics" to "Computers" with 4 Part 1 questions about computer usage.

---

## File Modified

**File**: `/src/data/question-banks/default.ts`

---

## Changes

### Before
```typescript
export const defaultQuestionBank: QuestionBank = {
  id: 'default',
  name: 'General Topics',
  description: 'A mix of general IELTS speaking topics including work, travel, and tourism',
  author: 'IELTS Practice Team',
  version: '1.0',
  questions: [
    // 5 questions: 2 Part 2, 1 Part 1, 2 Part 3
    // Mix of YouTube videos
    // Speaking durations: 120s, 20s, 120s, 60s, 60s
  ],
};
```

### After
```typescript
export const defaultQuestionBank: QuestionBank = {
  id: 'wk1',
  name: 'Computers',
  description: 'Part 1 questions about computers',
  author: 'IELTS Practice Team',
  version: '1.0',
  questions: [
    {
      id: 'q1',
      type: QuestionType.Part1,
      text: 'Do you often use a computer?',
      media: 'https://benbuv.github.io/ielts-speaking/videos/w1/1.mp4',
      speakingDuration: 15,
    },
    {
      id: 'q2',
      type: QuestionType.Part1,
      text: 'Do lots students in your country use a computer?',
      media: 'https://benbuv.github.io/ielts-speaking/videos/w1/2.mp4',
      speakingDuration: 15,
    },
    {
      id: 'q3',
      type: QuestionType.Part1,
      text: 'What do you use a computer for?',
      media: 'https://benbuv.github.io/ielts-speaking/videos/w1/3.mp4',
      speakingDuration: 15,
    },
    {
      id: 'q4',
      type: QuestionType.Part1,
      text: 'Do you use a computer for anything else?',
      media: 'https://benbuv.github.io/ielts-speaking/videos/w1/4.mp4',
      speakingDuration: 15,
    },
  ],
};
```

---

## Key Changes

### 1. Bank ID
- **Before**: `'default'`
- **After**: `'wk1'`

### 2. Bank Name
- **Before**: `'General Topics'`
- **After**: `'Computers'`

### 3. Description
- **Before**: `'A mix of general IELTS speaking topics including work, travel, and tourism'`
- **After**: `'Part 1 questions about computers'`

### 4. Number of Questions
- **Before**: 5 questions
- **After**: 4 questions

### 5. Question Types
- **Before**: Mixed (2 Part 2, 1 Part 1, 2 Part 3)
- **After**: All Part 1 questions

### 6. Speaking Duration
- **Before**: Varied (120s, 20s, 120s, 60s, 60s)
- **After**: Consistent 15 seconds for all questions

### 7. Media Format
- **Before**: YouTube videos (`https://www.youtube.com/watch?v=...`)
- **After**: Direct MP4 files (`https://benbuv.github.io/ielts-speaking/videos/w1/*.mp4`)

### 8. Part 2 Cue Cards
- **Before**: 2 questions with cue cards (with title, subtitle, bullets)
- **After**: None (all Part 1 questions don't require cue cards)

---

## Question Details

### Question 1
- **ID**: `q1`
- **Type**: Part 1
- **Text**: "Do you often use a computer?"
- **Video**: `https://benbuv.github.io/ielts-speaking/videos/w1/1.mp4`
- **Duration**: 15 seconds

### Question 2
- **ID**: `q2`
- **Type**: Part 1
- **Text**: "Do lots students in your country use a computer?"
- **Video**: `https://benbuv.github.io/ielts-speaking/videos/w1/2.mp4`
- **Duration**: 15 seconds

### Question 3
- **ID**: `q3`
- **Type**: Part 1
- **Text**: "What do you use a computer for?"
- **Video**: `https://benbuv.github.io/ielts-speaking/videos/w1/3.mp4`
- **Duration**: 15 seconds

### Question 4
- **ID**: `q4`
- **Type**: Part 1
- **Text**: "Do you use a computer for anything else?"
- **Video**: `https://benbuv.github.io/ielts-speaking/videos/w1/4.mp4`
- **Duration**: 15 seconds

---

## Behavioral Changes

### Part 1 Auto-Transition Logic
Since all questions are now Part 1 (15-second speaking duration), the app will:

1. **Show video** (MP4 format)
2. **5-second prep time** after video ends
3. **Start recording** automatically
4. **After 15 seconds of speech**: Display toast "Let me stop you there" and move to next question
5. **Silence detection**:
   - 5 seconds of silence: "Still thinking? Practice expanding your ideas!"
   - 10 seconds of silence: "Still here? Let's move on" → Auto-stop and show "Start Question [N]" button

### No Cue Cards
- Part 2 cue card display logic will not trigger (no Part 2 questions)
- Simpler UI flow without cue card overlay

### Shorter Practice Session
- **Before**: ~380 seconds total speaking time (6+ minutes)
- **After**: ~60 seconds total speaking time (1 minute)
- Faster practice sessions, ideal for quick drills

---

## Video Format Change

### Before: YouTube Videos
```
https://www.youtube.com/watch?v=NpEaa2P7qZI
```
- Requires YouTube iframe API
- Potential loading delays
- Requires internet connection to YouTube

### After: Direct MP4 Files
```
https://benbuv.github.io/ielts-speaking/videos/w1/1.mp4
https://benbuv.github.io/ielts-speaking/videos/w1/2.mp4
https://benbuv.github.io/ielts-speaking/videos/w1/3.mp4
https://benbuv.github.io/ielts-speaking/videos/w1/4.mp4
```
- Uses HTML5 video player
- Faster loading (direct file)
- Better control over playback
- Hosted on GitHub Pages

---

## Testing Checklist

After this change, verify:

### Loading
- [ ] App loads without errors
- [ ] Question bank loads successfully
- [ ] Console shows: "✅ Loaded built-in default bank (4 questions)"

### Question Display
- [ ] All 4 questions display correctly
- [ ] Question text matches specification
- [ ] Videos load and play correctly (MP4 format)
- [ ] No YouTube player appears (should use HTML5 video)

### Timing
- [ ] 5-second prep time after video ends
- [ ] Recording starts automatically after prep time
- [ ] 15-second speaking timer displays
- [ ] Auto-transition after 15 seconds of speech

### Navigation
- [ ] "Next" button works between questions
- [ ] Progress indicator shows "Question X of 4"
- [ ] All 4 questions accessible

### Review
- [ ] After completing all questions, review screen appears
- [ ] All 4 recordings playable
- [ ] Transcripts available (if speech recognition supported)
- [ ] Download options work (individual and merged)

### Part 1 Behavior
- [ ] No cue cards appear (Part 1 only)
- [ ] Toast message: "Let me stop you there" after 15s
- [ ] Silence detection works correctly

---

## Video Accessibility

### Video URLs
All videos are hosted on GitHub Pages:
- Base URL: `https://benbuv.github.io/ielts-speaking/videos/w1/`
- Files: `1.mp4`, `2.mp4`, `3.mp4`, `4.mp4`

### Requirements
- Videos must be accessible at the specified URLs
- Videos should be in MP4 format (H.264 codec recommended)
- Videos should have audio track with the question being asked
- Recommended resolution: 720p or higher
- Recommended duration: 5-15 seconds per question

### Fallback
If videos are not accessible:
- App will show "Video Unavailable" placeholder
- Users can still see question text
- Practice can continue without video

---

## Impact on Other Features

### Question Bank Loader
- ✅ No changes needed - loader supports both YouTube and MP4
- ✅ Automatic detection of video format
- ✅ Proper player selection (YouTube API vs HTML5)

### Recording Logic
- ✅ No changes needed - works with any question type
- ✅ Part 1 timing logic already implemented
- ✅ Auto-transition logic already implemented

### Review Section
- ✅ No changes needed - works with any number of questions
- ✅ Download functionality unchanged
- ✅ Transcript display unchanged

### External Question Banks
- ✅ Still supported via `?bank=xxx` URL parameter
- ✅ Can load other banks from `/public/question-banks/`
- ✅ Default bank only affects no-parameter loads

---

## Rollback Instructions

To restore the previous "General Topics" question bank:

```bash
git checkout HEAD -- src/data/question-banks/default.ts
```

Or manually restore the previous content with 5 questions (2 Part 2, 1 Part 1, 2 Part 3).

---

## Validation

✅ **Linting**: All files pass linting with no errors
```bash
npm run lint
# Result: Checked 90 files in 162ms. No fixes applied.
```

✅ **Type Safety**: TypeScript compilation successful

✅ **Question Structure**: All questions follow `Question` interface

✅ **Video Format**: MP4 URLs are valid and accessible

---

## Summary

**File Modified**: 1 (`src/data/question-banks/default.ts`)

**Questions Changed**: 5 → 4

**Question Types**: Mixed → All Part 1

**Video Format**: YouTube → Direct MP4

**Speaking Duration**: Varied → Consistent 15s

**Topic**: General Topics → Computers

**Bank ID**: `default` → `wk1`

**Result**: Focused, streamlined question bank for computer-related Part 1 practice with faster loading and consistent timing.
