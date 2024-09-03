"use client";

import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { useDataTable } from "@/hooks/useDataTable";
import { stringifyParams } from "@/lib/utils";
import { getColumns } from "@/modules/reading-list/columns";
import { DataTableFilters } from "@/modules/reading-list/DataTableFilters";
import { DeleteReadingModal } from "@/modules/reading-list/DeleteReadingModal";
import { UpsertReadingModal } from "@/modules/reading-list/UpsertReadingModal";
import { getRequest } from "@/service/data";
import { RowSelectionState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export function ReadingList() {
  const searchParams = useSearchParams();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [openUpsertModal, setOpenUpsertModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedReading, setSelectedReading] = useState<TReading | null>(null);

  // const isPublic = searchParams.get("isPublic") ?? "all";
  const search = searchParams.get("search") ?? "";
  const offset = searchParams.get("page") ?? 1;
  const limit = Number(searchParams.get("per_page") ?? 10);
  const [sort, orderDirection] = searchParams.get("sort")?.split(".") ?? [];
  const jlptLevel = searchParams.get("jlptLevel") ?? "all";
  const readingType = searchParams.get("readingType") ?? "all";
  const examId = searchParams.get("examId") ?? "all";
  const source = searchParams.get("source") ?? "all";

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
      // isPublic: isPublic === "all" ? undefined : isPublic,
      source: source === "all" ? undefined : source,
      examId: examId === "all" ? undefined : examId,
      readingType: readingType === "all" ? undefined : readingType,
      jlptLevel: jlptLevel === "all" ? undefined : jlptLevel,
    })}`,
    getRequest
  );
  const readingList = data?.data ?? [];
  const total = data?.total ?? 0;

  const columns = getColumns(
    (data: TReading) => {
      setSelectedReading(data);
      setOpenUpsertModal(true);
    },
    (data: TReading) => {
      setSelectedReading(data);
      setOpenDeleteModal(true);
    }
  );

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
      <div className="flex justify-between w-full items-end mb-6 ">
        <Button onClick={() => setOpenUpsertModal(true)} className="">
          Add new Reading
        </Button>
        <DataTableFilters />
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
