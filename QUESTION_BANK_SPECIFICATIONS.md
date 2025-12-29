# Question Bank System Specifications

## Overview

This document outlines the revised specifications for the IELTS Speaking Practice App's question bank system, detailing the removal of text-only question capability while retaining text prompts as supplementary cues.

---

## Key Changes

### 1. Removed Text-Only Question Capability

**Previous Behavior:**
- Questions could be either text-only OR media-based
- Text-only questions would display a 5-second countdown before auto-starting recording
- The `media` field was optional in the Question interface

**New Behavior:**
- **ALL questions MUST have media** (audio or video)
- Text-only questions are no longer supported
- The `media` field is now **required** in the Question interface
- No countdown timer for text-only questions (removed from UI and logic)

---

## Data Structure

### Question Interface

```typescript
export interface Question {
  id: string;
  type: QuestionType;
  text: string;              // Text prompt displayed as cue/hint to accompany the media
  media: string;             // REQUIRED: URL for audio/video content - all questions must have media
  speakingDuration: number;
  card?: {
    title: string;
    subtitle?: string;
    bullets: string[];
  };
}
```

### Key Points:

1. **`text` field**: 
   - **Retained** in the data structure
   - **Purpose**: Provides cues, hints, or context to accompany the media
   - **Display**: Continues to be shown in the UI alongside the media player
   - **Role**: Supplementary information to help users understand the question

2. **`media` field**:
   - **Changed from optional (`media?:`) to required (`media:`)**
   - **Must contain**: Valid URL to audio or video content
   - **Supported formats**:
     - YouTube videos (e.g., `https://www.youtube.com/watch?v=VIDEO_ID`)
     - Direct video files (`.mp4`, `.webm`)
     - Direct audio files (`.mp3`, `.wav`, `.ogg`)

---

## User Interface Behavior

### Question Display

When a question is loaded:

1. **Media Player** is displayed prominently (75% width on desktop, 100% on mobile)
2. **Text Prompt** is shown above or alongside the media player as a cue/hint
3. **User Action**: User must play the media (audio/video)
4. **Recording Start**: Recording begins automatically when media playback ends

### Workflow

```
Loading Phase
    ↓
Preparation Phase (Media displayed with text cue)
    ↓
User plays media
    ↓
Media ends
    ↓
Recording Phase (Auto-starts)
    ↓
Review Phase
```

---

## Implementation Details

### Files Modified

1. **`src/types/index.ts`**
   - Changed `media?: string` to `media: string` (required field)
   - Updated comment to reflect new role of text field

2. **`src/pages/PracticePage.tsx`**
   - Removed `prepCountdown` state variable
   - Removed auto-countdown useEffect for text-only questions
   - Removed countdown UI display

3. **`src/data/sample-questions.ts`**
   - Added `media` field to all sample questions

4. **Question Bank JSON Files**
   - `public/question-banks/education.json` - Added media URLs
   - `public/question-banks/technology.json` - Added media URLs
   - `public/question-banks/environment.json` - Added media URLs

### Removed Features

1. **Text-Only Countdown Timer**
   - 5-second preparation countdown UI
   - Auto-start logic for text-only questions
   - Conditional rendering based on media presence

2. **Text-Only Question Handling**
   - Logic that checked `if (!currentQuestion.media)`
   - Separate code paths for text vs. media questions

---

## Question Bank Creation Guidelines

### Requirements for New Questions

When creating new questions for the question bank:

1. **Media is Mandatory**
   - Every question MUST include a valid `media` URL
   - Questions without media will cause TypeScript compilation errors

2. **Text as Supplementary Content**
   - Include descriptive text that provides context or hints
   - Text should complement the media, not replace it
   - Text helps users understand what they're about to hear/see

3. **Example Question Structure**

```json
{
  "id": "example-q1",
  "type": "part1",
  "text": "What subject did you enjoy most at school?",
  "media": "https://example.com/audio/question1.mp3",
  "speakingDuration": 20
}
```

### Best Practices

1. **Text Content**:
   - Keep text concise and clear
   - Use text to provide context that may not be obvious from media alone
   - Include key question words or phrases

2. **Media Content**:
   - Ensure media URLs are accessible and reliable
   - Use appropriate media format for the question type
   - Consider using YouTube for video questions (built-in player support)

3. **Consistency**:
   - Maintain consistent formatting across all questions
   - Use similar media sources within a question bank
   - Ensure text and media content align

---

## Migration Guide

### For Existing Question Banks

If you have existing question banks with text-only questions:

1. **Add Media URLs**:
   - Identify all questions missing the `media` field
   - Add appropriate audio or video URLs to each question
   - Ensure URLs are valid and accessible

2. **Update Text Content**:
   - Review text content to ensure it works as a cue/hint
   - Adjust wording if necessary to complement the media

3. **Test Questions**:
   - Load the question bank in the app
   - Verify media plays correctly
   - Confirm text displays appropriately alongside media

### Example Migration

**Before (Text-Only):**
```json
{
  "id": "old-q1",
  "type": "part1",
  "text": "What is your favorite hobby?",
  "speakingDuration": 20
}
```

**After (Media Required):**
```json
{
  "id": "old-q1",
  "type": "part1",
  "text": "What is your favorite hobby?",
  "media": "https://example.com/audio/hobby-question.mp3",
  "speakingDuration": 20
}
```

---

## Technical Validation

### TypeScript Enforcement

The TypeScript compiler now enforces media requirement:

```typescript
// ✅ Valid - includes media
const validQuestion: Question = {
  id: 'q1',
  type: QuestionType.Part1,
  text: 'Sample question',
  media: 'https://example.com/audio.mp3',
  speakingDuration: 20
};

// ❌ Invalid - missing media (compilation error)
const invalidQuestion: Question = {
  id: 'q2',
  type: QuestionType.Part1,
  text: 'Sample question',
  speakingDuration: 20
};
```

### Runtime Behavior

- All questions are expected to have media
- The app will display the media player for every question
- No fallback to text-only mode

---

## User Experience Impact

### Benefits

1. **Consistent Experience**:
   - All questions follow the same media-based workflow
   - No confusion between text-only and media questions
   - Predictable user interaction pattern

2. **Authentic Practice**:
   - More closely mimics actual IELTS speaking test format
   - Audio/video questions provide realistic exam preparation
   - Better preparation for listening comprehension

3. **Enhanced Engagement**:
   - Media content is more engaging than text alone
   - Visual/audio cues improve question understanding
   - Text prompts provide helpful context

### Considerations

1. **Media Availability**:
   - Requires reliable internet connection for streaming
   - Media files must be hosted and accessible
   - Consider providing offline alternatives if needed

2. **Loading Time**:
   - Media may take time to load depending on connection speed
   - Consider preloading media during loading phase
   - Provide loading indicators for better UX

---

## Future Enhancements

### Potential Improvements

1. **Media Validation**:
   - Add runtime validation to check media URL accessibility
   - Provide fallback options if media fails to load
   - Display user-friendly error messages

2. **Offline Support**:
   - Cache media files for offline use
   - Allow downloading question banks with media
   - Implement service worker for offline functionality

3. **Media Management**:
   - Admin interface for uploading and managing media files
   - Automatic media format conversion
   - CDN integration for faster media delivery

---

## Summary

The revised question bank system:

- ✅ **Removes** text-only question capability
- ✅ **Requires** media for all questions
- ✅ **Retains** text field as supplementary cues/hints
- ✅ **Displays** text prompts in the UI alongside media
- ✅ **Enforces** media requirement through TypeScript
- ✅ **Simplifies** user workflow with consistent media-based approach

This change ensures a more consistent, engaging, and authentic IELTS speaking practice experience while maintaining the helpful context provided by text prompts.

---

**Last Updated**: 2025-11-18  
**Version**: 2.0  
**Status**: ✅ Implemented and Production Ready
