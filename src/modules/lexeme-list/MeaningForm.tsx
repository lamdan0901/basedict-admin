import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TLexemeFormData } from "@/modules/lexeme-list/schemas";
import { Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuid } from "uuid";

export function MeaningForm() {
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
