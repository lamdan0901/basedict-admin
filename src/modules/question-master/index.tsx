"use client";

import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { useDataTable } from "@/hooks/useDataTable";
import { calculateTotalPages, stringifyParams } from "@/lib/utils";
import { getColumns } from "@/modules/question-master/column";
import { DataTableFilters } from "@/modules/question-master/DataTableFilters";
import { DeleteQuestionModal } from "@/modules/question-master/DeleteQuestionModal";
import { UpsertQuestionModal } from "@/modules/question-master/UpsertQuestionModal";
import { getRequest } from "@/service/data";
import { RowSelectionState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export function QuestionMaster() {
  const searchParams = useSearchParams();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [openUpsertModal, setOpenUpsertModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<TQuestionMaster | null>(null);

  const search = searchParams.get("search") ?? "";
  const jlptLevel = searchParams.get("jlptLevel") ?? "N3";
  const type = searchParams.get("type") ?? "all";
  const source = searchParams.get("source") ?? "all";
  const offset = searchParams.get("page") ?? 1;
  const limit = Number(searchParams.get("per_page") ?? 10);
  const [sort, orderDirection] = searchParams.get("sort")?.split(".") ?? [];

  const { data, isLoading, mutate } = useSWR<{
    data: TQuestionMaster[];
    total: number;
  }>(
    `/v1/admin/question-masters?${stringifyParams({
      search,
      offset,
      limit,
      sort,
      orderDirection,
      jlptLevel: jlptLevel === "all" ? undefined : jlptLevel,
      type: type === "all" ? undefined : type,
      source: source === "all" ? undefined : source,
    })}`,
    getRequest
  );
  const questionMasters = data?.data ?? [];
  const total = data?.total ?? 0;

  const columns = getColumns(
    (data) => {
      setSelectedQuestion(data);
      setOpenUpsertModal(true);
    },
    (data) => {
      setSelectedQuestion(data);
      setOpenDeleteModal(true);
    }
  );

  const { table } = useDataTable({
    data: questionMasters,
    columns,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    pageCount: calculateTotalPages(total, limit) || 0,
    state: {
      pagination: { pageIndex: Number(offset) - 1, pageSize: limit },
    },
  });

  return (
    <div>
      <h2 className="text-xl border-b my-4 pb-2 font-semibold">
        Question Master List
      </h2>
      <div className="flex justify-between items-center mb-4 ">
        <Button onClick={() => setOpenUpsertModal(true)} className="">
          Add new Question
        </Button>
        <DataTableFilters />
      </div>

      <DataTable
        table={table}
        colSpan={columns.length}
        isLoading={isLoading}
        className="h-[calc(100vh-241px)] overflow-auto"
      />

      <UpsertQuestionModal
        question={selectedQuestion}
        open={openUpsertModal}
        onOpenChange={(open) => {
          setOpenUpsertModal(open);
          setSelectedQuestion(null);
        }}
        mutate={mutate}
        onDeleteQuestion={() => {
          setOpenDeleteModal(true);
        }}
      />

      <DeleteQuestionModal
        question={selectedQuestion}
        open={openDeleteModal}
        onOpenChange={(open) => {
          setOpenDeleteModal(open);
          setSelectedQuestion(null);
          if (openUpsertModal) {
            setOpenUpsertModal(false);
          }
        }}
        mutate={mutate}
      />
    </div>
  );
}
