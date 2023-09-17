export enum Objection {
  /**
  * By default, enum are integers 0, 1, 2, ...
  * However, we can also give them string values
  */
  ARGUMENTATIVE = 'argumentative',
  COMPOUND = 'compound',
  HEARSAY = 'hearsay',
  LEADING = 'leading',
  NON_RESPONSIVE = 'non-responsive',
  RELEVANCE = 'relevance',
  SPECULATION = 'speculation',
}

export enum ExaminationType {
  /**
    * It is also possible to specify a "start" number.
    *
    * Below would assign CROSS = 1, DIRECT = 2, the next
    * would be 3, etc.
    */
  CROSS = 1,
  DIRECT,
}

// Helper function - feel free to remove / modify.
function isArgumentative(question: string) {
  return !question.endsWith('?');
}

function isCompound(question: string) {
  const questionMark = /\?/g;
  const matches = question.match(questionMark);
  if (matches && matches.length > 1) {
    return true;
  }
  return false;
}
function removePunctuation(text: string) {
  const word = /[^a-zA-Z0-9\s]/g;
  return text.replace(word, '');
}
function isNonResponsive(question: string, testimony: string) {
  question = removePunctuation(question);
  testimony = removePunctuation(testimony);
  const questionWords = question.split(' ');
  const testimonyWords = testimony.split(' ');
  for (const word of questionWords) {
    if (testimonyWords.includes(word)) {
      return false;
    }
  }
  return true;
}
/**
 * Feel free to modify the function below as you see fit,
 * so long as you satisfy the specification.
 */
export function getObjections(
  question: string,
  testimony: string,
  examinationType: ExaminationType
): Set<Objection> {
  if (question === '') {
    throw new Error('Question cannot be empty');
  }
  if (testimony === '') {
    throw new Error('Testimony cannot be empty');
  }
  // Convert given question and testimony to lowercase
  question = question.toLowerCase();
  testimony = testimony.toLowerCase();

  const objections = new Set<Objection>();

  if (examinationType === ExaminationType.CROSS) {
    if (isArgumentative(question)) {
      objections.add(Objection.ARGUMENTATIVE);
    }
    if (question.includes('think')) {
      objections.add(Objection.SPECULATION);
    }
  } else if (examinationType === ExaminationType.DIRECT) {
    if (question.startsWith('why did you') || question.startsWith('do you agree') || question.endsWith('right?') || question.endsWith('correct?')) {
      objections.add(Objection.LEADING);
    }
    if (testimony.includes('think')) {
      objections.add(Objection.SPECULATION);
    }
  }
  if (isCompound(question)) {
    objections.add(Objection.COMPOUND);
  }
  if (testimony.includes('heard from') || testimony.includes('told me')) {
    objections.add(Objection.HEARSAY);
  }
  if (isNonResponsive(question, testimony)) {
    objections.add(Objection.NON_RESPONSIVE);
  }
  if (testimony.length > 2 * question.length) {
    objections.add(Objection.RELEVANCE);
  }
  return objections;
}
