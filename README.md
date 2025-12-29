# Welcome to Your Miaoda Project
Miaoda Application Link URL
    URL:https://medo.dev/projects/app-8k50moupf6kg

# Speech Recognition Practice App

An interactive web application for practicing speech recognition with keyword matching. Users read text questions, speak their responses, and receive instant feedback based on keyword detection in their transcripts.

## ✨ Features

- **Text-Based Questions:** Clear, readable questions displayed on screen
- **Speech Recognition:** Real-time transcription using Web Speech API
- **Keyword Matching:** Automatic evaluation of responses based on required keywords
- **Instant Feedback:** Immediate correctness indicators after each response
- **Multiple Question Banks:** Switch topics via URL parameters
- **Manual Progression:** "Next Question" button for user-controlled pacing
- **Review & Analysis:** Detailed review showing matched and missed keywords
- **Audio Recording:** Record and playback your responses
- **Download Options:** Save individual or merged audio files

## 🎯 Question Banks

The app includes multiple question banks that can be selected via URL parameters:

- **Default:** Computers and technology basics
- **Technology:** Innovation and digital life
- **Education:** Learning and teaching systems
- **Environment:** Sustainability and nature

### Usage Examples

```
# Default questions
https://your-app-url.com/

# Technology questions
https://your-app-url.com/?bank=technology

# Education questions
https://your-app-url.com/?bank=education

# Environment questions
https://your-app-url.com/?bank=environment
```

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/speech-recognition-practice.git
cd speech-recognition-practice

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

## 📖 How It Works

### 1. Question Display
- Each question is displayed as text with a list of required keywords
- Keywords are shown as hints to guide your response

### 2. Recording Your Response
- Click "Start Recording" to begin
- Speak your answer naturally
- Your speech is transcribed in real-time
- Use "Pause" to take breaks
- Click "Next Question" when ready to move on

### 3. Keyword Matching
- The app compares your transcript against required keywords
- All keywords must be present (or their variations) for a correct answer
- Instant feedback shows if you included all keywords

### 4. Review Results
- See your overall score
- Review each question with:
  - ✅ Matched keywords (found in your response)
  - ❌ Missed keywords (not found in your response)
  - Full transcript of your response
  - Audio playback option

## 🌐 Browser Compatibility

| Browser | Audio Recording | Speech Recognition |
|---------|----------------|-------------------|
| Chrome  | ✅ Full Support | ✅ Full Support   |
| Edge    | ✅ Full Support | ✅ Full Support   |
| Safari  | ✅ Full Support | ✅ Full Support   |
| Firefox | ✅ Full Support | ⚠️ Limited        |

**Note:** HTTPS is required for microphone access.

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript
- **Build Tool:** Vite
- **UI Components:** shadcn/ui + Tailwind CSS
- **Audio:** Web Audio API (MediaRecorder)
- **Speech Recognition:** Web Speech API
- **State Management:** React Hooks

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── practice/          # Practice-specific components
│   │   └── ui/                # Reusable UI components
│   ├── data/
│   │   └── question-banks/    # Question bank files
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   │   └── keyword-matcher.ts # Keyword matching algorithm
│   ├── pages/                 # Page components
│   ├── types/                 # TypeScript types
│   └── utils/                 # Helper utilities
├── public/                    # Static assets
└── README.md                  # This file
```

## 🔧 Adding New Question Banks

### 1. Create Question File

Create `src/data/question-banks/your-topic.ts`:

```typescript
import { QuestionBank, QuestionType } from '@/types';

export const yourTopicQuestions: QuestionBank = {
  id: 'yourtopic',
  name: 'Your Topic Name',
  description: 'Description here',
  questions: [
    {
      id: 'topic1',
      type: QuestionType.Part1,
      text: 'Your question here?',
      keywords: ['keyword1', 'keyword2', 'keyword3'],
      speakingDuration: 20,
    },
    // Add more questions...
  ],
};
```

### 2. Register in Loader

Edit `src/utils/question-bank-loader.ts`:

```typescript
import { yourTopicQuestions } from '@/data/question-banks/your-topic';

export const questionBanks: Record<string, QuestionBank> = {
  yourtopic: yourTopicQuestions,
};
```

### 3. Use in URL

```
https://your-app-url.com/?bank=yourtopic
```

## 🎓 Keyword Matching Algorithm

The app uses intelligent keyword matching with:

- **Case-insensitive matching:** "Computer" matches "computer"
- **Basic stemming:** "studying" matches "study"
- **Multi-word support:** Phrases like "environmental protection" are matched
- **Flexible scoring:** Partial credit for some keywords matched

## 🐛 Troubleshooting

### Transcripts Not Appearing

1. Use Chrome or Edge browser
2. Grant microphone permissions
3. Ensure internet connection (speech recognition requires it)
4. Check browser console for errors

### Microphone Not Working

1. Verify site is using HTTPS
2. Check browser permissions
3. Test in Chrome or Edge
4. Reload page and grant permissions again

### Keywords Not Matching

1. Speak clearly and naturally
2. Include the exact keywords or their variations
3. Check the keyword list before answering
4. Review your transcript to see what was captured

## 📝 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

### Code Quality

```bash
# Lint and fix
npm run lint

# Type check
npx tsc --noEmit
```

## 🔒 Privacy & Security

- **No Data Collection:** All recordings stored in browser memory only
- **No Server Upload:** Audio never leaves the user's device
- **Session-Based:** All data cleared on page refresh
- **Microphone Access:** Requested only when needed
- **HTTPS Required:** Ensures secure connection

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Vite](https://vitejs.dev/)

---

**Note:** This app requires HTTPS for microphone access. Use Chrome or Edge for best experience with speech recognition.
