"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { useDataTable } from "@/hooks/useDataTable";
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";
import { stringifyParams } from "@/lib/utils";
import { DeleteReadingModal } from "@/modules/reading-list/DeleteReadingModal";
import { UpsertReadingModal } from "@/modules/reading-list/UpsertReadingModal";
import { getRequest } from "@/service/data";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { ArrowUpDown, SquarePen, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import { readingTypeMap } from "@/modules/reading-list/const";

export function ReadingList() {
  const searchParams = useSearchParams();
  const setSearchParam = useUrlSearchParams();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [openUpsertModal, setOpenUpsertModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedReading, setSelectedReading] = useState<TReading | null>(null);
  const [searchText, setSearchText] = useState("");

  const search = searchParams.get("search") ?? "";
  const isPublic = searchParams.get("isPublic") ?? "all";
  const offset = searchParams.get("page") ?? 1;
  const limit = Number(searchParams.get("per_page") ?? 10);
  const [sort, orderDirection] = searchParams.get("sort")?.split(".") ?? [];

  const { data, isLoading, mutate } = useSWR<{
    data: TReading[];
    total: number;
  }>(
    `/v1/admin/readings?${stringifyParams({
      search,
      offset,
      limit,
      sort,
      orderDirection,
      isPublic: isPublic === "all" ? undefined : isPublic,
    })}`,
    getRequest
  );
  const readingList = data?.data ?? [];
  const total = data?.total ?? 0;

  const columns: ColumnDef<TReading>[] = [
    {
      accessorKey: "action",
      header: ({ column }) => {
        return <div className="text-center w-[80px]">Actions</div>;
      },
      cell: ({ row }) => (
        <div className="flex gap-2 w-[80px]">
          <Button
            onClick={() => {
              setSelectedReading(row.original);
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
              setSelectedReading(row.original);
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
        <div className="max-w-[500px] truncate pl-3">
          {row.original.japanese}
        </div>
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
      accessorKey: "public",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size={"sm"}
            onClick={() => column.toggleSorting()}
          >
            Public
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

  const { table } = useDataTable({
    data: readingList,
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

  return (
    <div>
      <div className="border-b my-4 pb-2">
        <h2 className="text-xl font-semibold">Reading list</h2>
      </div>
      <div className="flex justify-between items-center mb-4 ">
        <div className="flex gap-4 items-center">
          <Button onClick={() => setOpenUpsertModal(true)} className="">
            Add new Reading
          </Button>
        </div>

        <div className="flex gap-4">
          <Select
            onValueChange={(isPublic) => {
              setSearchParam({ isPublic, page: 1 });
            }}
            value={isPublic}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"all"}>All</SelectItem>
                <SelectItem value="true">Public</SelectItem>
                <SelectItem value="false">Not Public</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            className="w-[200px]"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setSearchParam({ search: e.target.value, page: 1 });
            }}
            type="search"
            placeholder="Search..."
          />
        </div>
      </div>

      <DataTable
        table={table}
        colSpan={columns.length}
        isLoading={isLoading}
        className="h-[calc(100vh-213px)] overflow-auto"
      />

      <UpsertReadingModal
        reading={selectedReading}
        open={openUpsertModal}
        onOpenChange={(open) => {
          setOpenUpsertModal(open);
          setSelectedReading(null);
        }}
        mutate={mutate}
        onDeleteReading={() => {
          setOpenDeleteModal(true);
        }}
      />

      <DeleteReadingModal
        reading={selectedReading}
        open={openDeleteModal}
        onOpenChange={(open) => {
          setOpenDeleteModal(open);
          setSelectedReading(null);
          if (openUpsertModal) {
            setOpenUpsertModal(false);
          }
        }}
        mutate={mutate}
      />
    </div>
  );
}
