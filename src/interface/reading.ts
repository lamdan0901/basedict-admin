type TReadingQuestion = {
  id: number;
  text: string;
  answers: string[];
  correctAnswer: string;
};

type TReading = {
  id: number;
  title: string;
  topic: string;
  jlptLevel: string;
  readingType: number;
  japanese: string;
  vietnamese: string;
  public: boolean;
  lexemes: string[];
  grammars: string[];
  createdAt: string;
  updatedAt: string;
  isJlpt: boolean;
  examCode: number;
  readingQuestions: TReadingQuestion[];
};
