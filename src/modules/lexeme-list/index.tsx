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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDataTable } from "@/hooks/useDataTable";
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";
import { stringifyParams } from "@/lib/utils";
import { DeleteLexemeModal } from "@/modules/lexeme-list/DeleteLexemeModal";
import { EditMeaningModal } from "@/modules/lexeme-list/EditMeaningModal";
import { UpsertLexemeModal } from "@/modules/lexeme-list/UpsertLexemeModal";
import { getRequest } from "@/service/data";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { ArrowUpDown, SquarePen, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export function LexemeList() {
  const searchParams = useSearchParams();
  const setSearchParam = useUrlSearchParams();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [idsSelected, selectedIds] = useState<string[]>([]);
  const [openUpsertModal, setOpenUpsertModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditMeaningModal, setOpenEditMeaningModal] = useState(false);
  const [selectedLexeme, setSelectedLexeme] = useState<TLexeme | null>(null);
  const [searchText, setSearchText] = useState("");

  const search = searchParams.get("search") ?? "";
  const isMaster = searchParams.get("isMaster") ?? "all";
  const isApproved = searchParams.get("isApproved") ?? "all";
  const offset = searchParams.get("page") ?? 1;
  const limit = Number(searchParams.get("per_page") ?? 10);
  const [sort, orderDirection] = searchParams.get("sort")?.split(".") ?? [];

  // TODO: scroll only data table, not including header and footer
  // TODO: set active route for sidebar
  const { data, isLoading, mutate } = useSWR<{
    data: TLexeme[];
    total: number;
  }>(
    `/v1/lexemes?${stringifyParams({
      search,
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
      header: ({ column }) => {
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
                setSelectedLexeme(row.original);
                setOpenEditMeaningModal(true);
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
    // {
    //   accessorKey: "word_origin",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         size={"sm"}
    //         onClick={() => column.toggleSorting()}
    //       >
    //         Word Origin
    //         {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
    //       </Button>
    //     );
    //   },
    //   cell: ({ row }) => <div className="pl-3">{row.original.word_origin}</div>,
    // },
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
      pagination: { pageIndex: Number(offset) - 1, pageSize: limit },
    },
  });

  function calculateTotalPages(totalRecords: number, rowsPerPage: number) {
    if (rowsPerPage === 0) return 1;
    return Math.ceil(totalRecords / rowsPerPage);
  }

  function afterDeleteIds(articleIds: string[]) {
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
              onValueChange={(isMaster) => {
                setSearchParam({ isMaster, page: 1 });
              }}
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
              onValueChange={(isApproved) => {
                setSearchParam({ isApproved, page: 1 });
              }}
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
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchParam({ search: searchText, page: 1 });
              }
            }}
            type="search"
            placeholder="Enter to search..."
          />
        </div>
      </div>

      <DataTable
        table={table}
        colSpan={columns.length}
        isLoading={isLoading}
        className="h-[calc(100vh-213px)] overflow-auto"
        // TODO: scroll only data table, not including header and footer
      />

      <UpsertLexemeModal
        lexeme={selectedLexeme}
        open={openUpsertModal}
        onOpenChange={(open) => {
          setOpenUpsertModal(open);
          setSelectedLexeme(null);
        }}
        mutate={mutate}
        onDeleteLexeme={() => {
          setOpenDeleteModal(true);
        }}
      />

      <DeleteLexemeModal
        lexeme={selectedLexeme}
        open={openDeleteModal}
        onOpenChange={(open) => {
          setOpenDeleteModal(open);
          setSelectedLexeme(null);
          if (openUpsertModal) {
            setOpenUpsertModal(false);
          }
        }}
        mutate={mutate}
      />

      <EditMeaningModal
        lexeme={selectedLexeme}
        open={openEditMeaningModal}
        onOpenChange={(open) => {
          setOpenEditMeaningModal(open);
          setSelectedLexeme(null);
        }}
        mutate={mutate}
      />
    </div>
  );
}
