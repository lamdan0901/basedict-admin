import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, SquarePen, Trash2 } from "lucide-react";

export const getColumns = (
  onEdit: (data: TQuestionMaster) => void,
  onDelete: (data: TQuestionMaster) => void
): ColumnDef<TQuestionMaster>[] => [
  {
    accessorKey: "action",
    header: () => {
      return <div className="text-center w-[80px]">Actions</div>;
    },
    cell: ({ row }) => (
      <div className="flex gap-2 w-[80px]">
        <Button
          onClick={() => {
            onEdit(row.original);
          }}
          variant="ghost"
          size={"sm"}
          className="mr-auto px-2"
        >
          <SquarePen className="w-5 h-5" />
        </Button>
        <Button
          onClick={() => {
            onDelete(row.original);
          }}
          variant="ghost"
          size={"sm"}
          className="mr-auto px-2"
        >
          <Trash2 className="w-5 h-5 text-destructive" />
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "question",
    header: () => {
      return (
        <div className="">
          <Button variant="ghost" size={"sm"}>
            Question
          </Button>
        </div>
      );
    },
    cell: ({ row }) => <div className="pl-3">{row.original.question}</div>,
  },
  {
    accessorKey: "correctAnswer",
    header: () => {
      return (
        <div className="">
          <Button variant="ghost" size={"sm"}>
            Correct Answer
          </Button>
        </div>
      );
    },
    cell: ({ row }) => <div className="pl-3">{row.original.correctAnswer}</div>,
  },
  {
    accessorKey: "source",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={"sm"}
          onClick={() => column.toggleSorting()}
        >
          Source
          {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
        </Button>
      );
    },
    cell: ({ row }) => <div className="pl-3">{row.original.source}</div>,
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={"sm"}
          onClick={() => column.toggleSorting()}
        >
          Type
          {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
        </Button>
      );
    },
    cell: ({ row }) => <div className="pl-3">{row.original.type}</div>,
  },
  {
    accessorKey: "jlptLevel",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={"sm"}
          onClick={() => column.toggleSorting()}
        >
          Jlpt Level
          {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
        </Button>
      );
    },
    cell: ({ row }) => <div className="pl-3">{row.original.jlptLevel}</div>,
  },
];
