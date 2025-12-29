import { QuestionBank, QuestionType } from '@/types';

export const technologyQuestionBank: QuestionBank = {
  id: 'technology',
  name: 'Technology',
  description: 'Questions focused on technology, innovation, and digital life',
  author: 'IELTS Practice Team',
  version: '1.0',
  questions: [
    {
      id: 'tech1',
      type: QuestionType.Part1,
      text: 'How often do you use technology in your daily life?',
      keywords: ['technology', 'daily', 'often', 'use', 'everyday', 'frequently'],
    },
    {
      id: 'tech2',
      type: QuestionType.Part1,
      text: 'What is your favorite piece of technology?',
      keywords: ['favorite', 'technology', 'device', 'gadget', 'phone', 'computer', 'laptop'],
    },
    {
      id: 'tech3',
      type: QuestionType.Part2,
      text: 'Describe a piece of technology you find useful. You should say:\n- What it is\n- When you got it\n- How you use it\n- And explain why you find it useful',
      keywords: ['technology', 'useful', 'use', 'device', 'helpful', 'important'],
    },
    {
      id: 'tech4',
      type: QuestionType.Part3,
      text: 'How has technology changed the way people communicate?',
      keywords: ['technology', 'changed', 'communicate', 'communication', 'people', 'social', 'internet'],
    },
    {
      id: 'tech5',
      type: QuestionType.Part3,
      text: 'What are the potential dangers of relying too much on technology?',
      keywords: ['dangers', 'relying', 'technology', 'problems', 'issues', 'negative', 'addiction'],
    },
  ],
};
