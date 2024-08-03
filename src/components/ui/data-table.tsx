"use client";

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
  colSize: number;
  table: Table<T>;
};

const DataTable = <T,>({
  className,
  colSize,
  table,
  innerClassName,
  hiddenPagination,
}: TableProps<T>) => {
  // useImperativeHandle(
  //   ref,
  //   () => ({
  //     setPageSize: (val: number) => table.setPageSize(val), // rows per page
  //     getPageSize: (val: number) => table.getPageCount(), // rows per page

  //     setPageIndex: (val: number) => table.setPageIndex(val),
  //     setPageCount: (val: number) =>
  //       table.setOptions((prev) => ({ ...prev, pageCount: val })),
  //   }),
  //   [table]
  // );

  return (
    <div className={cn(`w-full`, className)}>
      {/* <button
        onClick={() => {
          table.setPageSize(20);
          table.setPageIndex(1);
          // console.log("  table.getRowCount()", table.getRowCount());
          table.setOptions((prev) => ({ ...prev, pageCount: 30 }));
        }}
      >
        zxxx
      </button> */}
      {/* <div className="flex items-center py-4">
        <Input
          placeholder="Filter articles..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div> */}
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
            {table.getRowModel().rows?.length ? (
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
                <TableCell colSpan={colSize} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </DataTableComponent>
      </div>

      {!hiddenPagination && (
        <DataTablePagination table={table} />
        // <div className="flex w-full justify-between gap-x-2 py-4">
        //   <div className="flex gap-x-2">
        //     <Button
        //       variant="outline"
        //       size="sm"
        //       onClick={() => table.setPageIndex(0)}
        //       disabled={!table.getCanPreviousPage()}
        //     >
        //       First
        //     </Button>
        //     <Button
        //       variant="outline"
        //       size="sm"
        //       onClick={() => table.previousPage()}
        //       disabled={!table.getCanPreviousPage()}
        //     >
        //       Previous
        //     </Button>
        //   </div>
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
        //   <div className="flex gap-x-2">
        //     <Button
        //       variant="outline"
        //       size="sm"
        //       onClick={() => table.nextPage()}
        //       disabled={!table.getCanNextPage()}
        //     >
        //       Next
        //     </Button>
        //     <Button
        //       variant="outline"
        //       size="sm"
        //       onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        //       disabled={!table.getCanNextPage()}
        //     >
        //       Last
        //     </Button>
        //   </div>
        // </div>
      )}
    </div>
  );
};

export default DataTable;
