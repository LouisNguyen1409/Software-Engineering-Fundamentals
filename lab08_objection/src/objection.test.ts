import { getObjections, Objection, ExaminationType } from './objection';

describe('argumentative cases', () => {
  test.each([
    {
      question: 'You are totally lying!',
      testimony: 'No you!',
      type: ExaminationType.CROSS,
      objections: new Set([Objection.ARGUMENTATIVE]),
    },
    {
      question: 'This is direct, yes!',
      testimony: 'Yes, so not argumentative!',
      type: ExaminationType.DIRECT,
      objections: new Set([]),
    },
    {
      question: 'Who are you?',
      testimony: 'I am you!',
      type: ExaminationType.CROSS,
      objections: new Set([]),
    },
    {
      question: 'Who are you????',
      testimony: 'I am you!',
      type: ExaminationType.DIRECT,
      objections: new Set([Objection.COMPOUND]),
    },
    {
      question: 'Who are you?',
      testimony: 'I am you!',
      type: ExaminationType.DIRECT,
      objections: new Set([]),
    },
    {
      question: 'Who are you?',
      testimony: 'I heard from you',
      type: ExaminationType.DIRECT,
      objections: new Set([Objection.HEARSAY]),
    },
    {
      question: 'You are totally lying!',
      testimony: 'You told me',
      type: ExaminationType.CROSS,
      objections: new Set([Objection.ARGUMENTATIVE, Objection.HEARSAY]),
    },
    {
      question: 'why did you do that?',
      testimony: 'Because you like',
      type: ExaminationType.DIRECT,
      objections: new Set([Objection.LEADING]),
    },
    {
      question: 'do you agree with that?',
      testimony: 'Yes, I do',
      type: ExaminationType.DIRECT,
      objections: new Set([Objection.LEADING]),
    },
    {
      question: 'You are ManU fan, right?',
      testimony: 'Yessir, ManU fan',
      type: ExaminationType.DIRECT,
      objections: new Set([Objection.LEADING]),
    },
    {
      question: 'You are ManU fan, correct?',
      testimony: 'Yessir, ManU fan',
      type: ExaminationType.DIRECT,
      objections: new Set([Objection.LEADING]),
    },
    {
      question: 'Are you ManU fan?',
      testimony: 'Yessir',
      type: ExaminationType.DIRECT,
      objections: new Set([Objection.NON_RESPONSIVE]),
    },
    {
      question: 'Are you ManU fan?',
      testimony: 'Yessir, ManU fan asjdfasdjfhdjkashfjkhafhaskjh',
      type: ExaminationType.CROSS,
      objections: new Set([Objection.RELEVANCE]),
    },
    {
      question: 'Are you ManU fan?',
      testimony: 'Yessir, ManU fan think',
      type: ExaminationType.DIRECT,
      objections: new Set([Objection.SPECULATION]),
    },
    {
      question: 'Are you ManU fan think?',
      testimony: 'Yessir, ManU fan',
      type: ExaminationType.CROSS,
      objections: new Set([Objection.SPECULATION]),
    },
  ])('$objections', ({ question, testimony, type, objections }) => {
    expect(getObjections(question, testimony, type)).toEqual(objections);
  });
  test('empty question', () => {
    expect(() => getObjections('', 'testimony', ExaminationType.DIRECT)).toThrowError(Error);
  });
  test('empty testimony', () => {
    expect(() => getObjections('question', '', ExaminationType.DIRECT)).toThrowError(Error);
  });
  test('empty question and testimony', () => {
    expect(() => getObjections('', '', ExaminationType.DIRECT)).toThrowError(Error);
  });
});
