import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, SquarePen, Trash2 } from "lucide-react";

export const getColumns = (
  onEdit: (data: TLexeme) => void,
  onEditMeaning: (data: TLexeme) => void,
  onDelete: (data: TLexeme) => void
): ColumnDef<TLexeme>[] => [
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
    accessorKey: "lexeme",
    header: ({ column }) => {
      return (
        <div className="">
          <Button
            variant="ghost"
            size={"sm"}
            onClick={() => column.toggleSorting()}
          >
            Lexeme
            {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      );
    },
    cell: ({ row }) => <div className="pl-3">{row.original.lexeme}</div>,
  },
  {
    accessorKey: "standard",
    header: ({ column }) => {
      return (
        <div className="">
          <Button
            variant="ghost"
            size={"sm"}
            onClick={() => column.toggleSorting()}
          >
            Standard
            {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      );
    },
    cell: ({ row }) => <div className="pl-3">{row.original.standard}</div>,
  },
  {
    accessorKey: "hiragana",
    header: ({ column }) => {
      return (
        <div className="">
          <Button
            variant="ghost"
            size={"sm"}
            onClick={() => column.toggleSorting()}
          >
            Hiragana
            {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      );
    },
    cell: ({ row }) => <div className="pl-3">{row.original.hiragana}</div>,
  },
  {
    accessorKey: "hanviet",
    header: ({ column }) => {
      return (
        <div className="">
          <Button
            variant="ghost"
            size={"sm"}
            onClick={() => column.toggleSorting()}
          >
            Hán việt
            {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      );
    },
    cell: ({ row }) => <div className="pl-3">{row.original.hanviet}</div>,
  },
  {
    accessorKey: "context",
    header: () => {
      return (
        <div className="">
          <Button variant="ghost" size={"sm"}>
            Context
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="pl-3">{row.original.meaning[0]?.context}</div>
    ),
  },
  {
    accessorKey: "meaning",
    header: () => {
      return (
        <Button variant="ghost" size={"sm"}>
          Meaning
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="pl-3 relative w-[200px]">
          {row.original.meaning[0]?.meaning}
          <Button
            onClick={() => {
              onEditMeaning(row.original);
            }}
            variant="ghost"
            size={"sm"}
            className="absolute top-1/2 -translate-y-1/2 -right-4 px-2"
          >
            <SquarePen className="w-5 h-5" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "old_jlpt_level",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={"sm"}
          onClick={() => column.toggleSorting()}
        >
          Old Level
          {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="pl-3">{row.original.old_jlpt_level}</div>
    ),
  },
  {
    accessorKey: "frequency_ranking",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={"sm"}
          onClick={() => column.toggleSorting()}
        >
          Frequency Ranking
          {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="pl-3">{row.original.frequency_ranking}</div>
    ),
  },
  {
    accessorKey: "isMaster",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={"sm"}
          onClick={() => column.toggleSorting()}
        >
          Master
          {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="pl-3">
        {row.original.is_master ? "master" : "not master"}
      </div>
    ),
  },
  {
    accessorKey: "isApproved",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={"sm"}
          onClick={() => column.toggleSorting()}
        >
          Approved
          {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="pl-3">
        {row.original.approved ? "approved" : "not approved"}
      </div>
    ),
  },
];
