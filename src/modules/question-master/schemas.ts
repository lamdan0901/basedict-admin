import { z } from "zod";

export const questionMasterSchema = z.object({
  id: z.any().optional(),
  source: z.string(),
  type: z.string(),
  question: z.string().min(1, { message: "Question is required" }),
  answers: z.array(
    z
      .string()
      .min(1, { message: "Answer is required" })
      .max(255, { message: "Answer must not exceed 255 characters" })
  ),
  correctAnswer: z.string().min(1, { message: "Correct Answer is required" }),
  explanation: z.string().nullable().optional(),
  jlptLevel: z.string(),
});

export type TQuestionMasterFormData = z.infer<typeof questionMasterSchema>;

export const defaultFormValues = {
  source: "JLPT",
  type: "ContextLexeme",
  question: "",
  answers: [],
  correctAnswer: "",
  explanation: "",
  jlptLevel: "N3",
};
