# Speech Recognition Practice App Requirements Document

## 1. Application Overview
### 1.1 Application Name
Speech Recognition Practice App

### 1.2 Application Description
An interactive web application designed for speech recognition practice. Students read text questions, record their spoken responses with continuous speech recognition, and receive immediate feedback based on keyword matching. The application compares user transcripts against predefined keywords in the question bank and marks questions as correct when all required keywords are detected. Designed to be embedded within Canvas LMS as an iframe, with question banks hosted on GitHub and accessed via URL query parameters.

### 1.3 Core Features
- Text-based question display (no audio/video prompts)
- Continuous real-time audio recording with visual feedback
- Real-time speech-to-text transcription during recording
- Keyword matching algorithm for answer validation
- Automatic correctness marking based on keyword detection
- Visual feedback for correct/incorrect answers
- Manual 'Next Question' button for user-controlled progression
- In-browser audio and transcript storage
- Playback and review functionality
- Retry capability\n- GitHub-hosted question bank integration with keyword metadata
- Dynamic question loading via URL query parameters

## 2. Question Type Specifications
\n### 2.1 Unified Question Format
- All questions are text-based
- No audio or video prompts
- No timed constraints (user controls when to stop recording)
- User manually stops recording when finished speaking
- Immediate keyword matching upon recording completion
- Visual correctness indicator displayed after validation

## 3. Application Workflow

### 3.1 Loading Phase
- Display greeting message: 'Hi, just a moment while I prepare your question(s)'
- After questions load, display: 'Ready? Click start to begin'\n\n### 3.2 Question Delivery
- Display text question prominently
- Show 'Start Recording' button
- No prep time countdown (user starts when ready)
\n### 3.3 Recording Phase
- User clicks 'Start Recording' button
- Display audio level bar during recording
- Show real-time interim transcription as user speaks
- Display 'Stop Recording' button\n- User manually stops recording when finished answering
\n### 3.4 Continuous Speech Recognition System
\n#### 3.4.1 Interim Transcription
- Provide real-time transcription as the user speaks
- Update UI continuously (word-by-word or chunk-by-chunk)
- Display interim results in a dedicated transcription area
- Finalize and store completed utterances

#### 3.4.2 Continuous Listening Mode
- Speech recognizer remains active throughout recording session
- No auto-stop after a single utterance
- Seamless multi-utterance capture\n- User controls recording duration via 'Stop Recording' button
\n### 3.5 Keyword Matching and Validation
\n#### 3.5.1 Matching Algorithm
- Upon clicking 'Stop Recording', finalize transcript\n- Extract keywords from question bank for current question
- Compare finalized transcript against keyword list
- Matching rules:
  - Case-insensitive comparison
  - Ignore punctuation and special characters
  - Detect keyword variations (stemming/lemmatization optional)
  - Mark question as **correct** if ALL required keywords are present in transcript
  - Mark question as **incorrect** if ANY required keyword is missing
\n#### 3.5.2 Visual Feedback
- Display correctness indicator immediately after validation:\n  - **Correct**: Green checkmark icon with message 'Correct! All keywords detected.'
  - **Incorrect**: Red cross icon with message 'Incomplete. Missing keywords: [list]'
- Highlight detected keywords in transcript (green)\n- Highlight missing keywords in question text (red)
\n### 3.6 Navigation Controls
\n#### 3.6.1 'Next Question' Button
- Always visible after recording stops and validation completes
- On click:\n  - Store current question's audio, transcript, and correctness result in browser memory
  - Load next question\n  - Reset recording interface
  - Clear previous validation feedback
\n#### 3.6.2 'Retry' Button
- Visible after validation completes
- On click:
  - Erase current question's recording and transcript
  - Clear validation feedback
  - Return to question start state
  - Allow user to re-record answer

### 3.7 Completion and Review
- Display message: 'Well done! Review your responses below'
- For each question, provide:
  - Question text
  - Playable audio recording
  - Complete text transcript with highlighted keywords
  - Correctness indicator (correct/incorrect)
  - List of detected and missing keywords
- Download options:\n  - Individual audio files per question
  - 'Download All' button: downloads merged audio file containing all questions
- 'Retry All' button:
  - Erases all previous attempts
  - Returns to first question
\n## 4. Technical Requirements\n
### 4.1 Question Bank Management
- Question banks hosted on GitHub repository
- Each question bank stored as structured data file (JSON format)\n- **All question bank metadata and summaries stored within the question bank data structure**
- Question bank files contain:
  - **Metadata section** (title, author, version, description, creation date, last modified date)
  - **Questions array** with:
    - Question ID
    - Question text (`text` variable: string)
    - **Keywords array (`keywords` variable: array of strings)** - Required keywords for answer validation
    - Additional metadata per question (difficulty level, topic tags, etc.)

#### 4.1.1 Question Bank Schema
**Sample Data Structure:**
```json
{
  'metadata': {\n    'title': 'Speech Recognition Practice - Basic Level',
    'author': 'Language Learning Team',
    'version': '1.0',
    'description': 'Basic speech recognition questions with keyword validation',
    'createdDate': '2025-01-15',
    'lastModified': '2025-12-29'
  },
  'questions': [
    {
      'questionId': 1,
      'text': 'Describe your favorite hobby and explain why you enjoy it.',
      'keywords': ['hobby', 'enjoy', 'favorite'],
      'metadata': {\n        'difficulty': 'basic',
        'topic': 'hobbies'
      }
    },
    {
      'questionId': 2,
      'text': 'Tell me about your daily routine and what time you usually wake up.',
      'keywords': ['daily', 'routine', 'wake', 'time'],
      'metadata': {
        'difficulty': 'basic',
        'topic': 'daily-life'
      }
    }
  ]
}
```

### 4.2 URL Query Parameter Integration
- Application accepts query parameter to specify question bank
- Example Canvas custom URL format: `https://your-app-url.com?bank=basic_level`
- Query parameter mapping:
  - `bank` parameter value corresponds to specific GitHub-hosted question bank file
  - Application fetches corresponding question bank from GitHub on load
  - Application parses metadata section and questions array from the consolidated data structure
- Error handling:\n  - Invalid or missing query parameter: display default question bank or error message
  - Failed GitHub fetch: display user-friendly error message with retry option

### 4.3 Speech Recognition Implementation
- Use Web Speech API or equivalent browser-based speech recognition
- Enable continuous recognition mode (no auto-stop after utterance)
- Capture interim results for real-time transcription display
- Finalize transcript when user clicks 'Stop Recording'
\n### 4.4 Keyword Matching Implementation
- Normalize transcript and keywords (lowercase, remove punctuation)
- Use string matching or regular expressions for keyword detection
- Optional: implement stemming/lemmatization for keyword variations
- Generate list of detected and missing keywords
- Calculate correctness boolean (true if all keywords detected)\n
### 4.5 Audio Storage
- Use in-browser memory (Blob objects)\n- Organize recordings per question\n- Support audio playback directly from browser storage

### 4.6 Transcript Storage\n- Store transcripts in browser memory
- Associate each transcript with corresponding question, audio, and validation result
- Update transcripts in real-time during recording
- Finalize transcripts upon recording completion\n
### 4.7 Embedding
- Application must be embeddable as iframe within Canvas LMS
- Ensure responsive design for iframe display
- Support Canvas custom URL configuration with query parameters\n
## 5. User Experience Requirements

### 5.1 Visual Feedback
- Real-time waveform or audio level visualization during recording
- Clear 'Start Recording' and 'Stop Recording' button states
- Visible interim transcription updates
- Immediate correctness indicator after validation
- Color-coded keyword highlighting in transcript and question text
- Progress indicators for question completion

### 5.2 Validation Feedback Clarity
- Clear distinction between correct and incorrect answers
- Explicit list of missing keywords for incorrect answers
- Visual highlighting to guide user understanding
- Encouraging messages for correct answers
- Constructive feedback for incorrect answers
\n### 5.3 User Control
- User controls recording start and stop\n- User controls progression to next question via 'Next Question' button
- User can retry any question at any time
- No automatic transitions or time constraints
\n## 6. Design Style
- Color scheme: Clean educational palette with primary blue (#2D5F9F) for trust and focus, complemented by warm accent orange (#FF8C42) for interactive elements; green (#27AE60) for correct answers and detected keywords; red (#E74C3C) for incorrect answers and missing keywords\n- Visual details: Soft rounded corners (8px) for cards and buttons; subtle shadows for depth; clear progress indicators; waveform-style audio level bars; smooth transitions for validation feedback; highlighted keywords with background color overlays
- Layout: Card-based layout with centered question display; recording controls prominently positioned below question text; real-time transcription area in expandable section; validation feedback displayed immediately below transcription; 'Next Question' and 'Retry' buttons bottom-aligned; review section in scrollable grid format with correctness indicators
- Typography: Clear sans-serif font with distinct hierarchy - large question text, medium-sized instructions, small button labels, monospace font for transcription text
- Feedback styling: Large icons for correctness indicators (checkmark/cross); color-coded text for detected/missing keywords; clear visual separation between question, transcript, and feedback sections