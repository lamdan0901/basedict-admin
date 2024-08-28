import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TReadingFormData } from "@/modules/reading-list/schemas";
import { Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuid } from "uuid";

export function ReadingQuestionsForm() {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<TReadingFormData>();

  const readingQuestions = watch("readingQuestions");

  const readingQuestionList = useFieldArray({
    name: "readingQuestions",
    control,
  });

  return (
    <>
      {readingQuestions?.map(({ id, uuid }, i) => (
        <div
          key={uuid}
          className="flex relative flex-col gap-4 md:gap-x-12 bg-slate-300 rounded-lg p-6 pt-4 mt-6 mb-4"
        >
          {id && (
            <input type="hidden" {...register(`readingQuestions.${i}.id`)} />
          )}
          <div className="grid flex-1 grid-rows-2 items-center relative">
            <Label htmlFor="question" className="text-left text-base">
              Question
            </Label>
            <Input
              maxLength={255}
              id="question"
              className="col-span-3"
              {...register(`readingQuestions.${i}.text`)}
            />
            <p className="text-destructive text-sm absolute -bottom-5 left-0">
              {(errors.readingQuestions?.[i]?.text?.message as string | null) ??
                ""}
            </p>
          </div>
          <div className="grid flex-1 grid-rows-2 items-center relative">
            <Label className="text-left text-base">Answers</Label>
            {Array.from({ length: 4 }).map((_, j) => (
              <div
                key={`readingQuestions.${i}.answers.${j}`}
                className="flex items-center mb-2 gap-2"
              >
                <Label htmlFor="Answers" className="text-left w-3 text-base">
                  {j + 1}.
                </Label>
                <Input
                  id="Answers"
                  maxLength={255}
                  className="col-span-3"
                  {...register(`readingQuestions.${i}.answers.${j}`)}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-1 flex-col gap-5">
            <div className="flex flex-col items-start relative">
              <Label htmlFor="correctAnswer" className="text-left text-base">
                Correct Answer
              </Label>
              <Input
                id="correctAnswer"
                maxLength={255}
                className="w-full mt-2"
                {...register(`readingQuestions.${i}.correctAnswer`)}
              />
              <p className="text-destructive text-sm absolute -bottom-5 left-0">
                {(errors.readingQuestions?.[i]?.correctAnswer?.message as
                  | string
                  | null) ?? ""}
              </p>
            </div>
          </div>

          {readingQuestions?.length > 1 && (
            <Button
              variant="ghost"
              onClick={() => readingQuestionList.remove(i)}
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
            readingQuestionList.append({
              text: "",
              answers: [],
              correctAnswer: "",
              uuid: uuid(),
            })
          }
          className="mt-2"
          type="button"
        >
          Add new Question
        </Button>
      </div>
    </>
  );
}
