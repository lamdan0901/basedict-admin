import { z } from "zod";

export const questionSchema = z.object({
  text: z.string(),
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
  grammars: z.string(),
  readingType: z.number(),
  jlptLevel: z.string(),
  public: z.boolean().default(false),
  isJlpt: z.boolean().default(false),
  examCode: z.any(),
  topic: z.string(),
});

export type TQuestionFormData = z.infer<typeof questionSchema>;
export type TReadingFormData = z.infer<typeof readingSchema>;

export const defaultFormValues = {
  title: "",
  japanese: "",
  vietnamese: "",
  public: true,
  jlptLevel: "N3",
  readingType: 1,
  isJlpt: false,
  examCode: "1",
  topic: "",
  grammars: "",
  lexemes: "",
  meaning: [],
};
