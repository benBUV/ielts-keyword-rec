# Canvas LMS Integration Guide

## Quick Start for Instructors

This guide will help you integrate the IELTS Speaking Practice App into your Canvas course with different question banks for different assignments.

## Step 1: Deploy the App

First, deploy the app to GitHub Pages or another hosting service. See [DEPLOYMENT.md](./DEPLOYMENT.md) for instructions.

Once deployed, you'll have a URL like:
```
https://YOUR_USERNAME.github.io/ielts-speaking-practice/
```

## Step 2: Test the URLs

Before adding to Canvas, test each URL in your browser:

### Default Questions (General Topics)
```
https://YOUR_USERNAME.github.io/ielts-speaking-practice/
```

### Technology Questions
```
https://YOUR_USERNAME.github.io/ielts-speaking-practice/?bank=technology
```

### Education Questions
```
https://YOUR_USERNAME.github.io/ielts-speaking-practice/?bank=education
```

### Environment Questions
```
https://YOUR_USERNAME.github.io/ielts-speaking-practice/?bank=environment
```

**Important:** Make sure to grant microphone permissions when prompted!

## Step 3: Add External Tools to Canvas

### Method A: Course-Level External Tool

1. **Navigate to Course Settings:**
   - Go to your Canvas course
   - Click "Settings" in the left sidebar
   - Click the "Apps" tab
   - Click "View App Configurations"

2. **Add New App:**
   - Click the "+ App" button
   - Select "Configuration Type: By URL" or "Manual Entry"

3. **Configure the Tool:**
   ```
   Name: IELTS Speaking - Technology
   Consumer Key: (leave blank or use any value)
   Shared Secret: (leave blank or use any value)
   Launch URL: https://YOUR_USERNAME.github.io/ielts-speaking-practice/?bank=technology
   Domain: YOUR_USERNAME.github.io
   Privacy: Public
   ```

4. **Repeat for Each Question Bank:**
   - Create separate tools for each topic:
     - IELTS Speaking - Technology
     - IELTS Speaking - Education
     - IELTS Speaking - Environment
     - IELTS Speaking - General

### Method B: Assignment-Level External Tool

1. **Create a New Assignment:**
   - Go to "Assignments" in your course
   - Click "+ Assignment"
   - Give it a name: "IELTS Speaking Practice - Technology"

2. **Configure Submission Type:**
   - Submission Type: External Tool
   - Click "Find" or "Enter or find an External Tool URL"
   - Paste the URL: `https://YOUR_USERNAME.github.io/ielts-speaking-practice/?bank=technology`

3. **Set Assignment Details:**
   - Points: (as desired)
   - Due Date: (as desired)
   - Instructions: Add instructions for students

4. **Save the Assignment**

## Step 4: Create Multiple Assignments

Create separate assignments for each topic:

### Assignment 1: Technology Topics
```
Name: IELTS Speaking Practice - Technology
URL: https://YOUR_USERNAME.github.io/ielts-speaking-practice/?bank=technology
Instructions: Practice speaking about technology and innovation topics.
```

### Assignment 2: Education Topics
```
Name: IELTS Speaking Practice - Education
URL: https://YOUR_USERNAME.github.io/ielts-speaking-practice/?bank=education
Instructions: Practice speaking about learning and educational systems.
```

### Assignment 3: Environment Topics
```
Name: IELTS Speaking Practice - Environment
URL: https://YOUR_USERNAME.github.io/ielts-speaking-practice/?bank=environment
Instructions: Practice speaking about environmental issues and sustainability.
```

### Assignment 4: General Topics
```
Name: IELTS Speaking Practice - General
URL: https://YOUR_USERNAME.github.io/ielts-speaking-practice/
Instructions: Practice speaking about general topics including work and travel.
```

## Step 5: Student Instructions

Provide these instructions to your students:

### How to Use the IELTS Speaking Practice App

1. **Open the Assignment:**
   - Click on the assignment in Canvas
   - The app will open in a new window or iframe

2. **Grant Microphone Permission:**
   - When prompted, click "Allow" to grant microphone access
   - This is required for recording your responses

3. **Start Practicing:**
   - Click "Start Question 1" to begin
   - Read the question during the 5-second preparation time
   - Speak your answer when recording starts
   - Watch the timer and audio level indicator

4. **Navigate Questions:**
   - Click "Next Question" to move to the next question
   - Or click "Stop Recording" if you want to retry

5. **Review Your Responses:**
   - After completing all questions, review your recordings
   - Listen to your audio
   - Read the transcript (if available)
   - Download individual recordings or all recordings

6. **Retry if Needed:**
   - Click "Retry" to start over with the same questions
   - Practice as many times as you want

### Browser Requirements

**Recommended Browsers:**
- Google Chrome (best support)
- Microsoft Edge (best support)
- Safari (good support)

**Not Recommended:**
- Firefox (limited speech recognition)

**Important:**
- Use headphones to avoid echo
- Speak clearly and at a normal pace
- Ensure you have a stable internet connection

## Step 6: Grading and Assessment

### Option 1: Self-Assessment
Students use the app for practice only. No submission required.

### Option 2: Manual Submission
Students download their recordings and submit them separately:
1. Complete the practice session
2. Download recordings using "Download All" button
3. Submit the audio file through Canvas file upload

### Option 3: Reflection Assignment
Students complete the practice and then submit a written reflection:
- What did you learn?
- Which questions were most challenging?
- What will you work on next?

## Troubleshooting

### Students Can't Access the App

**Problem:** "This page cannot be displayed" or similar error

**Solutions:**
1. Verify the URL is correct
2. Check that the app is deployed and accessible
3. Test the URL in a regular browser first
4. Ensure Canvas allows external tools

### Microphone Not Working

**Problem:** Students can't record audio

**Solutions:**
1. Ensure students are using HTTPS (required for microphone)
2. Check browser permissions
3. Try a different browser (Chrome or Edge recommended)
4. Reload the page and grant permissions again

### Wrong Questions Appearing

**Problem:** Students see different questions than expected

**Solutions:**
1. Verify the URL includes the correct `?bank=` parameter
2. Check that the question bank name is spelled correctly
3. Test the URL directly before adding to Canvas

### Transcripts Not Appearing

**Problem:** Students don't see transcripts

**Solutions:**
1. Use Chrome or Edge browser
2. Ensure internet connection is stable
3. Grant microphone permissions
4. Speak clearly and loudly enough
5. See [TRANSCRIPT_DEBUGGING.md](./TRANSCRIPT_DEBUGGING.md)

## Advanced Configuration

### Custom Question Banks

You can create custom question banks for your specific course needs:

1. Follow the instructions in [QUESTION_BANKS.md](./QUESTION_BANKS.md)
2. Add your custom questions
3. Deploy the updated app
4. Use the new question bank in Canvas:
   ```
   https://YOUR_USERNAME.github.io/ielts-speaking-practice/?bank=your-custom-bank
   ```

### Multiple Courses

You can use the same deployed app across multiple Canvas courses:

1. Deploy once to GitHub Pages
2. Add the external tool to each course
3. Use different question banks for different courses or levels

### Tracking Student Usage

Since the app doesn't collect data, you can:

1. **Assignment Completion:** Mark assignments as complete when students report finishing
2. **Reflection Submissions:** Require written reflections about their practice
3. **Audio Submissions:** Have students submit their downloaded recordings
4. **Self-Reporting:** Use Canvas quizzes for students to report their practice time

## Best Practices

### For Instructors

1. **Test First:** Always test the app yourself before assigning to students
2. **Clear Instructions:** Provide detailed instructions for first-time users
3. **Browser Guidance:** Recommend Chrome or Edge for best experience
4. **Practice Assignments:** Make early assignments low-stakes for students to learn the tool
5. **Technical Support:** Be prepared to help with microphone permissions and browser issues

### For Students

1. **Quiet Environment:** Find a quiet place to practice
2. **Good Microphone:** Use a quality microphone or headset
3. **Regular Practice:** Practice regularly rather than cramming
4. **Review Recordings:** Listen to your recordings to identify areas for improvement
5. **Multiple Attempts:** Don't be afraid to retry questions

## Example Assignment Instructions

Here's a template for assignment instructions:

```markdown
# IELTS Speaking Practice - Technology Topics

## Objective
Practice your IELTS speaking skills by responding to questions about technology and innovation.

## Instructions

1. Click the link below to open the practice app
2. Grant microphone permission when prompted
3. Complete all 5 questions:
   - 2 Part 1 questions (20 seconds each)
   - 1 Part 2 question (2 minutes)
   - 2 Part 3 questions (1 minute each)
4. Review your recordings and transcripts
5. (Optional) Download your recordings for personal review

## Technical Requirements

- **Browser:** Chrome or Edge (recommended)
- **Microphone:** Required
- **Internet:** Stable connection needed
- **Time:** Approximately 10-15 minutes

## Tips for Success

- Speak clearly and at a natural pace
- Use the preparation time to organize your thoughts
- Don't worry about perfection - this is practice!
- Try the assignment multiple times to improve

## Grading

This is a practice assignment. You will receive full credit for completing all questions.

## Need Help?

If you experience technical issues:
1. Try a different browser (Chrome or Edge)
2. Check your microphone permissions
3. Reload the page
4. Contact your instructor

## Reflection (Optional)

After completing the practice, consider:
- Which questions were most challenging?
- What speaking skills do you want to improve?
- How will you prepare for the actual IELTS test?
```

## Support Resources

- [Main README](./README.md) - Overview and features
- [Question Banks Guide](./QUESTION_BANKS.md) - All available question banks
- [Deployment Guide](./DEPLOYMENT.md) - How to deploy the app
- [Transcript Debugging](./TRANSCRIPT_DEBUGGING.md) - Troubleshooting transcripts

## Contact

For technical issues or questions about the app, please refer to the documentation or open an issue on GitHub.

---

**Remember:** The app is designed for practice only. All recordings are stored locally in the student's browser and are not submitted to Canvas automatically.
