enum JlptLevelEnum {
  N1 = 'N1',
  N2 = 'N2',
  N3 = 'N3',
  N4 = 'N4',
  N5 = 'N5',
}

type TGrammar = {
  id: string;
  grammar: string;
  meaning: string;
  summary: string;
  structure: string;
  detail: string;
  jlptLevel: JlptLevelEnum;
  similars: string[];
};
