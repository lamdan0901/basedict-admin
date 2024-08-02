type TMeaning = {
  meaning: string;
  explainations: string;
  example: string;
};

type TLexeme = {
  meaning: TMeaning[];
  id: string;
  lexeme: string;
  hiragana: string;
  hanviet: string;
  approved: boolean;
  approved_at: string | null;
  createdAt: string;
  updatedAt: string;
};
