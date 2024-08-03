"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDataTable } from "@/hooks/use-data-table";
import { useDebounce } from "@/hooks/useDebounce";
import { stringifyParams } from "@/lib/utils";
import { getRequest } from "@/service/data";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { ArrowUpDown, SquarePen, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import { z } from "zod";

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  title: z.string().optional(),
  status: z.string().optional(),
});

export function LexemeList() {
  const searchParams = useSearchParams();
  const { page, per_page } = searchParamsSchema.parse({
    page: searchParams.get("page"),
    per_page: searchParams.get("per_page"),
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [idsSelected, selectedIds] = useState<string[]>([]);
  const [params, setParams] = useState({
    search: "", // あ
    offset: 1,
    limit: 10,
    sort: undefined, // this value from the selected col to sort
    orderDirection: undefined,
    isMaster: false,
    isApproved: false,
  });

  const debouncedSearch = useDebounce(params.search, 1000);

  // TODO: all the query and pagination saved on url search params ??
  const { data, isLoading } = useSWR<{ data: TLexeme[]; total: number }>(
    `/v1/lexemes?${stringifyParams({
      ...params,
      search: debouncedSearch,
      offset: page,
      limit: per_page,
    })}`,
    getRequest
  );
  const lexemeList = data?.data ?? [];
  const total = data?.total ?? 0;

  console.log("render");

  // TODO: scroll only data table, not including header and footer

  const columns: ColumnDef<TLexeme>[] = [
    {
      id: "select",
      enablePinning: true,
      header: ({ table }) => (
        <Checkbox
          className="mt-1"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => {
            setTimeout(() => {
              const rowDataIds = table
                .getSelectedRowModel()
                .rows.map((row) => row.original.id);
              selectedIds(rowDataIds);
            });
            table.toggleAllPageRowsSelected(!!value);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.getIsSelected()}
            className="mt-1"
            onCheckedChange={(value) => {
              if (value) {
                selectedIds([...idsSelected, row.original.id]);
              } else {
                selectedIds(idsSelected.filter((id) => id !== row.original.id));
              }
              row.toggleSelected(!!value);
            }}
            aria-label="Select row"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "action",
      enablePinning: true,
      header: ({ column }) => {
        return <div className="text-center w-[80px]">Actions</div>;
      },
      cell: ({ row }) => (
        <div className="flex gap-2 w-[80px]">
          <Button variant="ghost" size={"sm"} className="mr-auto px-2">
            <SquarePen className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size={"sm"} className="mr-auto px-2">
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
      header: ({ column }) => {
        return (
          <div className="">
            <Button variant="ghost" className="mx-auto" size={"sm"}>
              Context
            </Button>
          </div>
        );
      },
      cell: ({ row }) =>
        row.original.meaning.map(({ context }, i) => (
          <div key={i} className="pl-3">
            {context}
          </div>
        )),
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
          <div key={i} className="pl-3">
            {meaning}
          </div>
        ));
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
      accessorKey: "word_origin",
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
      cell: ({ row }) => <div className="pl-3">{row.original.word_origin}</div>,
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
            Is Master
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
            Is Approved
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

  const { table } = useDataTable({
    data: lexemeList,
    columns,
    pageCount: calculateTotalPages(total, per_page) || 0,
    state: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    /* */
  });

  function calculateTotalPages(totalRecords: number, rowsPerPage: number) {
    if (rowsPerPage === 0) return 1;
    return Math.ceil(totalRecords / rowsPerPage);
  }

  // const table = useReactTable({
  //   data: lexemeList,
  //   columns,
  //   onSortingChange: setSorting,
  //   onColumnFiltersChange: setColumnFilters,
  //   getCoreRowModel: getCoreRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   onColumnVisibilityChange: setColumnVisibility,
  //   onRowSelectionChange: setRowSelection,
  //   state: {
  //     sorting,
  //     columnFilters,
  //     columnVisibility,
  //     rowSelection,
  //     pagination: {
  //       pageIndex: Math.max((params.offset || 1) - 1, 0),
  //       pageSize: total || 0,
  //     },
  //   },
  // });

  // function handlePaginationChange(updater: Updater<PaginationState>) {
  //   const newPagination = updater(table.getState().pagination);
  //   console.log("newPagination: ", newPagination);
  //   if (newPagination.pageIndex > params.offset - 2)
  //     updateParams("offset", newPagination.pageIndex + 2);
  //   else updateParams("offset", newPagination.pageIndex);
  //   // const pageIndex = table.getState().pagination.pageIndex + 1;
  //   // updateParams("offset", pageIndex + 1);
  //   // table.setState((prev) => ({
  //   //   ...prev,
  //   //   pagination: { ...prev.pagination, pageIndex },
  //   // }));
  // }

  // useEffect(() => {
  //   if (pageIndex === params.offset) {
  //     table.setState((prev) => ({
  //       ...prev,
  //       pagination: { ...prev.pagination, pageIndex: params.offset - 1 },
  //     }));
  //   }
  // }, [pageIndex, params.offset, table]);

  // useEffect(() => {
  //   function calculateTotalPages(totalRecords: number, rowsPerPage: number) {
  //     if (rowsPerPage === 0) return 1;
  //     return Math.ceil(totalRecords / rowsPerPage);
  //   }
  //   if (total >= 0)
  //     table.setOptions((prev) => ({
  //       ...prev,
  //       pageCount: calculateTotalPages(total, rowsPerPage),
  //     }));
  // }, [table, total]);

  function updateParams(name: string, value: any) {
    setParams((prev) => ({ ...prev, [name]: value }));
  }

  function afterDelete(articleIds: string[]) {
    const articleIndexes = [1, 2, 3];

    setRowSelection((prev) => {
      articleIndexes.forEach((i) => {
        delete prev[i];
      });
      return { ...prev };
    });
    selectedIds((prev) =>
      prev.filter((currentId) => !articleIds.includes(currentId))
    );
  }

  // ! chỉ test update trên những cái master false

  return (
    <div>
      <div className="border-b my-4 pb-2">
        <h2 className="text-xl font-semibold">Lexeme list</h2>
      </div>
      <div className="flex justify-between items-center mb-4 ">
        <div className="flex gap-4 items-center">
          <Button className="">Add new Lexeme</Button>
          {idsSelected.length > 0 && (
            <Button variant={"destructive"}>Delete Lexemes</Button>
          )}
        </div>
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              onCheckedChange={(checked) => updateParams("isMaster", checked)}
              id="airplane-mode"
            />
            <Label htmlFor="airplane-mode">Is Master</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="airplane-mode"
              onCheckedChange={(checked) => updateParams("isApproved", checked)}
            />
            <Label htmlFor="airplane-mode">Is Approved</Label>
          </div>
          <Input
            className="w-[200px]"
            value={[params.search]}
            onChange={(e) =>
              setParams((prev) => ({ ...prev, search: e.target.value }))
            }
            type="search"
            placeholder="Search..."
          />
        </div>
      </div>
      <div className="h-full overflow-auto">
        {/* {isLoading ? (
          <div className="mt-4 flex flex-col items-center justify-center text-black">
            Loading...
          </div>
        ) : ( */}
        <DataTable
          table={table}
          colSize={columns.length}
          className="h-[calc(100vh-213px)] overflow-auto"
          //TODO: controlled pagination...
          // TODO: scroll only data table, not including header and footer
        />
        {/* )} */}
      </div>
    </div>
  );
}
