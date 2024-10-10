"use client";

import { Button } from "@/components/ui/button";
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
import { calculateTotalPages, stringifyParams } from "@/lib/utils";
import { DeleteLexemeModal } from "@/modules/lexeme-list/DeleteLexemeModal";
import { EditMeaningModal } from "@/modules/lexeme-list/EditMeaningModal";
import { UpsertLexemeModal } from "@/modules/lexeme-list/UpsertLexemeModal";
import { getColumns } from "@/modules/lexeme-list/columns";
import { getRequest } from "@/service/data";
import { RowSelectionState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export function LexemeList() {
  const searchParams = useSearchParams();
  const setSearchParam = useUrlSearchParams();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [openUpsertModal, setOpenUpsertModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditMeaningModal, setOpenEditMeaningModal] = useState(false);
  const [selectedLexeme, setSelectedLexeme] = useState<TLexeme | null>(null);
  const [searchText, setSearchText] = useState("");

  const search = searchParams.get("search") ?? "";
  const isMaster = searchParams.get("isMaster") ?? "all";
  const isApproved = searchParams.get("isApproved") ?? "all";
  const isChecked = searchParams.get("isChecked") ?? "all";
  const isMeaningExist = searchParams.get("isMeaningExist") ?? "all";
  const offset = searchParams.get("page") ?? 1;
  const limit = Number(searchParams.get("per_page") ?? 10);
  const [sort, orderDirection] = searchParams.get("sort")?.split(".") ?? [];

  const { data, isLoading, mutate } = useSWR<{
    data: TLexeme[];
    total: number;
  }>(
    `/v1/admin/lexemes?${stringifyParams({
      search,
      offset,
      limit,
      sort,
      orderDirection,
      isMaster: isMaster === "all" ? undefined : isMaster,
      isApproved: isApproved === "all" ? undefined : isApproved,
      isChecked: isChecked === "all" ? undefined : isChecked,
      isMeaningExist: isMeaningExist === "all" ? undefined : isMeaningExist,
    })}`,
    getRequest
  );
  const lexemeList = data?.data ?? [];
  const total = data?.total ?? 0;

  const columns = getColumns(
    (data) => {
      setSelectedLexeme(data);
      setOpenUpsertModal(true);
    },
    (data) => {
      setSelectedLexeme(data);
      setOpenEditMeaningModal(true);
    },
    (data) => {
      setSelectedLexeme(data);
      setOpenDeleteModal(true);
    }
  );

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

  return (
    <div>
      <h2 className="text-xl font-semibold border-b my-4 pb-2">Lexeme list</h2>
      <div className="flex justify-between items-center mb-4 ">
        <div className="flex gap-4 items-center">
          <Button onClick={() => setOpenUpsertModal(true)} className="">
            Add new Lexeme
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="flex gap-2 items-center">
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
          <div className="flex gap-2 items-center">
            <Select
              onValueChange={(isChecked) => {
                setSearchParam({ isChecked, page: 1 });
              }}
              value={isChecked}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={"all"}>All</SelectItem>
                  <SelectItem value="true">IsChecked</SelectItem>
                  <SelectItem value="false">Not Checked</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 items-center">
            <Select
              onValueChange={(isMeaningExist) => {
                setSearchParam({ isMeaningExist, page: 1 });
              }}
              value={isMeaningExist}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={"all"}>All</SelectItem>
                  <SelectItem value="true">isMeaningExist</SelectItem>
                  <SelectItem value="false">Not MeaningExist</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
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
