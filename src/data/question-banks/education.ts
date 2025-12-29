import { QuestionBank, QuestionType } from '@/types';

export const educationQuestionBank: QuestionBank = {
  id: 'education',
  name: 'Education',
  description: 'Questions about learning, teaching, and educational systems',
  author: 'IELTS Practice Team',
  version: '1.0',
  questions: [
    {
      id: 'edu1',
      type: QuestionType.Part1,
      text: 'What subject did you enjoy most at school?',
      keywords: ['subject', 'enjoy', 'school', 'favorite', 'liked', 'best'],
    },
    {
      id: 'edu2',
      type: QuestionType.Part1,
      text: 'Do you think education is important? Why?',
      keywords: ['education', 'important', 'why', 'because', 'learning', 'knowledge'],
    },
    {
      id: 'edu3',
      type: QuestionType.Part2,
      text: 'Describe a teacher who has influenced you. You should say:\n- Who this teacher was\n- What subject they taught\n- What made them special\n- And explain how they influenced you',
      keywords: ['teacher', 'influenced', 'taught', 'special', 'learning', 'inspired'],
    },
    {
      id: 'edu4',
      type: QuestionType.Part3,
      text: 'How has education changed in your country over the past 20 years?',
      keywords: ['education', 'changed', 'country', 'years', 'different', 'improved', 'technology'],
    },
    {
      id: 'edu5',
      type: QuestionType.Part3,
      text: 'What role should technology play in education?',
      keywords: ['technology', 'education', 'role', 'learning', 'teaching', 'important', 'helpful'],
    },
  ],
};
