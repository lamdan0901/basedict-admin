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
import { zodResolver } from "@hookform/resolvers/zod";
import useSWRMutation from "swr/mutation";
import { postRequest, patchRequest } from "@/service/data";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { v4 as uuid } from "uuid";
import { useEffect } from "react";
import {
  defaultFormValues,
  lexemeSchema,
  type TLexemeFormData,
} from "@/modules/lexeme-list/schemas";
import { useToast } from "@/components/ui/use-toast";
import { MeaningForm } from "@/modules/lexeme-list/MeaningForm";

type UpsertLexemeModalProps = {
  lexeme: TLexeme | null;
  open: boolean;
  onOpenChange(open: boolean): void;
  onDeleteLexeme(): void;
  mutate: any;
};

export function UpsertLexemeModal({
  lexeme,
  open,
  onOpenChange,
  onDeleteLexeme,
  mutate,
}: UpsertLexemeModalProps) {
  const { toast } = useToast();
  const form = useForm<TLexemeFormData>({
    mode: "all",
    resolver: zodResolver(lexemeSchema),
    defaultValues: {
      ...defaultFormValues,
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
    setValue,
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

      toast({
        title: "Changes saved",
      });
      closeModal();
      mutate();
    } catch (err) {
      if (err === "UNIQUE_VIOLATION") {
        toast({
          title:
            err === "UNIQUE_VIOLATION"
              ? "Lexeme is used, please try another one"
              : "Cannot save changes, please try again",
          variant: "destructive",
        });
      }
      console.error("err submitForm: ", err);
    }
  }

  function closeModal() {
    if (!isMutating) {
      reset({
        ...defaultFormValues,
        meaning: [
          {
            meaning: "",
            context: "",
            explaination: "",
            example: "",
            uuid: uuid(),
          },
        ],
      });
      onOpenChange(false);
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
      <DialogContent
        aria-describedby=""
        className="lg:min-w-[1125px] !pb-[80px] max-h-[100dvh] sm:min-w-[825px] min-w-full"
      >
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
                    {...register("lexeme", {
                      onBlur: (e) => {
                        const val = e.target.value;
                        if (val) setValue("standard", val);
                      },
                    })}
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

            <DialogFooter className="sm:mt-6 fixed left-1/2 bottom-[20px] -translate-x-1/2 mt-3 sm:justify-center space-x-3 sm:space-x-6">
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
              {lexeme && (
                <Button
                  disabled={isMutating}
                  onClick={onDeleteLexeme}
                  type="button"
                  variant={"destructive"}
                >
                  Delete
                </Button>
              )}
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
