# Instructor Quick Start Guide

## Adding a Custom Question Bank in 3 Easy Steps

### Step 1: Create Your JSON File

Create a file named `my-bank.json` in the `/public/question-banks/` directory:

```json
{
  "id": "my-bank",
  "name": "My Custom Questions",
  "description": "Custom questions for my class",
  "author": "Your Name",
  "version": "1.0",
  "questions": [
    {
      "id": "q1",
      "type": "part1",
      "text": "Your question here?",
      "speakingDuration": 20
    }
  ]
}
```

### Step 2: Upload the File

Upload `my-bank.json` to the `/public/question-banks/` directory on your server.

### Step 3: Use It!

Access your bank via URL:
```
https://your-app.com/?bank=my-bank
```

Or embed in Canvas:
```html
<iframe src="https://your-app.com/?bank=my-bank" width="100%" height="800"></iframe>
```

## Question Types

### Part 1 (20 seconds)
Short, simple questions:
```json
{
  "id": "q1",
  "type": "part1",
  "text": "What is your favorite hobby?",
  "speakingDuration": 20
}
```

### Part 2 (120 seconds / 2 minutes)
Long monologue with cue card:
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

### Part 3 (60 seconds / 1 minute)
Discussion questions:
```json
{
  "id": "q3",
  "type": "part3",
  "text": "How has technology changed education?",
  "speakingDuration": 60
}
```

## Adding Media (Optional)

### YouTube Video
```json
{
  "id": "q1",
  "type": "part2",
  "text": "Describe what you see in the video.",
  "media": "https://www.youtube.com/watch?v=VIDEO_ID",
  "speakingDuration": 120
}
```

### Audio File
```json
{
  "id": "q1",
  "type": "part1",
  "text": "Listen and respond to the question.",
  "media": "https://example.com/audio.mp3",
  "speakingDuration": 20
}
```

## Canvas LMS Integration

### Embed in Canvas Page

1. Edit your Canvas page
2. Switch to HTML editor
3. Add iframe code:

```html
<iframe 
  src="https://your-app.com/?bank=my-bank" 
  width="100%" 
  height="800" 
  style="border: none;"
  allow="microphone; camera; autoplay"
  title="IELTS Speaking Practice">
</iframe>
```

### Multiple Banks in Different Pages

**Page 1: Technology Practice**
```html
<iframe src="https://your-app.com/?bank=technology" ...></iframe>
```

**Page 2: Education Practice**
```html
<iframe src="https://your-app.com/?bank=education" ...></iframe>
```

**Page 3: Custom Practice**
```html
<iframe src="https://your-app.com/?bank=my-custom-bank" ...></iframe>
```

## Available Banks

### Built-in Banks
- **default** - General topics (built-in, always available)
- **technology** - Technology and innovation
- **education** - Education and learning
- **environment** - Environmental issues

### Usage
```
?bank=default
?bank=technology
?bank=education
?bank=environment
```

## Tips

### Best Practices
- ✅ Use descriptive question IDs (e.g., `tech-q1`, `edu-part2-1`)
- ✅ Always include cue cards for Part 2 questions
- ✅ Mix question types for variety
- ✅ Test your bank before sharing with students
- ✅ Keep bank files under 100KB for fast loading

### Common Mistakes
- ❌ Forgetting to add cue card for Part 2 questions
- ❌ Using wrong question type (`Part1` instead of `part1`)
- ❌ Missing required fields (id, name, questions)
- ❌ Invalid JSON syntax (missing commas, quotes)

## Troubleshooting

### Bank Not Loading
1. Check JSON syntax (use a JSON validator)
2. Verify file is in `/public/question-banks/` directory
3. Check browser console for error messages
4. Ensure bank ID in URL matches filename (without .json)

### Questions Not Displaying
1. Verify `questions` array is not empty
2. Check that all required fields are present
3. Ensure question types are lowercase (`part1`, not `Part1`)

### Cue Card Not Showing
1. Verify question type is `part2`
2. Check that `card` object has all required fields
3. Ensure `bullets` array has at least one item

## Support

For detailed documentation, see:
- `/public/question-banks/README.md` - Complete guide
- `DYNAMIC_QUESTION_BANK_SYSTEM.md` - Technical documentation

## Example: Complete Question Bank

```json
{
  "id": "sample-bank",
  "name": "Sample Question Bank",
  "description": "A sample bank with all question types",
  "author": "IELTS Practice Team",
  "version": "1.0",
  "questions": [
    {
      "id": "sample-q1",
      "type": "part1",
      "text": "What do you do in your free time?",
      "speakingDuration": 20
    },
    {
      "id": "sample-q2",
      "type": "part2",
      "text": "Describe a hobby you enjoy.",
      "speakingDuration": 120,
      "card": {
        "title": "Describe a hobby you enjoy.",
        "subtitle": "You should say:",
        "bullets": [
          "what the hobby is",
          "when you started it",
          "how often you do it",
          "explain why you enjoy it"
        ]
      }
    },
    {
      "id": "sample-q3",
      "type": "part3",
      "text": "How have hobbies changed over the years?",
      "speakingDuration": 60
    },
    {
      "id": "sample-q4",
      "type": "part3",
      "text": "Do you think hobbies are important for mental health?",
      "speakingDuration": 60
    }
  ]
}
```

Save this as `sample-bank.json` and access via `?bank=sample-bank`.

## Quick Reference

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| id | ✅ Yes | string | Unique bank identifier |
| name | ✅ Yes | string | Display name |
| description | ✅ Yes | string | Brief description |
| author | ✅ Yes | string | Author name |
| version | ✅ Yes | string | Version number |
| questions | ✅ Yes | array | Array of questions |

| Question Field | Required | Type | Description |
|----------------|----------|------|-------------|
| id | ✅ Yes | string | Unique question ID |
| type | ✅ Yes | string | `part1`, `part2`, or `part3` |
| text | ✅ Yes | string | Question text |
| speakingDuration | ✅ Yes | number | Duration in seconds |
| media | ❌ No | string | YouTube URL or audio/video file |
| card | ❌ No (Part 2 only) | object | Cue card with title, subtitle, bullets |

## Duration Guidelines

- **Part 1**: 20 seconds
- **Part 2**: 120 seconds (2 minutes)
- **Part 3**: 60 seconds (1 minute)

---

**Need Help?** Check the full documentation in `/public/question-banks/README.md`
