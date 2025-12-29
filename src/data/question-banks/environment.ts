import { QuestionBank, QuestionType } from '@/types';

export const environmentQuestionBank: QuestionBank = {
  id: 'environment',
  name: 'Environment',
  description: 'Questions about environmental issues, sustainability, and nature',
  author: 'IELTS Practice Team',
  version: '1.0',
  questions: [
    {
      id: 'env1',
      type: QuestionType.Part1,
      text: 'Do you think environmental protection is important?',
      keywords: ['environmental', 'protection', 'important', 'environment', 'nature', 'planet'],
    },
    {
      id: 'env2',
      type: QuestionType.Part1,
      text: 'What do you do to help protect the environment?',
      keywords: ['protect', 'environment', 'recycle', 'reduce', 'save', 'energy', 'waste'],
    },
    {
      id: 'env3',
      type: QuestionType.Part2,
      text: 'Describe an environmental problem in your area. You should say:\n- What the problem is\n- How long it has existed\n- What causes it\n- And explain what could be done to solve it',
      keywords: ['environmental', 'problem', 'area', 'causes', 'solve', 'pollution', 'waste'],
    },
    {
      id: 'env4',
      type: QuestionType.Part3,
      text: 'What are the main environmental challenges facing the world today?',
      keywords: ['environmental', 'challenges', 'world', 'climate', 'pollution', 'global', 'warming'],
    },
    {
      id: 'env5',
      type: QuestionType.Part3,
      text: 'Should governments or individuals take more responsibility for environmental protection?',
      keywords: ['governments', 'individuals', 'responsibility', 'environmental', 'protection', 'both'],
    },
  ],
};
