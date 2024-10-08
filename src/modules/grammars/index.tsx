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
import { getColumns } from "@/modules/grammars/columns";
import { DeleteGrammarModal } from "@/modules/grammars/DeleteGrammarModal";
import { UpsertGrammarModal } from "@/modules/grammars/UpsertGrammarModal";
import { getRequest } from "@/service/data";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { ArrowUpDown, SquarePen, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export function Grammars() {
  const searchParams = useSearchParams();
  const setSearchParam = useUrlSearchParams();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  // const [idsSelected, selectedIds] = useState<string[]>([]);
  const [openUpsertModal, setOpenUpsertModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedGrammar, setSelectedGrammar] = useState<TGrammar | null>(null);
  const [searchText, setSearchText] = useState("");

  const search = searchParams.get("search") ?? "";
  const jlptLevel = searchParams.get("jlptLevel") ?? "all";
  const offset = searchParams.get("page") ?? 1;
  const limit = Number(searchParams.get("per_page") ?? 10);
  const [sort, orderDirection] = searchParams.get("sort")?.split(".") ?? [];

  const { data, isLoading, mutate } = useSWR<{
    data: TGrammar[];
    total: number;
  }>(
    `/v1/grammars?${stringifyParams({
      search,
      offset,
      limit,
      sort,
      orderDirection,
      jlptLevel: jlptLevel === "all" ? undefined : jlptLevel,
    })}`,
    getRequest
  );
  const grammarList = data?.data ?? [];
  const total = data?.total ?? 0;

  const columns = getColumns(
    (data: TGrammar) => {
      setSelectedGrammar(data);
      setOpenUpsertModal(true);
    },
    (data: TGrammar) => {
      setSelectedGrammar(data);
      setOpenDeleteModal(true);
    }
  );

  const { table } = useDataTable({
    data: grammarList,
    columns,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    pageCount: calculateTotalPages(total, limit) || 0,
    state: {
      pagination: { pageIndex: Number(offset) - 1, pageSize: limit },
    },
  });

  // function afterDeleteIds(articleIds: string[]) {
  //   const articleIndexes = [1, 2, 3];

  //   setRowSelection((prev) => {
  //     articleIndexes.forEach((i) => {
  //       delete prev[i];
  //     });
  //     return { ...prev };
  //   });
  //   selectedIds((prev) =>
  //     prev.filter((currentId) => !articleIds.includes(currentId))
  //   );
  // }

  return (
    <div>
      <div className="border-b my-4 pb-2">
        <h2 className="text-xl font-semibold">Grammar list</h2>
      </div>
      <div className="flex justify-between items-center mb-4 ">
        <div className="flex gap-4 items-center">
          <Button onClick={() => setOpenUpsertModal(true)} className="">
            Add new Grammar
          </Button>
          {/* {idsSelected.length > 0 && (
            <Button variant={"destructive"}>Delete Grammar</Button>
          )} */}
        </div>

        <div className="flex gap-4">
          <div className="flex gap-2 items-center">
            <label>Jlpt Level</label>
            <Select
              onValueChange={(jlptLevel) => {
                setSearchParam({ jlptLevel, page: 1 });
              }}
              value={jlptLevel}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={"all"}>All</SelectItem>
                  <SelectItem value="N1">N1</SelectItem>
                  <SelectItem value="N2">N2</SelectItem>
                  <SelectItem value="N3">N3</SelectItem>
                  <SelectItem value="N4">N4</SelectItem>
                  <SelectItem value="N5">N5</SelectItem>
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

      <UpsertGrammarModal
        grammar={selectedGrammar}
        open={openUpsertModal}
        onOpenChange={(open) => {
          setOpenUpsertModal(open);
          setSelectedGrammar(null);
        }}
        mutate={mutate}
        onDeleteGrammar={() => {
          setOpenDeleteModal(true);
        }}
      />

      <DeleteGrammarModal
        grammar={selectedGrammar}
        open={openDeleteModal}
        onOpenChange={(open) => {
          setOpenDeleteModal(open);
          setSelectedGrammar(null);
          if (openUpsertModal) {
            setOpenUpsertModal(false);
          }
        }}
        mutate={mutate}
      />
    </div>
  );
}
