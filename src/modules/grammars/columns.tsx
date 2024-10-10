import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, SquarePen, Trash2 } from "lucide-react";

export const getColumns = (
  onEdit: (data: TGrammar) => void,
  onDelete: (data: TGrammar) => void
): ColumnDef<TGrammar>[] => [
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
    accessorKey: "grammar",
    header: () => {
      return (
        <div className="">
          <Button variant="ghost" size={"sm"}>
            Grammar
          </Button>
        </div>
      );
    },
    cell: ({ row }) => <div className="pl-3">{row.original.grammar}</div>,
  },
  {
    accessorKey: "meaning",
    header: () => {
      return (
        <div className="">
          <Button variant="ghost" size={"sm"}>
            Meaning
          </Button>
        </div>
      );
    },
    cell: ({ row }) => <div className="pl-3">{row.original.meaning}</div>,
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
          jlptLevel
          {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
        </Button>
      );
    },
    cell: ({ row }) => <div className="pl-3">{row.original.jlptLevel}</div>,
  },
];
