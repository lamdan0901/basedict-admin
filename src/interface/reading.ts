type TReadingType =
  | "GrammarReading"
  | "SumaryReading"
  | "MediumReading"
  | "LongReading"
  | "CompareReading"
  | "NoticeReading";

type TTestSource = "JLPT" | "BaseDict";

type JlptLevel = "N1" | "N2" | "N3" | "N4" | "N5";

type TReadingQuestion = {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: string;
};

type TReading = {
  id: number;
  title: string;
  topic: string;
  jlptLevel: JlptLevel;
  japanese: string;
  vietnamese: string;
  lexemes: string[];
  readingType: TReadingType;
  source: TTestSource;
  readingQuestions: TReadingQuestion[];
  // public: boolean;
  // isJlpt: boolean;
  // examCode: number;
};

type TTestPeriod = {
  id: number;
  jlptLevel: JlptLevel;
  rank: string;
  source: TTestSource;
  title: string;
};
