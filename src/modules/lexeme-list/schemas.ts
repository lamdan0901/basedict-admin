import { z } from "zod";

export const meaningSchema = z.object({
  meaning: z
    .string()
    .max(100, { message: "Meaning must not exceed 100 characters" })
    .min(1, { message: "Meaning is required" }),
  context: z
    .string()
    .max(20, { message: "Context must not exceed 20 characters" })
    .default(""),
  explaination: z.string().min(1, { message: "Explanation is required" }),
  example: z.string().default(""),
  uuid: z.string().optional(),
});

export const lexemeSchema = z.object({
  meaning: z.array(meaningSchema),
  id: z.string().optional(),
  lexeme: z
    .string()
    .min(1, { message: "Lexeme is required" })
    .max(10, { message: "Lexeme must not exceed 10 characters" }),
  standard: z
    .string()
    .min(1, { message: "Standard is required" })
    .max(10, { message: "Standard must not exceed 10 characters" }),
  hiragana: z
    .string()
    .min(1, { message: "Hiragana is required" })
    .max(10, { message: "Hiragana must not exceed 10 characters" }),
  hanviet: z
    .string()
    .min(1, { message: "Han Viet is required" })
    .max(20, { message: "Han Viet must not exceed 20 characters" }),
  old_jlpt_level: z
    .number({ message: "Number format expected" })
    .lte(10)
    .gte(0),
  word_origin: z
    .string()
    .min(1, { message: "Word Origin is required" })
    .max(5, { message: "Word Origin must not exceed 5 characters" }),
  frequency_ranking: z
    .number({ message: "Number format expected" })
    .lte(99999)
    .gte(0), //Freequenly Ranking
  part_of_speech: z
    .string()
    .min(1, { message: "Part Of Speech is required" })
    .max(20, { message: "Part Of Speech must not exceed 20 characters" }),
  is_master: z.boolean().default(false),
  approved: z.boolean().default(false),
});

export type TMeaningFormData = z.infer<typeof meaningSchema>;
export type TLexemeFormData = z.infer<typeof lexemeSchema>;

export const defaultFormValues = {
  lexeme: "",
  standard: "",
  hiragana: "",
  hanviet: "",
  old_jlpt_level: 0,
  word_origin: "admin",
  frequency_ranking: 9999,
  part_of_speech: "-",
  is_master: false,
  approved: true,
  meaning: [],
};
