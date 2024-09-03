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

type DeleteReadingModalProps = {
  open: boolean;
  onOpenChange(open: boolean): void;
  reading: TReading | null;
  mutate: any;
  id?: string;
};

export function DeleteReadingModal({
  mutate,
  reading,
  open,
  onOpenChange,
}: DeleteReadingModalProps) {
  const { toast } = useToast();
  const { trigger: readingDeleteTrigger, isMutating: isDeletingReading } =
    useSWRMutation(`/v1/admin/readings/${reading?.id}`, deleteRequest);

  async function deleteReading() {
    try {
      await readingDeleteTrigger();
      toast({
        title: "Reading deleted",
      });
      onOpenChange(false);
      mutate();
    } catch (err) {
      toast({
        title: "Cannot delete reading, please try again",
        variant: "destructive",
      });
      console.error("err deleteReading: ", err);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby=""
        className="lg:min-w-[425px] w-full !pb-[80px] max-h-[100dvh] sm:min-w-[825px] min-w-full"
      >
        <DialogHeader>
          <DialogTitle>Delete Reading</DialogTitle>
        </DialogHeader>
        <div>
          Do you want to delete this reading?{" "}
          <ul>
            <li className="">Reading: {reading?.title}</li>
          </ul>
        </div>
        <DialogFooter className="sm:mt-6 fixed left-1/2 bottom-[20px] -translate-x-1/2 mt-3 sm:justify-center sm:space-x-4">
          <Button
            type="button"
            disabled={isDeletingReading}
            variant={"destructive"}
            onClick={deleteReading}
          >
            Delete
          </Button>
          <Button
            disabled={isDeletingReading}
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
