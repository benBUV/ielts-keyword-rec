# Part 2 Card Implementation - Suggested Approach

## Overview

For Part 2 questions, we need to display a "cue card" that shows the main prompt and bullet points to guide the speaker. This card should replace/overlay the video after the video finishes and recording starts.

## Requirements

### Content Structure
```
Describe a person you know who is very kind.

You should say:
- who this person is
- how you know this person
- what he or she does
- explain why you think he or she is so kind
```

### Display Behavior
1. **Initial State**: Show video (if present) with question text
2. **After Video Ends**: Hide/minimize video and show the cue card prominently
3. **During Recording**: Keep cue card visible so user can reference the prompts
4. **Part 2 Only**: This feature is specific to Part 2 questions (2-minute monologue)

## Suggested Implementation

### Step 1: Update Data Schema

**File**: `src/types/index.ts`

Add a `card` field to the Question interface:

```typescript
export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  media?: string;
  speakingDuration: number;
  card?: {
    title: string;
    subtitle?: string; // "You should say:"
    bullets: string[];
  };
}
```

### Step 2: Update Question Bank Data

**File**: `src/data/question-banks/default.ts`

Add card data to Part 2 questions:

```typescript
{
  id: 'q1',
  type: QuestionType.Part2,
  text: 'Describe a person you know who is very kind.',
  media: 'https://www.youtube.com/watch?v=NpEaa2P7qZI',
  speakingDuration: 120,
  card: {
    title: 'Describe a person you know who is very kind.',
    subtitle: 'You should say:',
    bullets: [
      'who this person is',
      'how you know this person',
      'what he or she does',
      'explain why you think he or she is so kind'
    ]
  }
}
```

### Step 3: Update QuestionDisplay Component

**File**: `src/components/practice/question-display.tsx`

Add logic to show/hide card based on recording state:

```typescript
// Add new prop to track if recording has started
interface QuestionDisplayProps {
  question: Question;
  isRecording: boolean;
  isPaused: boolean;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  hasRecordingStarted: boolean; // NEW PROP
}

// In the component:
const showCard = question.card && 
                 question.type === 'part2' && 
                 hasRecordingStarted && 
                 !isPaused;

// Render logic:
return (
  <Card>
    <CardContent>
      {/* Question Title */}
      <h2>Part 2</h2>
      
      {/* Question Text - always visible */}
      <p>{question.text}</p>
      
      {/* Video Section - hide when card is shown */}
      {question.media && !showCard && (
        <div>
          {/* Video player */}
        </div>
      )}
      
      {/* Cue Card - show during recording for Part 2 */}
      {showCard && (
        <div className="mt-6 p-6 bg-card border-2 border-primary rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {question.card.title}
          </h3>
          
          {question.card.subtitle && (
            <p className="font-medium mb-3">
              {question.card.subtitle}
            </p>
          )}
          
          <ul className="space-y-2 list-none">
            {question.card.bullets.map((bullet, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </CardContent>
  </Card>
);
```

### Step 4: Update PracticePage Component

**File**: `src/pages/PracticePage.tsx`

Add state to track if recording has started:

```typescript
const [hasRecordingStarted, setHasRecordingStarted] = useState(false);

// In startRecording function:
const startRecording = async () => {
  // ... existing code ...
  setHasRecordingStarted(true);
  // ... rest of code ...
};

// Reset when moving to next question:
const handleNextQuestion = () => {
  // ... existing code ...
  setHasRecordingStarted(false);
  // ... rest of code ...
};

// Pass to QuestionDisplay:
<QuestionDisplay
  question={currentQuestion}
  isRecording={isRecording}
  isPaused={isPaused}
  onPauseRecording={pauseRecording}
  onResumeRecording={resumeRecording}
  hasRecordingStarted={hasRecordingStarted}
/>
```

## Alternative Approach: Show Card After Video Ends

If you want the card to appear specifically after the video ends (not just when recording starts):

```typescript
// Add state to track video completion
const [hasVideoEnded, setHasVideoEnded] = useState(false);

// In video onEnded handler:
const handleVideoEnded = () => {
  setHasVideoEnded(true);
  // ... existing resume recording logic ...
};

// Show card logic:
const showCard = question.card && 
                 question.type === 'part2' && 
                 hasVideoEnded && 
                 isRecording;
```

## UI Design Recommendations

### Card Styling

```tsx
<div className="mt-6 p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary rounded-lg shadow-lg">
  {/* Title */}
  <h3 className="text-xl font-bold text-primary mb-4">
    {question.card.title}
  </h3>
  
  {/* Subtitle */}
  <p className="font-semibold text-foreground mb-3 text-base">
    You should say:
  </p>
  
  {/* Bullets */}
  <ul className="space-y-3">
    {question.card.bullets.map((bullet, index) => (
      <li key={index} className="flex items-start gap-3">
        <span className="text-primary font-bold text-lg mt-0.5">•</span>
        <span className="text-foreground text-base leading-relaxed">
          {bullet}
        </span>
      </li>
    ))}
  </ul>
</div>
```

### Responsive Design

- **Desktop**: Show card prominently, full width
- **Mobile**: Ensure card is scrollable if content is long
- **Tablet**: Optimize spacing for medium screens

### Animation (Optional)

Add a smooth transition when card appears:

```tsx
<div className="mt-6 p-6 bg-card border-2 border-primary rounded-lg animate-in fade-in slide-in-from-top-4 duration-500">
  {/* Card content */}
</div>
```

## User Experience Flow

### Part 2 Question with Video

```
1. Page loads
   └─> Show: Question text + Video player
   
2. User clicks "Start Recording"
   └─> Recording starts
   └─> Video still visible (if not played yet)
   
3. User plays video
   └─> Video plays
   └─> Recording pauses automatically
   
4. Video ends
   └─> Video player minimizes/hides
   └─> Cue card appears ✨
   └─> Recording resumes
   └─> User can now reference bullet points while speaking
   
5. User speaks for 2 minutes
   └─> Cue card remains visible
   └─> Timer counts up
   
6. Recording stops
   └─> Move to next question or review
```

### Part 2 Question without Video

```
1. Page loads
   └─> Show: Question text only
   
2. User clicks "Start Recording"
   └─> Recording starts
   └─> Cue card appears immediately ✨
   └─> User references bullet points while speaking
   
3. User speaks for 2 minutes
   └─> Cue card remains visible
   
4. Recording stops
   └─> Move to next question or review
```

## Benefits

### For Students
- ✅ Clear guidance on what to cover in their response
- ✅ Easy to reference during speaking
- ✅ Mimics real IELTS Part 2 cue card experience
- ✅ Reduces cognitive load (don't need to remember all points)

### For Implementation
- ✅ Clean data structure
- ✅ Flexible (can add/remove bullets easily)
- ✅ Reusable across all Part 2 questions
- ✅ Optional (Part 1 and Part 3 don't need it)

## Testing Checklist

- [ ] Card appears after video ends for Part 2 questions
- [ ] Card does NOT appear for Part 1 or Part 3 questions
- [ ] Card is readable and well-formatted
- [ ] Bullets are properly aligned
- [ ] Card is responsive on mobile devices
- [ ] Card doesn't interfere with recording controls
- [ ] Card remains visible throughout 2-minute recording
- [ ] Card disappears when moving to next question

## Example Question Banks

### Part 2 Questions with Cards

```typescript
{
  id: 'part2-1',
  type: QuestionType.Part2,
  text: 'Describe a place you visited that was particularly memorable.',
  speakingDuration: 120,
  card: {
    title: 'Describe a place you visited that was particularly memorable.',
    subtitle: 'You should say:',
    bullets: [
      'where this place is',
      'when you visited it',
      'what you did there',
      'explain why it was so memorable'
    ]
  }
},
{
  id: 'part2-2',
  type: QuestionType.Part2,
  text: 'Describe a skill you would like to learn.',
  speakingDuration: 120,
  card: {
    title: 'Describe a skill you would like to learn.',
    subtitle: 'You should say:',
    bullets: [
      'what the skill is',
      'why you want to learn it',
      'how you plan to learn it',
      'explain how this skill would benefit you'
    ]
  }
}
```

## Summary

This implementation provides:
1. **Authentic IELTS Experience**: Mimics real Part 2 cue cards
2. **Clear Guidance**: Students know exactly what to cover
3. **Flexible Design**: Easy to add/modify bullet points
4. **Clean Code**: Minimal changes to existing structure
5. **User-Friendly**: Card appears at the right time (after video ends)

The key is to show the card when:
- Question type is Part 2
- Recording has started (or video has ended)
- Recording is not paused

This ensures students have the prompts visible when they need them most - during their 2-minute monologue.
