import { QuestionBank, QuestionType } from '@/types';

export const defaultQuestionBank: QuestionBank = {
  id: 'wk1',
  name: 'Computers',
  description: 'Part 1 questions about computers',
  author: 'IELTS Practice Team',
  version: '1.0',
  questions: [
    {
      id: 'q1',
      type: QuestionType.Part1,
      text: 'Do you often use a computer?',
      keywords: ['computer', 'use', 'often'],
      optionalKeywords: ['daily', 'work', 'study', 'essential', 'regularly'],
    },
    {
      id: 'q2',
      type: QuestionType.Part1,
      text: 'Do lots of students in your country use a computer?',
      keywords: ['students', 'country', 'computer'],
      optionalKeywords: ['many', 'most', 'majority', 'common', 'widespread'],
    },
    {
      id: 'q3',
      type: QuestionType.Part1,
      text: 'What do you use a computer for?',
      keywords: ['computer', 'use'],
      optionalKeywords: ['work', 'study', 'entertainment', 'internet', 'email', 'research', 'communication'],
    },
    {
      id: 'q4',
      type: QuestionType.Part1,
      text: 'Do you use a computer for anything else?',
      keywords: ['computer', 'use'],
      optionalKeywords: ['also', 'other', 'additionally', 'besides', 'furthermore'],
    },
  ],
};
