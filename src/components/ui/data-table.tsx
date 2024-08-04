"use client";

import { SkeletonLoading } from "@/components/SkeletonLoading";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import {
  Table as DataTableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Table, flexRender } from "@tanstack/react-table";

type TableProps<T> = {
  className?: string;
  innerClassName?: string;
  hiddenPagination?: boolean;
  isLoading?: boolean;
  colSpan: number;
  table: Table<T>;
};

const DataTable = <T,>({
  className,
  colSpan,
  table,
  isLoading,
  innerClassName,
  hiddenPagination,
}: TableProps<T>) => {
  return (
    <div className={cn(`w-full`, className)}>
      <div className={cn("rounded-md border", innerClassName)}>
        <DataTableComponent>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="h-24">
                  <SkeletonLoading numOfSkeletons={10} />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={colSpan} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </DataTableComponent>
      </div>

      {!hiddenPagination && (
        <DataTablePagination table={table} />

        //   <div className="flex items-center gap-x-2 overflow-auto">
        //     {Array.from({ length: table.getPageCount() }, (_, i) => (
        //       <Button
        //         key={i}
        //         variant="outline"
        //         size="sm"
        //         onClick={() => table.setPageIndex(i)}
        //         disabled={table.getState().pagination.pageIndex === i}
        //       >
        //         {i + 1}
        //       </Button>
        //     ))}
        //   </div>
      )}
    </div>
  );
};

export default DataTable;
