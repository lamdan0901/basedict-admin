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
  questionMasterSchema,
  type TQuestionMasterFormData,
} from "@/modules/question-master/schemas";
import { patchRequest, postRequest } from "@/service/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { questionTypes } from "@/modules/question-master/const";
import { jlptLevels } from "@/modules/reading-list/const";
import { KeyedMutator } from "swr";

type UpsertQuestionModalProps = {
  question: TQuestionMaster | null;
  open: boolean;
  onOpenChange(open: boolean): void;
  onDeleteQuestion(): void;
  mutate: KeyedMutator<{
    data: TQuestionMaster[];
    total: number;
  }>;
};

export function UpsertQuestionModal({
  question,
  open,
  onOpenChange,
  onDeleteQuestion,
  mutate,
}: UpsertQuestionModalProps) {
  const { toast } = useToast();
  const form = useForm<TQuestionMasterFormData>({
    mode: "all",
    resolver: zodResolver(questionMasterSchema),
    defaultValues: {
      ...defaultFormValues,
    },
  });
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const { trigger: questionPostTrigger, isMutating: isPostingQuestion } =
    useSWRMutation("/v1/admin/question-masters", postRequest);
  const { trigger: questionPatchTrigger, isMutating: isPatchingQuestion } =
    useSWRMutation(`/v1/admin/question-masters/${question?.id}`, patchRequest);
  const isMutating = isPostingQuestion || isPatchingQuestion;

  async function submitForm(data: TQuestionMasterFormData) {
    delete data.id;

    try {
      question
        ? await questionPatchTrigger(data)
        : await questionPostTrigger(data);

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
              ? "Question is used, please try another one"
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
      });
      onOpenChange(false);
    }
  }

  useEffect(() => {
    if (question) reset(question);
  }, [question, reset]);

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent
        aria-describedby=""
        className="lg:min-w-[1125px] !pb-[80px] max-h-[100dvh] sm:min-w-[825px] min-w-full"
      >
        <DialogHeader>
          <DialogTitle>
            {question ? "Edit Question" : "Add new Question"}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-auto h-fit max-h-[calc(100dvh-144px)]">
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="flex items-center flex-[8] gap-4 w-full justify-between">
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col flex-1 items-start space-y-2">
                    <Label className=" text-base" htmlFor="public">
                      Type
                    </Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        {questionTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
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
                    <Label className=" text-base" htmlFor="public">
                      JLPT Level
                    </Label>
                    <Select
                      onValueChange={(val) => field.onChange(val)}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        {jlptLevels.map(({ value }) => (
                          <SelectItem key={value} value={value}>
                            {value}
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
                    <Label className=" text-base" htmlFor="">
                      Source
                    </Label>
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

            <div className="space-y-2 mt-4">
              <Label htmlFor="question" className="text-left text-base">
                Question
              </Label>
              <Textarea
                id="question"
                className="col-span-3"
                error={errors.question?.message}
                {...register("question")}
              />
            </div>

            <div className="grid grid-rows-2 items-center relative">
              <Label htmlFor="answer1" className="text-left text-base">
                Answer 1
              </Label>
              <Input
                id="answer1"
                className="col-span-3"
                error={errors.answers?.[0]?.message}
                {...register("answers.0")}
              />
            </div>
            <div className="grid grid-rows-2 items-center relative">
              <Label htmlFor="answer2" className="text-left text-base">
                Answer 2
              </Label>
              <Input
                id="answer2"
                className="col-span-3"
                error={errors.answers?.[1]?.message}
                {...register("answers.1")}
              />
            </div>
            <div className="grid grid-rows-2 items-center relative">
              <Label htmlFor="answer3" className="text-left text-base">
                Answer 3
              </Label>
              <Input
                id="answer3"
                className="col-span-3"
                error={errors.answers?.[2]?.message}
                {...register("answers.2")}
              />
            </div>
            <div className="grid grid-rows-2 items-center relative">
              <Label htmlFor="answer4" className="text-left text-base">
                Answer 4
              </Label>
              <Input
                id="answer4"
                className="col-span-3"
                error={errors.answers?.[3]?.message}
                {...register("answers.3")}
              />
            </div>

            <div className="grid grid-rows-2 items-center relative">
              <Label htmlFor="correctAnswer" className="text-left text-base">
                Correct Answer
              </Label>
              <Input
                id="correctAnswer"
                className="col-span-3"
                error={errors.correctAnswer?.message}
                {...register("correctAnswer")}
              />
            </div>

            <div className="space-y-2 mt-2">
              <Label htmlFor="explanation" className="text-left text-base">
                Explanation
              </Label>
              <Textarea
                id="explanation"
                className="col-span-3"
                {...register("explanation")}
              />
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
              {question && (
                <Button
                  disabled={isMutating}
                  onClick={onDeleteQuestion}
                  type="button"
                  variant={"destructive"}
                >
                  Delete
                </Button>
              )}
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
