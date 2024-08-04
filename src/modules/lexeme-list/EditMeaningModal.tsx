import { v4 as uuid } from "uuid";
import React, { useEffect } from "react";
import useSWRMutation from "swr/mutation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { meaningSchema, TMeaningFormData } from "@/modules/lexeme-list/schemas";
import { z } from "zod";
import { patchRequest } from "@/service/data";
import { MeaningForm } from "@/modules/lexeme-list/MeaningForm";

type EditMeaningModalProps = {
  open: boolean;
  onOpenChange(open: boolean): void;
  lexeme: TLexeme | null;
  mutate: any;
};

export function EditMeaningModal({
  mutate,
  lexeme,
  open,
  onOpenChange,
}: EditMeaningModalProps) {
  const { toast } = useToast();
  const form = useForm<{ meaning: TMeaningFormData[] }>({
    mode: "all",
    resolver: zodResolver(z.object({ meaning: z.array(meaningSchema) })),
  });
  const { handleSubmit, reset } = form;

  const { trigger: lexemePatchTrigger, isMutating: isPatchingLexeme } =
    useSWRMutation(`/v1/lexemes/${lexeme?.id}`, patchRequest);

  async function updateMeaning({ meaning }: { meaning: TMeaningFormData[] }) {
    try {
      meaning.forEach((m) => {
        delete m.uuid;
      });

      await lexemePatchTrigger({ meaning });
      toast({
        title: "Meaning updated",
      });
      onOpenChange(false);
      mutate();
    } catch (err) {
      toast({
        title: "Cannot update meaning, please try again",
        variant: "destructive",
      });
      console.error("err updateMeaning: ", err);
    }
  }

  useEffect(() => {
    if (lexeme?.meaning.length) {
      reset({
        meaning: lexeme.meaning.map((m) => ({
          ...m,
          uuid: uuid(),
        })),
      });
    } else {
      reset({
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
    }
  }, [lexeme, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby=""
        className="lg:min-w-[1125px] !pb-[80px] max-h-[100dvh] sm:min-w-[825px] min-w-full"
      >
        <form onSubmit={handleSubmit(updateMeaning)}>
          <DialogHeader>
            <DialogTitle>Update Meaning</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto h-fit max-h-[calc(100dvh-144px)]">
            <FormProvider {...form}>
              <MeaningForm />
            </FormProvider>
          </div>
          <DialogFooter className="sm:mt-6 fixed left-1/2 bottom-[20px] -translate-x-1/2 mt-3 sm:justify-center sm:space-x-4">
            <Button type="submit" disabled={isPatchingLexeme}>
              Update
            </Button>
            <Button
              disabled={isPatchingLexeme}
              onClick={() => onOpenChange(false)}
              type="button"
              variant={"outline"}
            >
              Back
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
