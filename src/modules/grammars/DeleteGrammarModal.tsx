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

type DeleteGrammarModalProps = {
  open: boolean;
  onOpenChange(open: boolean): void;
  grammar: TGrammar | null;
  mutate: any;
  id?: string;
};

export function DeleteGrammarModal({
  mutate,
  grammar,
  open,
  onOpenChange,
}: DeleteGrammarModalProps) {
  const { toast } = useToast();
  const { trigger: lexemeGrammarTrigger, isMutating: isDeletingGrammar } =
    useSWRMutation(`/v1/grammars/${grammar?.id}`, deleteRequest);

  async function deleteGrammar() {
    try {
      await lexemeGrammarTrigger();
      toast({
        title: "grammar deleted",
      });
      onOpenChange(false);
      mutate();
    } catch (err) {
      toast({
        title: "Cannot delete grammar, please try again",
        variant: "destructive",
      });
      console.error("err deleteGrammar: ", err);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby=""
        className="lg:min-w-[425px] w-full !pb-[80px] max-h-[100dvh] sm:min-w-[825px] min-w-full"
      >
        <DialogHeader>
          <DialogTitle>Grammar Lexeme</DialogTitle>
        </DialogHeader>
        <div>
          Do you want to delete this Grammar?{" "}
          <ul>
            <li className="">Grammar: {grammar?.grammar}</li>
          </ul>
        </div>
        <DialogFooter className="sm:mt-6 fixed left-1/2 bottom-[20px] -translate-x-1/2 mt-3 sm:justify-center sm:space-x-4">
          <Button
            type="button"
            disabled={isDeletingGrammar}
            variant={"destructive"}
            onClick={deleteGrammar}
          >
            Delete
          </Button>
          <Button
            disabled={isDeletingGrammar}
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
