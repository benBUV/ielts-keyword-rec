# Question Bank System

## Overview
The IELTS Speaking Practice App supports multiple question banks that can be selected via URL query parameters. This makes it easy to embed different question sets in Canvas LMS or other learning management systems.

## Available Question Banks

### 1. Default (General Topics)
**ID:** `default`  
**Topics:** Work, studies, travel, tourism  
**Questions:** 5 questions (2× Part 1, 1× Part 2, 2× Part 3)

### 2. Technology
**ID:** `technology`  
**Topics:** Technology, innovation, digital life  
**Questions:** 5 questions (2× Part 1, 1× Part 2, 2× Part 3)

### 3. Education
**ID:** `education`  
**Topics:** Learning, teaching, educational systems  
**Questions:** 5 questions (2× Part 1, 1× Part 2, 2× Part 3)

### 4. Environment
**ID:** `environment`  
**Topics:** Environmental issues, sustainability, nature  
**Questions:** 5 questions (2× Part 1, 1× Part 2, 2× Part 3)

## Usage in Canvas LMS

### Method 1: Using `bank` parameter
```
https://your-app-url.com/?bank=technology
https://your-app-url.com/?bank=education
https://your-app-url.com/?bank=environment
```

### Method 2: Using `questionBank` parameter
```
https://your-app-url.com/?questionBank=technology
https://your-app-url.com/?questionBank=education
https://your-app-url.com/?questionBank=environment
```

### Default Behavior
If no query parameter is provided, the app loads the default question bank:
```
https://your-app-url.com/
```

## Canvas LMS Integration

### Step 1: Add External Tool
1. Go to your Canvas course
2. Navigate to Settings → Apps → View App Configurations
3. Click "+ App" to add a new external tool

### Step 2: Configure the Tool
- **Name:** IELTS Speaking Practice - Technology
- **Consumer Key:** (if required)
- **Shared Secret:** (if required)
- **Launch URL:** `https://your-app-url.com/?bank=technology`
- **Domain:** your-app-url.com
- **Privacy:** Public (or as required)

### Step 3: Create Multiple Assignments
You can create different assignments for each question bank:

**Assignment 1: Technology Topics**
```
URL: https://your-app-url.com/?bank=technology
```

**Assignment 2: Education Topics**
```
URL: https://your-app-url.com/?bank=education
```

**Assignment 3: Environment Topics**
```
URL: https://your-app-url.com/?bank=environment
```

## Adding New Question Banks

### Step 1: Create Question File
Create a new file in `src/data/question-banks/your-topic.ts`:

```typescript
import { Question, QuestionType } from '@/types';

export const yourTopicQuestions: Question[] = [
  {
    id: 'topic1',
    type: QuestionType.Part1,
    text: 'Your question here?',
    prepTime: 5,
    speakingDuration: 20,
  },
  // Add more questions...
];
```

### Step 2: Register in Loader
Edit `src/utils/question-bank-loader.ts`:

```typescript
import { yourTopicQuestions } from '@/data/question-banks/your-topic';

export const questionBanks: Record<string, QuestionBank> = {
  // ... existing banks
  yourtopic: {
    id: 'yourtopic',
    name: 'Your Topic Name',
    description: 'Description of your question bank',
    questions: yourTopicQuestions,
  },
};
```

### Step 3: Use in URL
```
https://your-app-url.com/?bank=yourtopic
```

## Question Structure

Each question must follow this structure:

```typescript
{
  id: string;              // Unique identifier
  type: QuestionType;      // Part1, Part2, or Part3
  text: string;            // Question text
  prepTime: number;        // Preparation time in seconds (usually 5)
  speakingDuration: number; // Speaking time in seconds
  audioUrl?: string;       // Optional audio URL for audio questions
}
```

### Question Type Durations
- **Part 1:** 20 seconds speaking time
- **Part 2:** 120 seconds (2 minutes) speaking time
- **Part 3:** 60 seconds (1 minute) speaking time

## Error Handling

### Invalid Question Bank
If an invalid question bank ID is provided:
```
https://your-app-url.com/?bank=invalid
```

The app will:
1. Display an error toast notification
2. Load the default question bank instead
3. Log a warning to the console

### Console Logging
The app logs question bank loading information to the browser console:
```
Loading question bank: technology
Loaded question bank: Technology (5 questions)
```

## Testing Different Banks

### Local Testing
1. Start the development server
2. Open different URLs in your browser:
   - `http://localhost:5173/?bank=technology`
   - `http://localhost:5173/?bank=education`
   - `http://localhost:5173/?bank=environment`

### Verify Loading
1. Open browser DevTools (F12)
2. Check the Console tab for loading messages
3. Verify the question bank name appears on the Ready screen

## Best Practices

### Question Bank Design
1. **Consistent Structure:** Keep 5 questions per bank (2 Part 1, 1 Part 2, 2 Part 3)
2. **Clear Topics:** Focus each bank on a specific theme
3. **Appropriate Difficulty:** Match question complexity to student level
4. **Varied Questions:** Include different question styles within each part

### Canvas Integration
1. **Descriptive Names:** Use clear names for each external tool
2. **Separate Assignments:** Create individual assignments for each topic
3. **Clear Instructions:** Tell students which topic they're practicing
4. **Consistent URLs:** Use the same parameter format across all assignments

### URL Parameters
1. **Use lowercase:** Question bank IDs are case-insensitive but lowercase is recommended
2. **No spaces:** Use hyphens for multi-word IDs (e.g., `business-english`)
3. **Descriptive IDs:** Use clear, memorable identifiers

## Troubleshooting

### Question Bank Not Loading
**Problem:** App shows "Question Bank Not Found" error

**Solutions:**
1. Check the URL parameter spelling
2. Verify the question bank ID exists in `question-bank-loader.ts`
3. Check browser console for error messages
4. Ensure the question bank file is properly imported

### Wrong Questions Appearing
**Problem:** Different questions than expected are showing

**Solutions:**
1. Clear browser cache and reload
2. Verify the URL parameter is correct
3. Check if the question bank file has the right questions
4. Look at console logs to see which bank was loaded

### Canvas Iframe Issues
**Problem:** App not loading in Canvas iframe

**Solutions:**
1. Verify the Launch URL includes the query parameter
2. Check that the domain is correctly configured
3. Ensure the app allows iframe embedding
4. Test the URL directly in a browser first

## Future Enhancements

Potential improvements to the question bank system:

1. **Dynamic Loading:** Load question banks from external JSON files
2. **Admin Interface:** Web UI for creating/editing question banks
3. **Random Selection:** Randomly select questions from a larger pool
4. **Difficulty Levels:** Add easy/medium/hard variants
5. **Custom Banks:** Allow instructors to create custom question sets
6. **Question Metadata:** Add tags, categories, and difficulty ratings
7. **Analytics:** Track which questions students find most challenging

## Support

For questions or issues with the question bank system:
1. Check the console logs for detailed error messages
2. Verify your URL parameters are correct
3. Review the question bank file structure
4. Test with the default bank first to isolate issues
