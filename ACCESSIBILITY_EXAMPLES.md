# Accessibility Implementation Examples

## Visual States and Behavior

### State 1: Media Available and Working ✅

**Visual Appearance:**
```
┌─────────────────────────────────────────┐
│                                         │
│         [VIDEO PLAYER]                  │
│     (YouTube or HTML5 video)            │
│                                         │
└─────────────────────────────────────────┘
```

**DOM Structure:**
```html
<!-- Text is in DOM but visually hidden -->
<div class="sr-only" role="region" aria-label="Question text content">
  <p>What are the advantages of living in a city?</p>
</div>

<!-- Video is visible and linked to text -->
<div role="region" aria-describedby="question-text-123">
  <video aria-label="Video question: What are the advantages...">
    ...
  </video>
</div>
```

**Screen Reader Experience:**
- Announces: "Question text content, region"
- Reads: "What are the advantages of living in a city?"
- Then: "Video question: What are the advantages of living in a city?"
- User can access both text and video

---

### State 2: Media Failed to Load ❌

**Visual Appearance:**
```
┌─────────────────────────────────────────┐
│  What are the advantages of living      │
│  in a city?                             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  ⚠️ Video error: Failed to load video   │
└─────────────────────────────────────────┘
```

**DOM Structure:**
```html
<!-- Text is now VISIBLE -->
<div class="prose prose-lg max-w-none" role="region">
  <p>What are the advantages of living in a city?</p>
</div>

<!-- Error message displayed -->
<div class="text-sm text-destructive">
  ⚠️ Video error: Failed to load video
</div>
```

**User Experience:**
- Text is prominently displayed
- Clear error message shown
- User can still read and respond to question
- No functionality lost

---

### State 3: No Media Available 📝

**Visual Appearance:**
```
┌─────────────────────────────────────────┐
│  What are the advantages of living      │
│  in a city?                             │
│                                         │
│  (Text-only question)                   │
└─────────────────────────────────────────┘
```

**DOM Structure:**
```html
<!-- Text is visible (no media to hide it) -->
<div class="prose prose-lg max-w-none" role="region">
  <p>What are the advantages of living in a city?</p>
</div>

<!-- No media elements rendered -->
```

**User Experience:**
- Clean text presentation
- No media player shown
- Straightforward reading experience

---

## ARIA Relationship Diagram

```
┌─────────────────────────────────────────────────────────┐
│  Text Content (Always in DOM)                           │
│  id="question-text-123"                                 │
│  role="region"                                          │
│  aria-label="Question text content"                     │
│  aria-live="polite"                                     │
│                                                         │
│  "What are the advantages of living in a city?"        │
└─────────────────────────────────────────────────────────┘
                          ↑
                          │
                          │ aria-describedby
                          │
┌─────────────────────────────────────────────────────────┐
│  Media Element (Video/Audio)                            │
│  aria-describedby="question-text-123"                   │
│  aria-label="Video question: What are the advantages..." │
│                                                         │
│  [▶️ Play Button]  [⏸️ Pause]  [🔊 Volume]              │
└─────────────────────────────────────────────────────────┘
```

**How it works:**
1. Screen reader encounters media element
2. Reads `aria-label`: "Video question: What are the advantages..."
3. Follows `aria-describedby` to text content
4. Reads full question text from linked element
5. User has complete context

---

## Screen Reader Announcements

### Example 1: VoiceOver (macOS/iOS)

**When media is working:**
```
"Question text content, region"
"What are the advantages of living in a city?"
"Video question: What are the advantages of living in a city?, video"
"Play button"
```

**When media fails:**
```
"Question text content, region"
"What are the advantages of living in a city?"
"Alert: Video error: Failed to load video"
```

---

### Example 2: NVDA (Windows)

**When media is working:**
```
"Region, Question text content"
"What are the advantages of living in a city?"
"Video, Video question: What are the advantages of living in a city?"
"Play, button"
```

**When media fails:**
```
"Region, Question text content"
"What are the advantages of living in a city?"
"Alert, Video error: Failed to load video"
```

---

### Example 3: JAWS (Windows)

**When media is working:**
```
"Question text content region"
"What are the advantages of living in a city?"
"Video question: What are the advantages of living in a city? video"
"Play button"
```

**When media fails:**
```
"Question text content region"
"What are the advantages of living in a city?"
"Video error: Failed to load video"
```

---

## Keyboard Navigation Flow

### Scenario: User navigating with Tab key

```
1. [Tab] → Focus on video player
   Screen reader: "Video question: What are the advantages..."
   
2. [Tab] → Focus on Play button
   Screen reader: "Play button"
   
3. [Enter] → Play video
   Screen reader: "Playing"
   
4. [Tab] → Focus on volume control
   Screen reader: "Volume slider, 50%"
   
5. [Tab] → Focus on fullscreen button
   Screen reader: "Fullscreen button"
```

### Scenario: Media failed, keyboard navigation

```
1. [Tab] → Focus moves past hidden video
   Screen reader: "Question text content region"
   Screen reader: "What are the advantages of living in a city?"
   
2. [Tab] → Focus on next interactive element
   (No broken focus traps)
```

---

## Browser Fallback Messages

### Chrome/Edge
```html
<video>
  <source src="video.mp4" type="video/mp4" />
  <p class="text-white p-4">
    Your browser does not support the video element. 
    Please refer to the question text above.
  </p>
</video>
```

**Displays when:**
- Browser doesn't support `<video>` element
- Video codec not supported
- JavaScript disabled

---

### Firefox
```html
<audio>
  <source src="audio.mp3" type="audio/mpeg" />
  <p>
    Your browser does not support the audio element. 
    Please refer to the question text above.
  </p>
</audio>
```

**Displays when:**
- Browser doesn't support `<audio>` element
- Audio codec not supported
- JavaScript disabled

---

## Testing Scenarios

### Test 1: Screen Reader Access
**Steps:**
1. Enable screen reader (VoiceOver, NVDA, JAWS)
2. Navigate to question with video
3. Verify text content is announced
4. Verify video has descriptive label
5. Verify relationship between text and video

**Expected Result:** ✅
- Text is accessible even when video is visible
- Clear descriptions provided
- Logical navigation order

---

### Test 2: Media Failure
**Steps:**
1. Load question with invalid video URL
2. Wait for video to fail loading
3. Observe UI changes

**Expected Result:** ✅
- Text becomes visible
- Error message displayed
- User can still complete task

---

### Test 3: No Media
**Steps:**
1. Load question without media URL
2. Observe display

**Expected Result:** ✅
- Text displayed prominently
- No media player shown
- Clean, readable layout

---

### Test 4: Keyboard Only
**Steps:**
1. Disconnect mouse
2. Navigate using only Tab, Enter, Space, Arrow keys
3. Attempt to play video and control playback

**Expected Result:** ✅
- All controls accessible
- No focus traps
- Logical tab order

---

## Code Examples for Developers

### Example 1: Adding ARIA to Custom Video Component

```tsx
<div 
  role="region"
  aria-label="Question video player"
  aria-describedby="question-text-123"
>
  <video
    aria-label="Video question: [question text]"
    aria-describedby="question-text-123"
  >
    <source src="video.mp4" />
    <p>Fallback message with clear instructions</p>
  </video>
</div>
```

---

### Example 2: Conditional Text Visibility

```tsx
<div 
  id={`question-text-${question.id}`}
  className={mediaError || !question.media 
    ? "prose prose-lg max-w-none"  // Visible
    : "sr-only"                     // Screen reader only
  }
  role="region"
  aria-label="Question text content"
  aria-live="polite"
>
  <p>{question.text}</p>
</div>
```

---

### Example 3: Error Handling with Accessibility

```tsx
const [mediaError, setMediaError] = useState<string | null>(null);

<video
  onError={(e) => {
    const error = e.currentTarget.error;
    setMediaError(`Video error: ${error?.message || 'Failed to load'}`);
  }}
>
  <source src={mediaUrl} />
  <p>Your browser does not support video. Please refer to the text above.</p>
</video>

{mediaError && (
  <div 
    role="alert"
    className="text-destructive"
  >
    ⚠️ {mediaError}
  </div>
)}
```

---

## Accessibility Checklist

### Content
- [x] Text alternative always available
- [x] Text is meaningful and complete
- [x] Text matches media content
- [x] Fallback messages are clear

### Structure
- [x] Semantic HTML used
- [x] Proper heading hierarchy
- [x] Landmarks defined with roles
- [x] Logical reading order

### ARIA
- [x] `role` attributes used correctly
- [x] `aria-label` provides clear descriptions
- [x] `aria-describedby` creates relationships
- [x] `aria-live` announces changes appropriately

### Keyboard
- [x] All functionality keyboard accessible
- [x] Focus visible and logical
- [x] No keyboard traps
- [x] Shortcuts don't conflict

### Visual
- [x] Color contrast meets WCAG AA
- [x] Text is resizable
- [x] Layout doesn't break at 200% zoom
- [x] Focus indicators visible

---

## Resources

### WCAG Guidelines
- [WCAG 2.1 Level AA](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&levels=aa)
- [Understanding WCAG 2.1](https://www.w3.org/WAI/WCAG21/Understanding/)

### ARIA Specifications
- [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### Testing Tools
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse Accessibility Audit](https://developers.google.com/web/tools/lighthouse)

---

## Conclusion

This implementation provides:
- ✅ **Multiple access methods** for content
- ✅ **Robust fallback mechanisms** for failures
- ✅ **WCAG 2.1 Level AA compliance**
- ✅ **Screen reader compatibility**
- ✅ **Keyboard navigation support**
- ✅ **Clear error messaging**

All users, regardless of ability or technology, can access and interact with the question content effectively.
