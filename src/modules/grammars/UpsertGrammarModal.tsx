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
  SelectGroup,
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
  grammarSchema,
  type TGrammarFormData,
} from "@/modules/grammars/schemas";
import { patchRequest, postRequest } from "@/service/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { v4 as uuid } from "uuid";

type UpsertGrammarModalProps = {
  grammar: TGrammar | null;
  open: boolean;
  onOpenChange(open: boolean): void;
  onDeleteGrammar(): void;
  mutate: any;
};

export function UpsertGrammarModal({
  grammar,
  open,
  onOpenChange,
  onDeleteGrammar,
  mutate,
}: UpsertGrammarModalProps) {
  const { toast } = useToast();
  const form = useForm<TGrammarFormData>({
    mode: "all",
    resolver: zodResolver(grammarSchema),
    defaultValues: {
      ...defaultFormValues
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

  const { trigger: grammarPostTrigger, isMutating: isPostingGrammar } =
    useSWRMutation("/v1/grammars", postRequest);
  const { trigger: grammarPatchTrigger, isMutating: isPatchingGrammar } =
    useSWRMutation(`/v1/grammars/${grammar?.id}`, patchRequest);
  const isMutating = isPostingGrammar || isPatchingGrammar;

  async function submitForm(data: TGrammarFormData) {
    delete data.id;
    const similars = data.similars.split(",").map((item) => item.trim());
    try {
      grammar
        ? await grammarPatchTrigger({
            ...data,
            similars
          })
        : await grammarPostTrigger({
            ...data,
            similars
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
              ? "Grammar is used, please try another one"
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
    if (grammar)
      reset({
        ...grammar,
        similars: grammar.similars.join(", "),
      });
  }, [grammar, reset]);

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent
        aria-describedby=""
        className="lg:min-w-[1125px] !pb-[80px] max-h-[100dvh] sm:min-w-[825px] min-w-full"
      >
        <DialogHeader>
          <DialogTitle>{grammar ? "Edit Grammar" : "Add new Grammar"}</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto h-fit max-h-[calc(100dvh-144px)]">
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="grid grid-rows-2 items-center relative">
              <Label htmlFor="grammar" className="text-left text-base">
                Grammar
              </Label>
              <Input
                id="grammar"
                className="col-span-3"
                {...register("grammar")}
              />
            </div>
            <div className="grid grid-rows-2 items-center relative">
              <Label htmlFor="meaning" className="text-left text-base">
                Meaning
              </Label>
              <Input
                id="meaning"
                className="col-span-3"
                {...register("meaning")}
              />
            </div>
            <div className="grid grid-rows-2 items-center relative">
              <Label htmlFor="structure" className="text-left text-base">
                Structure
              </Label>
              <Textarea
                id="structure"
                className="col-span-3"
                {...register("structure")}
              />
            </div>
            <div className="grid grid-rows-2 items-center relative">
              <Label htmlFor="summary" className="text-left text-base">
                Summary
              </Label>
              <Textarea
                id="summary"
                className="col-span-3"
                {...register("summary")}
              />
            </div>

            <div className="grid grid-rows-2 items-center relative">
              <Label htmlFor="detail" className="text-left text-base">
                Detail
              </Label>
              <Textarea
                id="detail"
                className="col-span-3"
                {...register("detail")}
              />
            </div>

            <div className="grid grid-rows-2 items-center relative">
              <Label htmlFor="jlptLevel" className="text-left text-base">
                jlptLevel
              </Label>
              <Input
                id="jlptLevel"
                className="col-span-3"
                {...register("jlptLevel")}
              />
            </div>
            <div className="grid grid-rows-2 items-center relative">
              <Label htmlFor="similars" className="text-left text-base">
                Similars
              </Label>
              <Input
                id="similars"
                className="col-span-3"
                {...register("similars")}
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
              {grammar && (
                <Button
                  disabled={isMutating}
                  onClick={onDeleteGrammar}
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
