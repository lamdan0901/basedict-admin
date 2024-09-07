export const jlptLevels: { title: string; value: string }[] = [
  {
    title: "N1",
    value: "N1",
  },
  {
    title: "N2",
    value: "N2",
  },
  {
    title: "N3",
    value: "N3",
  },
  {
    title: "N4",
    value: "N4",
  },
  {
    title: "N5",
    value: "N5",
  },
];

export enum ReadingType {
  GrammarReading = "GrammarReading",
  SumaryReading = "SumaryReading",
  MediumReading = "MediumReading",
  LongReading = "LongReading",
  CompareReading = "CompareReading",
  NoticeReaing = "NoticeReaing",
}

export const readingTypeMap: Record<ReadingType, string> = {
  [ReadingType.GrammarReading]: "Bài đọc ngữ pháp",
  [ReadingType.SumaryReading]: "Bài đọc ngắn",
  [ReadingType.MediumReading]: "Bài đọc trung bình",
  [ReadingType.LongReading]: "Bài đọc dài",
  [ReadingType.CompareReading]: "Bài đọc so sánh",
  [ReadingType.NoticeReaing]: "Bài đọc bảng biểu",
};
