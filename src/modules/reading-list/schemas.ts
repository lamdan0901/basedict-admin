import { z } from "zod";

export const questionSchema = z.object({
  question: z.string(),
  answers: z.array(z.string()),
  correctAnswer: z.string(),
  id: z.any().optional(),
  uuid: z.string().optional(),
});

export const readingSchema = z.object({
  readingQuestions: z.array(questionSchema),
  id: z.number().optional(),
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title must not exceed 255 characters" }),
  japanese: z.string().min(1, { message: "Japanese is required" }),
  vietnamese: z.string().min(1, { message: "Vietnamese is required" }),
  lexemes: z.string(),
  readingType: z.string(),
  jlptLevel: z.string(),
  source: z.string(),
  topic: z.string(),
  // isJlpt: z.boolean().default(false),
  // public: z.boolean().default(false),
});

export type TQuestionFormData = z.infer<typeof questionSchema>;
export type TReadingFormData = z.infer<typeof readingSchema>;

export const defaultFormValues = {
  // public: true,
  // isJlpt: false,
  title: "",
  japanese: "",
  vietnamese: "",
  jlptLevel: "N3",
  readingType: "SumaryReading",
  topic: "",
  lexemes: "",
  meaning: [],
  source: "BaseDict",
};
