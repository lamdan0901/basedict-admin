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

type DeleteLexemeModalProps = {
  open: boolean;
  onOpenChange(open: boolean): void;
  lexeme: TLexeme | null;
  mutate: any;
  id?: string;
};

export function DeleteLexemeModal({
  mutate,
  lexeme,
  open,
  onOpenChange,
}: DeleteLexemeModalProps) {
  const { toast } = useToast();
  const { trigger: lexemeDeleteTrigger, isMutating: isDeletingLexeme } =
    useSWRMutation(`/v1/lexemes/${lexeme?.id}`, deleteRequest);

  async function deleteLexeme() {
    try {
      await lexemeDeleteTrigger();
      toast({
        title: "Lexeme deleted",
      });
      onOpenChange(false);
      mutate();
    } catch (err) {
      toast({
        title: "Cannot delete lexeme, please try again",
        variant: "destructive",
      });
      console.error("err deleteLexeme: ", err);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby=""
        className="lg:min-w-[425px] w-full !pb-[80px] max-h-[100dvh] sm:min-w-[825px] min-w-full"
      >
        <DialogHeader>
          <DialogTitle>Delete Lexeme</DialogTitle>
        </DialogHeader>
        <div>
          Do you want to delete this lexeme?{" "}
          <ul>
            <li className="">Lexeme: {lexeme?.lexeme}</li>
            <li>Is Master: {lexeme?.is_master ? "True" : "False"}</li>
          </ul>
        </div>
        <DialogFooter className="sm:mt-6 fixed left-1/2 bottom-[20px] -translate-x-1/2 mt-3 sm:justify-center sm:space-x-4">
          <Button
            type="button"
            disabled={isDeletingLexeme}
            variant={"destructive"}
            onClick={deleteLexeme}
          >
            Delete
          </Button>
          <Button
            disabled={isDeletingLexeme}
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
