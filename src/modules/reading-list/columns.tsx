import { Button } from "@/components/ui/button";
import { readingTypeMap, testPeriodsMap } from "@/modules/reading-list/const";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, SquarePen, Trash2 } from "lucide-react";

export const getColumns = (
  onEdit: (data: TReading) => void,
  onDelete: (data: TReading) => void
): ColumnDef<TReading>[] => [
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
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <div className="">
          <Button variant="ghost" size={"sm"}>
            Title
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="pl-3 min-w-[100px]">{row.original.title}</div>
    ),
  },
  {
    accessorKey: "content",
    header: ({ column }) => {
      return (
        <Button variant="ghost" size={"sm"}>
          Content
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="max-w-[500px] truncate pl-3">{row.original.japanese}</div>
    ),
  },
  {
    accessorKey: "readingType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={"sm"}
          onClick={() => column.toggleSorting()}
        >
          Reading Type
          {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="pl-3">{readingTypeMap[row.original.readingType]}</div>
    ),
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
  {
    accessorKey: "isJlpt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={"sm"}
          onClick={() => column.toggleSorting()}
        >
          Jlpt Test Period
          {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="pl-3">
        {row.original.isJlpt
          ? testPeriodsMap[row.original.examCode]
          : "Not Jlpt Test"}
      </div>
    ),
  },
  {
    accessorKey: "public",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={"sm"}
          onClick={() => column.toggleSorting()}
        >
          Is Public
          {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="pl-3">
        {row.original.public ? "Public" : "Not Public"}
      </div>
    ),
  },
];
