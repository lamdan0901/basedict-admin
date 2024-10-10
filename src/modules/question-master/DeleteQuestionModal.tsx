import { deleteRequest } from "@/service/data";
import React from "react";
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
import { KeyedMutator } from "swr";

type DeleteQuestionModalProps = {
  open: boolean;
  onOpenChange(open: boolean): void;
  question: TQuestionMaster | null;
  mutate: KeyedMutator<{
    data: TQuestionMaster[];
    total: number;
  }>;
  id?: string;
};

export function DeleteQuestionModal({
  mutate,
  question,
  open,
  onOpenChange,
}: DeleteQuestionModalProps) {
  const { toast } = useToast();
  const { trigger: deleteQuestion, isMutating: isDeletingQuestion } =
    useSWRMutation(`/v1/admin/question-masters/${question?.id}`, deleteRequest);

  async function deleteGrammar() {
    try {
      await deleteQuestion();
      toast({
        title: "Deleted",
      });
      onOpenChange(false);
      mutate();
    } catch (err) {
      toast({
        title: "Cannot delete, please try again",
        variant: "destructive",
      });
      console.error("err : ", err);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby=""
        className="lg:min-w-[425px] w-full !pb-[80px] max-h-[100dvh] sm:min-w-[825px] min-w-full"
      >
        <DialogHeader>
          <DialogTitle>Delete question master </DialogTitle>
        </DialogHeader>
        <div>
          Do you want to delete this question?
          <br />
          Question: <span className="font-medium">{question?.question}</span>
        </div>
        <DialogFooter className="sm:mt-6 fixed left-1/2 bottom-[20px] -translate-x-1/2 mt-3 sm:justify-center sm:space-x-4">
          <Button
            type="button"
            disabled={isDeletingQuestion}
            variant={"destructive"}
            onClick={deleteGrammar}
          >
            Delete
          </Button>
          <Button
            disabled={isDeletingQuestion}
            onClick={() => onOpenChange(false)}
            type="button"
            variant={"outline"}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
