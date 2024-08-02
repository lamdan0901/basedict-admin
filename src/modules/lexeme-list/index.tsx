"use client";

import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { stringifyParams } from "@/lib/utils";
import { getRequest } from "@/service/data";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, SquarePen, Trash2 } from "lucide-react";
import useSWR from "swr";

export function LexemeList() {
  const params = {
    search: "",
    offset: 1,
    limit: 10,
    sort: "hiragana",
    orderDirection: "asc",
    isMaster: false,
  };

  const { data, error, isLoading } = useSWR<TLexeme[]>(
    `/v1/words?${stringifyParams(params)}`,
    getRequest
  );
  console.log("data", data);

  const columns: ColumnDef<TLexeme>[] = [
    {
      accessorKey: "action",
      header: ({ column }) => {
        return <div className="text-center w-[100px]">Actions</div>;
      },
      cell: ({ row }) => (
        <div className="flex gap-2 w-[100px]">
          <Button variant="ghost" size={"sm"} className="mr-auto px-2">
            <SquarePen />
          </Button>
          <Button variant="ghost" size={"sm"} className="mr-auto px-2">
            <Trash2 className=" text-destructive" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "lexeme",
      header: ({ column }) => {
        return (
          <div className="flex  w-full">
            <Button
              variant="ghost"
              size={"sm"}
              onClick={() => column.toggleSorting()}
              className="mr-auto text-left"
            >
              Lexeme
              {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="w-[150px] text-left text-xs font-medium text-muted-foreground">
          {row.original.lexeme}
        </div>
      ),
    },
    {
      accessorKey: "hiragana",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size={"sm"}
            onClick={() => column.toggleSorting()}
          >
            Hiragana
            {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center font-medium">{row.original.hiragana}</div>
      ),
    },
    {
      accessorKey: "hanviet",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size={"sm"}
            onClick={() => column.toggleSorting()}
          >
            Hán việt
            {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center font-medium">{row.original.hanviet}</div>
      ),
    },
    {
      accessorKey: "context", // !!
      header: ({ column }) => {
        return (
          <Button variant="ghost" size={"sm"}>
            Context
          </Button>
        );
      },
      cell: ({ row }) => <div className="text-center font-medium">context</div>,
    },
    {
      accessorKey: "meaning",
      header: ({ column }) => {
        return (
          <Button variant="ghost" size={"sm"}>
            Meaning
          </Button>
        );
      },
      cell: ({ row }) => {
        return row.original.meaning.map(({ meaning }, i) => (
          <div key={i} className="text-center font-medium">
            {meaning}
          </div>
        ));
      },
    },
    {
      accessorKey: "oldLevel", // !!
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
        <div className="text-center font-medium">old Level</div>
      ),
    },
    {
      accessorKey: "wordOrigin", // !!
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size={"sm"}
            onClick={() => column.toggleSorting()}
          >
            Word Origin
            {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center font-medium">word Origin</div>
      ),
    },
    {
      accessorKey: "ranking", // !!
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
        <div className="text-center font-medium">frequency Ranking</div>
      ),
    },
    {
      accessorKey: "master", // !!
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size={"sm"}
            onClick={() => column.toggleSorting()}
          >
            Is Master
            {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center font-medium">is Master?</div>
      ),
    },
  ];

  return (
    <div>
      list
      <div className="h-full overflow-auto">
        {isLoading ? (
          <div className="mt-4 flex flex-col items-center justify-center text-black">
            Loading...
          </div>
        ) : (
          <DataTable data={data || []} columns={columns} className="mt-2" />
        )}
      </div>
    </div>
  );
}
