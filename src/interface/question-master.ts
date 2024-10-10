type TQuestionType =
  | "ContextLexeme"
  | "Grammar"
  | "Lexeme"
  | "GrammarAlign"
  | "KanjiToHiragara"
  | "HiraganaToKanji"
  | "SuffixPrefix"
  | "Synonym";

type TQuestionMaster = {
  id: number;
  source: string;
  jlptLevel: JlptLevel;
  type: string;
  question: string;
  answers: string[];
  correctAnswer: string;
  explanation: string | null;
};
