import { Question, QuestionType } from '@/types';

export const sampleQuestions: Question[] = [
  {
    id: 'q1',
    type: QuestionType.Part1,
    text: 'Do you work or are you a student?',
    keywords: ['work', 'student', 'study'],
    optionalKeywords: ['job', 'university', 'college', 'career', 'education'],
  },
  {
    id: 'q2',
    type: QuestionType.Part1,
    text: 'What do you like <strong>most</strong> about your job or studies?',
    keywords: ['like', 'job', 'studies'],
    optionalKeywords: ['enjoy', 'favorite', 'best', 'passionate', 'interesting'],
  },
  {
    id: 'q3',
    type: QuestionType.Part2,
    text: 'Describe a place you have visited that you particularly enjoyed. You should say:\n- Where it was\n- When you went there\n- What you did there\n- And explain why you enjoyed it',
    keywords: ['place', 'visited', 'enjoyed'],
    optionalKeywords: ['where', 'when', 'did', 'why', 'memorable', 'beautiful', 'experience'],
  },
  {
    id: 'q4',
    type: QuestionType.Part3,
    text: 'How has tourism changed in your country over the past few decades?',
    keywords: ['tourism', 'changed', 'country'],
    optionalKeywords: ['decades', 'years', 'different', 'past', 'development', 'growth'],
  },
  {
    id: 'q5',
    type: QuestionType.Part3,
    text: 'What are the advantages and disadvantages of international tourism?',
    keywords: ['advantages', 'disadvantages', 'tourism'],
    optionalKeywords: ['international', 'benefits', 'problems', 'economy', 'culture', 'environment'],
  },
];
