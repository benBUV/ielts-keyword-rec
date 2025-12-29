# IELTS Speaking Practice App

An interactive web application designed for students to independently practice IELTS Speaking test (Parts 1, 2, and 3). Students receive text or audio prompts, record their responses, and review both audio playback and transcripts.

## ✨ Features

- **Three IELTS Question Types:** Part 1 (20s), Part 2 (2min), Part 3 (1min)
- **Audio Recording:** Real-time recording with visual feedback
- **Speech Recognition:** Live transcription during recording (Chrome/Edge)
- **Multiple Question Banks:** Switch topics via URL parameters
- **Auto-Timing:** Automatic transitions based on question type
- **Speech Detection:** Intelligent prompts for silence
- **Review & Download:** Playback recordings and download audio files
- **Canvas LMS Ready:** Designed for iframe embedding

## 🎯 Question Banks

The app includes multiple question banks that can be selected via URL parameters:

- **Default:** General topics (work, travel, tourism)
- **Technology:** Innovation, digital life
- **Education:** Learning, teaching systems
- **Environment:** Sustainability, nature

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

See [QUESTION_BANKS.md](./QUESTION_BANKS.md) for detailed documentation.

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ielts-speaking-practice.git
cd ielts-speaking-practice

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

### Testing Question Banks

```bash
# Test different question banks locally
http://localhost:5173/?bank=technology
http://localhost:5173/?bank=education
http://localhost:5173/?bank=environment
```

## 📦 Deployment

### GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
{
  "homepage": "https://YOUR_USERNAME.github.io/ielts-speaking-practice",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}

# Deploy
npm run deploy
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🎓 Canvas LMS Integration

### Adding to Canvas

1. Go to Course Settings → Apps → View App Configurations
2. Click "+ App" to add external tool
3. Configure:
   - **Name:** IELTS Speaking - Technology
   - **Launch URL:** `https://your-app-url.com/?bank=technology`
   - **Privacy:** Public

### Multiple Assignments

Create separate assignments for each topic:

```
Assignment 1: https://your-app-url.com/?bank=technology
Assignment 2: https://your-app-url.com/?bank=education
Assignment 3: https://your-app-url.com/?bank=environment
```

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
│   ├── pages/                 # Page components
│   ├── types/                 # TypeScript types
│   └── utils/                 # Helper utilities
├── public/                    # Static assets
├── QUESTION_BANKS.md          # Question bank documentation
├── DEPLOYMENT.md              # Deployment guide
└── TRANSCRIPT_DEBUGGING.md    # Transcript troubleshooting
```

## 🔧 Adding New Question Banks

### 1. Create Question File

Create `src/data/question-banks/your-topic.ts`:

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

### 2. Register in Loader

Edit `src/utils/question-bank-loader.ts`:

```typescript
import { yourTopicQuestions } from '@/data/question-banks/your-topic';

export const questionBanks: Record<string, QuestionBank> = {
  yourtopic: {
    id: 'yourtopic',
    name: 'Your Topic Name',
    description: 'Description here',
    questions: yourTopicQuestions,
  },
};
```

### 3. Use in URL

```
https://your-app-url.com/?bank=yourtopic
```

## 🐛 Troubleshooting

### Transcripts Not Appearing

1. Use Chrome or Edge browser
2. Grant microphone permissions
3. Ensure internet connection (speech recognition requires it)
4. Check browser console for errors
5. See [TRANSCRIPT_DEBUGGING.md](./TRANSCRIPT_DEBUGGING.md)

### Microphone Not Working

1. Verify site is using HTTPS
2. Check browser permissions
3. Test in Chrome or Edge
4. Reload page and grant permissions again

### Question Bank Not Loading

1. Check URL parameter spelling
2. Verify question bank exists in loader
3. Check browser console for errors
4. Test with default bank first

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

## 📚 Documentation

- [Question Banks Guide](./QUESTION_BANKS.md) - Complete question bank documentation
- [Deployment Guide](./DEPLOYMENT.md) - Deployment instructions for various platforms
- [Transcript Debugging](./TRANSCRIPT_DEBUGGING.md) - Troubleshooting transcript issues
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Technical implementation details

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Vite](https://vitejs.dev/)

## 📞 Support

For issues or questions:

1. Check the documentation files
2. Review browser console logs
3. Test with default question bank
4. Open an issue on GitHub

---

**Note:** This app requires HTTPS for microphone access. Use Chrome or Edge for best experience with speech recognition.
