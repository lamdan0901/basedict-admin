import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWRMutation from "swr/mutation";
import { postRequest, patchRequest } from "@/service/data";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { v4 as uuid } from "uuid";
import { useEffect } from "react";

type UpsertLexemeModalProps = {
  lexeme: TLexeme | null;
  open?: boolean;
  onOpenChange?(open: boolean): void;
  mutate: any;
};

const meaningSchema = z.object({
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

const lexemeSchema = z.object({
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

// type TMeaningFormData = z.infer<typeof meaningSchema>;
type TLexemeFormData = z.infer<typeof lexemeSchema>;

export function UpsertLexemeModal({
  lexeme,
  open,
  onOpenChange,
  mutate,
}: UpsertLexemeModalProps) {
  const form = useForm<TLexemeFormData>({
    mode: "all",
    resolver: zodResolver(lexemeSchema),
    defaultValues: {
      meaning: [
        {
          meaning: "",
          context: "",
          explaination: "",
          example: "",
          uuid: uuid(),
        },
      ],
    },
  });
  const {
    control,
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = form;

  const { trigger: lexemePostTrigger, isMutating: isPostingLexeme } =
    useSWRMutation("/v1/lexemes", postRequest);
  const { trigger: lexemePatchTrigger, isMutating: isPatchingLexeme } =
    useSWRMutation(`/v1/lexemes/${lexeme?.id}`, patchRequest);
  const isMutating = isPostingLexeme || isPatchingLexeme;

  async function submitForm(data: TLexemeFormData) {
    const part_of_speech = data.part_of_speech
      .split(",")
      .map((item) => item.trim());

    data.meaning.forEach((m) => {
      delete m.uuid;
    });
    delete data.id;

    try {
      lexeme
        ? await lexemePatchTrigger({
            ...data,
            part_of_speech,
          })
        : await lexemePostTrigger({
            ...data,
            part_of_speech,
          });

      closeModal();
      mutate();
    } catch (err) {
      if (err === "UNIQUE_VIOLATION") {
        setError("lexeme", { message: "Lexeme is used" });
      }
      console.log("err: ", err);
    }
  }

  function closeModal() {
    if (!isMutating) {
      onOpenChange?.(false);
      reset();
    }
  }

  useEffect(() => {
    if (lexeme)
      reset({
        ...lexeme,
        part_of_speech: lexeme.part_of_speech.join(", "),
        meaning: lexeme.meaning.map((m) => ({
          ...m,
          uuid: uuid(),
        })),
      });
  }, [lexeme, reset]);

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="lg:min-w-[1125px] !pb-[80px] max-h-[100dvh] sm:min-w-[825px] min-w-full">
        <DialogHeader>
          <DialogTitle>{lexeme ? "Edit Lexeme" : "Add new Lexeme"}</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto h-fit max-h-[calc(100dvh-144px)]">
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="flex sm:gap-8 py-4 lg:gap-12">
              <Controller
                name="is_master"
                control={control}
                render={({ field }) => (
                  <div className="flex w-full items-center space-x-2">
                    <Switch
                      id="is_master"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="is_master">Is Master</Label>
                  </div>
                )}
              />
              <Controller
                name="approved"
                control={control}
                render={({ field }) => (
                  <div className="flex w-full items-center space-x-2">
                    <Switch
                      id="approved"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="approved">Is Approved</Label>
                  </div>
                )}
              />
            </div>

            <div className="flex sm:flex-row flex-col gap-4 md:gap-x-12">
              <div className="flex flex-1 flex-col gap-3">
                <div className="grid grid-rows-2 items-center relative">
                  <Label htmlFor="lexeme" className="text-left text-base">
                    Lexeme (*)
                  </Label>
                  <Input
                    id="lexeme"
                    className="col-span-3"
                    {...register("lexeme")}
                  />
                  <p className="text-destructive text-sm absolute -bottom-5 left-0">
                    {(errors.lexeme?.message as string) ?? ""}
                  </p>
                </div>
                <div className="grid grid-rows-2 items-center relative">
                  <Label htmlFor="hiragana" className="text-left text-base">
                    Hiragana (*)
                  </Label>
                  <Input
                    id="hiragana"
                    className="col-span-3"
                    {...register("hiragana")}
                  />
                  <p className="text-destructive text-sm absolute -bottom-5 left-0">
                    {(errors.hiragana?.message as string) ?? ""}
                  </p>
                </div>
                <div className="grid grid-rows-2 items-center relative">
                  <Label
                    htmlFor="old_jlpt_level"
                    className="text-left text-base"
                  >
                    Old Level (*)
                  </Label>
                  <Input
                    id="old_jlpt_level"
                    type="number"
                    className="col-span-3"
                    {...register("old_jlpt_level", { valueAsNumber: true })}
                  />
                  <p className="text-destructive text-sm absolute -bottom-5 left-0">
                    {(errors.old_jlpt_level?.message as string) ?? ""}
                  </p>
                </div>
                <div className="grid grid-rows-2 items-center relative">
                  <Label
                    htmlFor="frequency_ranking"
                    className="text-left text-base"
                  >
                    Frequency Ranking (*)
                  </Label>
                  <Input
                    id="frequency_ranking"
                    type="number"
                    className="col-span-3"
                    {...register("frequency_ranking", { valueAsNumber: true })}
                  />
                  <p className="text-destructive text-sm absolute -bottom-5 left-0">
                    {(errors.frequency_ranking?.message as string) ?? ""}
                  </p>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <div className="grid grid-rows-2 items-center relative">
                  <Label htmlFor="standard" className="text-left text-base">
                    Standard (*)
                  </Label>
                  <Input
                    id="standard"
                    className="col-span-3"
                    {...register("standard")}
                  />
                  <p className="text-destructive text-sm absolute -bottom-5 left-0">
                    {(errors.standard?.message as string) ?? ""}
                  </p>
                </div>
                <div className="grid grid-rows-2 items-center relative">
                  <Label htmlFor="hanviet" className="text-left text-base">
                    Han Viet (*)
                  </Label>
                  <Input
                    id="hanviet"
                    className="col-span-3"
                    {...register("hanviet")}
                  />
                  <p className="text-destructive text-sm absolute -bottom-5 left-0">
                    {(errors.hanviet?.message as string) ?? ""}
                  </p>
                </div>
                <div className="grid grid-rows-2 items-center relative">
                  <Label htmlFor="word_origin" className="text-left text-base">
                    Word Origin (*)
                  </Label>
                  <Input
                    id="word_origin"
                    className="col-span-3"
                    {...register("word_origin")}
                  />
                  <p className="text-destructive text-sm absolute -bottom-5 left-0">
                    {(errors.word_origin?.message as string) ?? ""}
                  </p>
                </div>
                <div className="grid grid-rows-2 items-center relative">
                  <Label
                    htmlFor="part_of_speech"
                    className="text-left text-base"
                  >
                    Part Of Speech (*)
                  </Label>
                  <Input
                    id="part_of_speech"
                    className="col-span-3"
                    {...register("part_of_speech")}
                  />
                  <p className="text-destructive text-sm absolute -bottom-5 left-0">
                    {(errors.part_of_speech?.message as string) ?? ""}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="sm:mt-6 fixed left-1/2 bottom-[20px] -translate-x-1/2 mt-3 sm:justify-center sm:space-x-4">
              <Button disabled={isMutating} type="submit">
                Save changes
              </Button>
              <Button
                disabled={isMutating}
                onClick={closeModal}
                type="button"
                variant={"outline"}
              >
                Back
              </Button>
            </DialogFooter>
          </form>

          <FormProvider {...form}>
            <MeaningForm />
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MeaningForm() {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<TLexemeFormData>();

  const meaning = watch("meaning");

  const meaningList = useFieldArray({
    name: "meaning",
    control,
  });

  return (
    <>
      {meaning?.map(({ uuid }, i) => (
        <div
          key={uuid}
          className="flex relative flex-col gap-5 md:gap-x-12 bg-slate-300 rounded-lg p-6 pt-4 mt-6 mb-4"
        >
          <div className="flex sm:flex-row flex-col gap-4 md:gap-x-12">
            <div className="grid flex-1 grid-rows-2 items-center relative">
              <Label htmlFor="meaning" className="text-left text-base">
                Meaning (*)
              </Label>
              <Input
                id="meaning"
                className="col-span-3"
                {...register(`meaning.${i}.meaning`)}
              />
              <p className="text-destructive text-sm absolute -bottom-5 left-0">
                {(errors.meaning?.[i]?.meaning?.message as string | null) ?? ""}
              </p>
            </div>
            <div className="grid flex-1 grid-rows-2 items-center relative">
              <Label htmlFor="context" className="text-left text-base">
                Context
              </Label>
              <Input
                id="context"
                className="col-span-3"
                {...register(`meaning.${i}.context`)}
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-5">
            <div className="flex flex-col items-start relative">
              <Label htmlFor="explaination" className="text-left text-base">
                Explanation (*)
              </Label>
              <Textarea
                id="explaination"
                className="w-full mt-2"
                {...register(`meaning.${i}.explaination`)}
              />
              <p className="text-destructive text-sm absolute -bottom-5 left-0">
                {(errors.meaning?.[i]?.explaination?.message as
                  | string
                  | null) ?? ""}
              </p>
            </div>
            <div className="flex flex-col items-start relative">
              <Label htmlFor="example" className="text-left text-base">
                Example
              </Label>
              <Textarea
                id="example"
                className="w-full mt-2"
                {...register(`meaning.${i}.example`)}
              />
            </div>
          </div>

          {meaning?.length > 1 && (
            <Button
              variant="ghost"
              onClick={() => meaningList.remove(i)}
              size={"sm"}
              className="absolute top-3 !p-2 right-3 rounded-full"
            >
              <Trash2 className="w-5 h-5 text-destructive" />
            </Button>
          )}
        </div>
      ))}

      <div className="w-full flex justify-center">
        <Button
          onClick={() =>
            meaningList.append({
              meaning: "",
              context: "",
              explaination: "",
              example: "",
              uuid: uuid(),
            })
          }
          className="mt-2"
          type="button"
        >
          Add new Meaning
        </Button>
      </div>
    </>
  );
}
