import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  defaultFormValues,
  readingSchema,
  type TReadingFormData,
} from "@/modules/reading-list/schemas";
import { patchRequest, postRequest } from "@/service/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { v4 as uuid } from "uuid";
import { jlptLevels, readingTypeMap } from "@/modules/reading-list/const";
import { ReadingQuestionsForm } from "@/modules/reading-list/ReadingQuestionsForm";

type UpsertReadingModalProps = {
  reading: TReading | null;
  open: boolean;
  onOpenChange(open: boolean): void;
  onDeleteReading(): void;
  mutate: any;
};

export function UpsertReadingModal({
  reading,
  open,
  onOpenChange,
  onDeleteReading,
  mutate,
}: UpsertReadingModalProps) {
  const { toast } = useToast();
  const form = useForm<TReadingFormData>({
    mode: "all",
    resolver: zodResolver(readingSchema),
    defaultValues: {
      ...defaultFormValues,
      readingQuestions: [
        {
          question: "",
          answers: [],
          correctAnswer: "",
          uuid: uuid(),
        },
      ],
    },
  });
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const { trigger: lexemePostTrigger, isMutating: isPostingLexeme } =
    useSWRMutation("/v1/admin/readings", postRequest);
  const { trigger: lexemePatchTrigger, isMutating: isPatchingLexeme } =
    useSWRMutation(`/v1/admin/readings/${reading?.id}`, patchRequest);
  const isMutating = isPostingLexeme || isPatchingLexeme;

  async function submitForm(data: TReadingFormData) {
    const lexemes = data.lexemes.split(",").map((item) => item.trim());

    data.readingQuestions.forEach((m) => {
      delete m.uuid;
    });
    delete data.id;

    const body = {
      ...data,
      lexemes,
    };

    try {
      reading ? await lexemePatchTrigger(body) : await lexemePostTrigger(body);

      toast({
        title: "Changes saved",
      });
      closeModal();
      mutate();
    } catch (err) {
      toast({
        title: "Cannot save changes, please try again",
        variant: "destructive",
      });
      console.error("err submitForm: ", err);
    }
  }

  function closeModal() {
    if (!isMutating) {
      reset({
        ...defaultFormValues,
        readingQuestions: [
          {
            question: "",
            answers: [],
            correctAnswer: "",
            uuid: uuid(),
          },
        ],
      });
      onOpenChange(false);
    }
  }

  useEffect(() => {
    if (reading)
      reset({
        ...reading,
        lexemes: reading.lexemes.join(", "),
        readingQuestions: reading.readingQuestions.map((m) => ({
          ...m,
          uuid: uuid(),
        })),
      });
  }, [reading, reset]);

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent
        aria-describedby=""
        className="!pb-[80px] max-h-[100dvh] sm:min-w-[800px] min-w-full"
      >
        <DialogHeader>
          <DialogTitle>
            {reading ? "Edit Reading" : "Add new Reading"}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-auto px-1 h-fit max-h-[calc(100dvh-144px)]">
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="space-y-6 mb-4">
              <div className="flex w-full  gap-4">
                <div className="flex items-center flex-[8] gap-4 w-full justify-between">
                  <Controller
                    name="readingType"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-col flex-1 items-start space-y-2">
                        <Label htmlFor="public">Reading Type</Label>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(readingTypeMap).map(
                              ([type, title]) => (
                                <SelectItem key={type} value={type}>
                                  {title}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                  <Controller
                    name="jlptLevel"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-col flex-1 items-start space-y-2">
                        <Label htmlFor="public">JLPT Level</Label>
                        <Select
                          onValueChange={(val) => field.onChange(val)}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            {jlptLevels.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                  <Controller
                    name="source"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-col flex-1 items-start space-y-2">
                        <Label htmlFor="">Source</Label>
                        <Select
                          onValueChange={(val) => field.onChange(val)}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="JLPT">JLPT</SelectItem>
                            <SelectItem value="BaseDict">BaseDict</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-rows-2 items-center relative">
                <Label htmlFor="topic" className="text-left text-base">
                  Topic
                </Label>
                <Input
                  id="topic"
                  className="col-span-3"
                  maxLength={255}
                  {...register("topic")}
                />
              </div>
              <div className="grid grid-rows-2 items-center relative">
                <Label htmlFor="title" className="text-left text-base">
                  Title (*)
                </Label>
                <Input
                  id="title"
                  className="col-span-3"
                  maxLength={255}
                  {...register("title")}
                />
                <p className="text-destructive text-sm absolute -bottom-5 left-0">
                  {(errors.title?.message as string) ?? ""}
                </p>
              </div>
              <div className="flex flex-col gap-2 relative">
                <Label htmlFor="hiragana" className="text-left text-base">
                  Japanese (*)
                </Label>
                <Textarea id="japanese" {...register("japanese")} />
                <p className="text-destructive text-sm absolute -bottom-5 left-0">
                  {(errors.japanese?.message as string) ?? ""}
                </p>
              </div>
              <div className="flex flex-col gap-2 relative">
                <Label htmlFor="vietnamese" className="text-left text-base">
                  Vietnamese (*)
                </Label>
                <Textarea id="vietnamese" {...register("vietnamese")} />
                <p className="text-destructive text-sm absolute -bottom-5 left-0">
                  {(errors.vietnamese?.message as string) ?? ""}
                </p>
              </div>
              <div className="grid grid-rows-2 items-center relative">
                <Label htmlFor="Vocabulary" className="text-left text-base">
                  Vocabulary
                </Label>
                <Input
                  id="Vocabulary"
                  className="col-span-3"
                  {...register("lexemes")}
                />
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
              {reading && (
                <Button
                  disabled={isMutating}
                  onClick={onDeleteReading}
                  type="button"
                  variant={"destructive"}
                >
                  Delete
                </Button>
              )}
            </DialogFooter>
          </form>

          <FormProvider {...form}>
            <ReadingQuestionsForm />
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
