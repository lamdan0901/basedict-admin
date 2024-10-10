import { z } from "zod";

export const grammarSchema = z.object({
  id: z.string().optional(),
  grammar: z
    .string()
    .min(1, { message: "Grammar is required" })
    .max(255, { message: "Grammar must not exceed 255 characters" }),
  meaning: z
    .string()
    .min(1, { message: "Meaning is required" })
    .max(255, { message: "Meaning must not exceed 255 characters" }),
  structure: z
    .string()
    .min(1, { message: "Structure is required" })
    .max(255, { message: "Structure must not exceed 255 characters" }),
  summary: z.string().min(1, { message: "summary is required" }),
  detail: z.string().min(1, { message: "Details is required" }),
  jlptLevel: z.string(),
  similars: z.string(),
});

export type TGrammarFormData = z.infer<typeof grammarSchema>;

export const defaultFormValues = {
  grammar: "",
  meaning: "",
  summary: "",
  structure: "",
  detail: "",
  jlptLevel: "N3",
};
