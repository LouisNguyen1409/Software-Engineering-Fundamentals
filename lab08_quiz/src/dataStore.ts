/**
 * Placeholder file for defining your data store
 * Feel free to add, edit, ignore or remove this file and create your own files if you wish.
 */
export interface Answer {
  isCorrect: boolean;
  answerString: string;
}
interface Question {
  questionId: number;
  questionString: string;
  questionType: string;
  answers: Answer[];
}
interface Quiz {
  quizId: number;
  quizTitle: string;
  quizSynopsis: string;
  questions: Question[];
}

interface DataStore {
  quizzes: Quiz[];
}

let dataStore: DataStore = {
  quizzes: [],
};

export const getData = () => dataStore;
export function setData(newData: DataStore) {
  dataStore = newData;
}
