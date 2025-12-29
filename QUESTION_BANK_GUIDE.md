# Question Bank System - Complete Guide

## 🎯 Quick Overview

The IELTS Speaking Practice App now supports **dynamic question banks** that can be added at any time without code changes. Simply create a JSON file, upload it, and access it via URL parameter.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [How It Works](#how-it-works)
3. [Creating a Question Bank](#creating-a-question-bank)
4. [Question Types](#question-types)
5. [Adding Media](#adding-media)
6. [Canvas LMS Integration](#canvas-lms-integration)
7. [Examples](#examples)
8. [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### For Instructors (3 Steps)

**Step 1**: Create a JSON file
```json
{
  "id": "my-bank",
  "name": "My Questions",
  "description": "Custom questions for my class",
  "author": "Your Name",
  "version": "1.0",
  "questions": [
    {
      "id": "q1",
      "type": "part1",
      "text": "What is your favorite subject?",
      "speakingDuration": 20
    }
  ]
}
```

**Step 2**: Upload to `/public/question-banks/my-bank.json`

**Step 3**: Access via `?bank=my-bank`

### For Students

Access different question banks via URL:
- Default: `https://app.com/`
- Technology: `https://app.com/?bank=technology`
- Education: `https://app.com/?bank=education`
- Environment: `https://app.com/?bank=environment`
- Custom: `https://app.com/?bank=my-bank`

## 🔧 How It Works

### Loading Process

```
User visits: https://app.com/?bank=technology
         ↓
App extracts "technology" from URL
         ↓
App fetches /question-banks/technology.json
         ↓
App validates JSON structure
         ↓
App displays questions
```

### Fallback System

If a bank fails to load:
1. App catches the error
2. App loads default bank instead
3. App shows error notification to user
4. Practice continues with default questions

**Result**: App never breaks, always works!

## 📝 Creating a Question Bank

### Minimum Required Structure

```json
{
  "id": "unique-id",
  "name": "Display Name",
  "description": "Brief description",
  "author": "Your Name",
  "version": "1.0",
  "questions": []
}
```

### Complete Example

```json
{
  "id": "travel",
  "name": "Travel & Tourism",
  "description": "Questions about travel experiences and tourism",
  "author": "IELTS Practice Team",
  "version": "1.0",
  "questions": [
    {
      "id": "travel-q1",
      "type": "part1",
      "text": "Do you enjoy traveling?",
      "speakingDuration": 20
    },
    {
      "id": "travel-q2",
      "type": "part2",
      "text": "Describe a memorable trip you have taken.",
      "speakingDuration": 120,
      "card": {
        "title": "Describe a memorable trip you have taken.",
        "subtitle": "You should say:",
        "bullets": [
          "where you went",
          "when you went there",
          "what you did",
          "explain why it was memorable"
        ]
      }
    },
    {
      "id": "travel-q3",
      "type": "part3",
      "text": "How has tourism changed in recent years?",
      "speakingDuration": 60
    }
  ]
}
```

## 📚 Question Types

### Part 1: Short Answers (20 seconds)

**Purpose**: Quick, simple questions about familiar topics

**Structure**:
```json
{
  "id": "q1",
  "type": "part1",
  "text": "What do you do in your free time?",
  "speakingDuration": 20
}
```

**Characteristics**:
- ✅ Personal information
- ✅ Familiar topics
- ✅ Quick responses
- ✅ 20 seconds speaking time

### Part 2: Long Turn (120 seconds / 2 minutes)

**Purpose**: Extended monologue on a given topic

**Structure**:
```json
{
  "id": "q2",
  "type": "part2",
  "text": "Describe a person you admire.",
  "speakingDuration": 120,
  "card": {
    "title": "Describe a person you admire.",
    "subtitle": "You should say:",
    "bullets": [
      "who this person is",
      "how you know them",
      "what they do",
      "explain why you admire them"
    ]
  }
}
```

**Characteristics**:
- ✅ Requires cue card
- ✅ 2 minutes speaking time
- ✅ Structured prompts
- ✅ Detailed response expected

**Important**: Part 2 questions **must** include a `card` object!

### Part 3: Discussion (60 seconds / 1 minute)

**Purpose**: Abstract discussion and analysis

**Structure**:
```json
{
  "id": "q3",
  "type": "part3",
  "text": "How has technology changed education?",
  "speakingDuration": 60
}
```

**Characteristics**:
- ✅ Abstract topics
- ✅ Analytical thinking
- ✅ 1 minute speaking time
- ✅ Follow-up to Part 2

## 🎬 Adding Media

### YouTube Videos

```json
{
  "id": "q1",
  "type": "part2",
  "text": "Describe what you see in the video.",
  "media": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "speakingDuration": 120,
  "card": {
    "title": "Describe what you see in the video.",
    "subtitle": "You should say:",
    "bullets": [
      "what the video shows",
      "what is happening",
      "how it makes you feel",
      "explain what you learned from it"
    ]
  }
}
```

### Audio Files

```json
{
  "id": "q1",
  "type": "part1",
  "text": "Listen and respond to the question.",
  "media": "https://example.com/question-audio.mp3",
  "speakingDuration": 20
}
```

### Video Files

```json
{
  "id": "q1",
  "type": "part2",
  "text": "Describe the scene in the video.",
  "media": "https://example.com/scene-video.mp4",
  "speakingDuration": 120
}
```

**Note**: Media is optional. Questions work fine without it!

## 🎓 Canvas LMS Integration

### Embedding in Canvas

**Step 1**: Edit your Canvas page

**Step 2**: Switch to HTML editor

**Step 3**: Add iframe code:

```html
<iframe 
  src="https://your-app.com/?bank=technology" 
  width="100%" 
  height="800" 
  style="border: none;"
  allow="microphone; camera; autoplay"
  title="IELTS Speaking Practice">
</iframe>
```

### Multiple Banks in Different Modules

**Module 1: Technology**
```html
<iframe src="https://your-app.com/?bank=technology" ...></iframe>
```

**Module 2: Education**
```html
<iframe src="https://your-app.com/?bank=education" ...></iframe>
```

**Module 3: Custom Topics**
```html
<iframe src="https://your-app.com/?bank=my-custom-topics" ...></iframe>
```

### Benefits

- ✅ Different practice sets per module
- ✅ Targeted practice for specific topics
- ✅ Easy to update content
- ✅ Consistent interface
- ✅ Automatic iframe resizing

## 💡 Examples

### Example 1: Simple Bank (Minimum)

```json
{
  "id": "simple",
  "name": "Simple Questions",
  "description": "Basic questions for beginners",
  "author": "Teacher Name",
  "version": "1.0",
  "questions": [
    {
      "id": "q1",
      "type": "part1",
      "text": "What is your name?",
      "speakingDuration": 20
    },
    {
      "id": "q2",
      "type": "part1",
      "text": "Where are you from?",
      "speakingDuration": 20
    }
  ]
}
```

### Example 2: Mixed Types

```json
{
  "id": "mixed",
  "name": "Mixed Practice",
  "description": "All three question types",
  "author": "IELTS Team",
  "version": "1.0",
  "questions": [
    {
      "id": "m1",
      "type": "part1",
      "text": "Do you work or study?",
      "speakingDuration": 20
    },
    {
      "id": "m2",
      "type": "part2",
      "text": "Describe your ideal job.",
      "speakingDuration": 120,
      "card": {
        "title": "Describe your ideal job.",
        "subtitle": "You should say:",
        "bullets": [
          "what the job is",
          "what you would do",
          "why you want this job",
          "explain how you would prepare for it"
        ]
      }
    },
    {
      "id": "m3",
      "type": "part3",
      "text": "How has work changed in recent years?",
      "speakingDuration": 60
    }
  ]
}
```

### Example 3: With Media

```json
{
  "id": "media",
  "name": "Media Practice",
  "description": "Questions with video and audio",
  "author": "Media Team",
  "version": "1.0",
  "questions": [
    {
      "id": "media-q1",
      "type": "part2",
      "text": "Describe what you see in this video.",
      "media": "https://www.youtube.com/watch?v=VIDEO_ID",
      "speakingDuration": 120,
      "card": {
        "title": "Describe what you see in this video.",
        "subtitle": "You should say:",
        "bullets": [
          "what the video shows",
          "what is happening",
          "what you notice",
          "explain your thoughts about it"
        ]
      }
    }
  ]
}
```

## 🔍 Troubleshooting

### Problem: Bank Not Loading

**Symptoms**: Default bank loads instead of requested bank

**Solutions**:
1. ✅ Check JSON syntax (use [JSONLint](https://jsonlint.com/))
2. ✅ Verify file is in `/public/question-banks/` directory
3. ✅ Check filename matches bank ID (e.g., `travel.json` for `?bank=travel`)
4. ✅ Ensure file extension is `.json` (not `.txt`)
5. ✅ Check browser console for error messages

### Problem: Questions Not Displaying

**Symptoms**: Bank loads but no questions appear

**Solutions**:
1. ✅ Verify `questions` array is not empty
2. ✅ Check all required fields are present
3. ✅ Ensure question types are lowercase (`part1`, not `Part1`)
4. ✅ Validate JSON structure

### Problem: Cue Card Not Showing

**Symptoms**: Part 2 question displays but no cue card

**Solutions**:
1. ✅ Verify question type is `part2` (lowercase)
2. ✅ Check `card` object exists
3. ✅ Ensure `card` has `title` and `bullets` fields
4. ✅ Verify `bullets` is an array with at least one item

### Problem: Media Not Playing

**Symptoms**: Video or audio doesn't load

**Solutions**:
1. ✅ Check media URL is valid
2. ✅ For YouTube: Use full URL format `https://www.youtube.com/watch?v=VIDEO_ID`
3. ✅ For audio/video files: Ensure CORS is enabled
4. ✅ Test media URL in browser directly

### Problem: Invalid JSON Error

**Symptoms**: Error message about invalid JSON

**Common Mistakes**:
```json
// ❌ Missing comma
{
  "id": "test"
  "name": "Test"
}

// ✅ Correct
{
  "id": "test",
  "name": "Test"
}

// ❌ Trailing comma
{
  "id": "test",
  "name": "Test",
}

// ✅ Correct
{
  "id": "test",
  "name": "Test"
}

// ❌ Single quotes
{
  'id': 'test'
}

// ✅ Correct (double quotes)
{
  "id": "test"
}
```

## 📊 Field Reference

### Bank Fields

| Field | Required | Type | Description | Example |
|-------|----------|------|-------------|---------|
| id | ✅ Yes | string | Unique identifier | `"technology"` |
| name | ✅ Yes | string | Display name | `"Technology & Innovation"` |
| description | ✅ Yes | string | Brief description | `"Questions about tech"` |
| author | ✅ Yes | string | Author name | `"IELTS Team"` |
| version | ✅ Yes | string | Version number | `"1.0"` |
| questions | ✅ Yes | array | Array of questions | `[...]` |

### Question Fields

| Field | Required | Type | Description | Example |
|-------|----------|------|-------------|---------|
| id | ✅ Yes | string | Unique question ID | `"tech-q1"` |
| type | ✅ Yes | string | `part1`, `part2`, or `part3` | `"part1"` |
| text | ✅ Yes | string | Question text | `"Do you like tech?"` |
| speakingDuration | ✅ Yes | number | Duration in seconds | `20` |
| media | ❌ No | string | YouTube/audio/video URL | `"https://..."` |
| card | ❌ No* | object | Cue card (Part 2 only) | `{...}` |

*Required for Part 2 questions

### Card Fields (Part 2 Only)

| Field | Required | Type | Description | Example |
|-------|----------|------|-------------|---------|
| title | ✅ Yes | string | Card title | `"Describe a person..."` |
| subtitle | ❌ No | string | Subtitle | `"You should say:"` |
| bullets | ✅ Yes | array | Bullet points (3-4 items) | `["who", "what", "why"]` |

## ⏱️ Duration Guidelines

| Question Type | Duration | Purpose |
|---------------|----------|---------|
| Part 1 | 20 seconds | Short, quick answers |
| Part 2 | 120 seconds (2 min) | Extended monologue |
| Part 3 | 60 seconds (1 min) | Discussion and analysis |

## ✅ Best Practices

### Do's ✅

- ✅ Use descriptive question IDs (e.g., `tech-q1`, `edu-part2-1`)
- ✅ Always include cue cards for Part 2 questions
- ✅ Mix question types for variety
- ✅ Test your bank before sharing with students
- ✅ Keep bank files under 100KB
- ✅ Use meaningful bank IDs (e.g., `technology`, not `bank1`)
- ✅ Validate JSON syntax before uploading
- ✅ Include 3-4 bullet points in cue cards

### Don'ts ❌

- ❌ Don't use uppercase in question types (`Part1` → `part1`)
- ❌ Don't forget cue cards for Part 2 questions
- ❌ Don't use single quotes in JSON
- ❌ Don't add trailing commas
- ❌ Don't use special characters in bank IDs
- ❌ Don't create banks with no questions
- ❌ Don't use very long question texts (keep under 200 chars)

## 📖 Additional Resources

### Documentation Files

- **`/public/question-banks/README.md`** - Detailed technical guide
- **`DYNAMIC_QUESTION_BANK_SYSTEM.md`** - System architecture
- **`INSTRUCTOR_QUICK_START.md`** - Quick start for instructors
- **`DYNAMIC_LOADER_SUMMARY.md`** - Implementation summary

### Example Banks

- **`technology.json`** - Technology and innovation
- **`education.json`** - Education and learning
- **`environment.json`** - Environmental issues

### Tools

- **JSON Validator**: [JSONLint](https://jsonlint.com/)
- **JSON Formatter**: [JSON Formatter](https://jsonformatter.org/)
- **JSON Editor**: [JSON Editor Online](https://jsoneditoronline.org/)

## 🎉 Summary

The dynamic question bank system allows you to:

- ✅ Add new banks without code changes
- ✅ Load banks via URL parameter
- ✅ Create custom content for your courses
- ✅ Share specific banks with students
- ✅ Update content without deployment
- ✅ Integrate seamlessly with Canvas LMS

**Get Started**: Create your first bank in 5 minutes!

---

**Need Help?** Check the detailed documentation in `/public/question-banks/README.md`
