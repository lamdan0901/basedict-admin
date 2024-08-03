"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDataTable } from "@/hooks/use-data-table";
import { useDebounce } from "@/hooks/useDebounce";
import { stringifyParams } from "@/lib/utils";
import { DeleteLexemeModal } from "@/modules/lexeme-list/DeleteLexemeModal";
import { UpsertLexemeModal } from "@/modules/lexeme-list/UpsertLexemeModal";
import { getRequest } from "@/service/data";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { ArrowUpDown, SquarePen, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

const useUrlSearchParams = () => {
  const router = useRouter();

  const setSearchParam = useCallback(
    (key: string, value: any) => {
      const searchParams = new URLSearchParams(window.location.search);

      if (value === null || value === undefined) {
        searchParams.delete(key);
      } else {
        searchParams.set(key, value);
      }

      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      router.push(newUrl, {
        scroll: false,
      });
    },
    [router]
  );

  return setSearchParam;
};

export function LexemeList() {
  const searchParams = useSearchParams();
  const setSearchParam = useUrlSearchParams();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [idsSelected, selectedIds] = useState<string[]>([]);
  const [openUpsertModal, setOpenUpsertModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedLexeme, setSelectedLexeme] = useState<TLexeme | null>(null);

  const search = searchParams.get("search") ?? "";
  const isMaster = searchParams.get("isMaster") ?? "all";
  const isApproved = searchParams.get("isApproved") ?? "all";
  const offset = searchParams.get("page") ?? 1;
  const limit = Number(searchParams.get("per_page") ?? 10);
  const [sort, orderDirection] = searchParams.get("sort")?.split(".") ?? [];

  const debouncedSearch = useDebounce(search, 400);

  // TODO: scroll only data table, not including header and footer
  // TODO: set active route for sidebar
  const { data, isLoading, mutate } = useSWR<{
    data: TLexeme[];
    total: number;
  }>(
    `/v1/lexemes?${stringifyParams({
      search: debouncedSearch,
      offset,
      limit,
      sort,
      orderDirection,
      isMaster: isMaster === "all" ? undefined : isMaster,
      isApproved: isApproved === "all" ? undefined : isApproved,
    })}`,
    getRequest
  );
  const lexemeList = data?.data ?? [];
  const total = data?.total ?? 0;

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
      header: ({ column }) => {
        return <div className="text-center w-[80px]">Actions</div>;
      },
      cell: ({ row }) => (
        <div className="flex gap-2 w-[80px]">
          <Button
            onClick={() => {
              setSelectedLexeme(row.original);
              setOpenUpsertModal(true);
            }}
            variant="ghost"
            size={"sm"}
            className="mr-auto px-2"
          >
            <SquarePen className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => {
              setSelectedLexeme(row.original);
              setOpenDeleteModal(true);
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
      header: ({ column }) => {
        return (
          <div className="">
            <Button variant="ghost" className="mx-auto" size={"sm"}>
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
      header: ({ column }) => {
        return (
          <Button variant="ghost" size={"sm"}>
            Meaning
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="pl-3">{row.original.meaning[0]?.meaning}</div>;
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

  const { table } = useDataTable({
    data: lexemeList,
    columns,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    pageCount: calculateTotalPages(total, limit) || 0,
    state: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  });

  function calculateTotalPages(totalRecords: number, rowsPerPage: number) {
    if (rowsPerPage === 0) return 1;
    return Math.ceil(totalRecords / rowsPerPage);
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
          <Button onClick={() => setOpenUpsertModal(true)} className="">
            Add new Lexeme
          </Button>
          {idsSelected.length > 0 && (
            <Button variant={"destructive"}>Delete Lexemes</Button>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex gap-2 items-center">
            <label>Master type</label>
            <Select
              onValueChange={(val) => setSearchParam("isMaster", val)}
              value={isMaster}
            >
              <SelectTrigger className="w-[125px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={"all"}>All</SelectItem>
                  <SelectItem value="true">Master</SelectItem>
                  <SelectItem value="false">Not Master</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 items-center">
            <label>Approve type</label>
            <Select
              onValueChange={(val) => setSearchParam("isApproved", val)}
              value={isApproved}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={"all"}>All</SelectItem>
                  <SelectItem value="true">Approved</SelectItem>
                  <SelectItem value="false">Not Approved</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Input
            className="w-[200px]"
            value={search}
            onChange={(e) => {
              const searchText = e.target.value;
              setSearchParam("search", searchText);
            }}
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
          // TODO: scroll only data table, not including header and footer
        />
        {/* )} */}
      </div>

      <UpsertLexemeModal
        lexeme={selectedLexeme}
        open={openUpsertModal}
        onOpenChange={(open) => {
          setOpenUpsertModal(open);
          setSelectedLexeme(null);
        }}
        mutate={mutate}
      />

      <DeleteLexemeModal
        lexeme={selectedLexeme}
        open={openDeleteModal}
        onOpenChange={(open) => {
          setOpenDeleteModal(open);
          setSelectedLexeme(null);
        }}
        mutate={mutate}
      />
    </div>
  );
}
