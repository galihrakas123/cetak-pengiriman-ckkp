import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getSortedRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import classNames from "classnames";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/utils/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BaseTableSortingSizing({
  data,
  columns,
  pageCount = 100,
  pagination,
  setPagination,
  enableRowSelection = false,
  rowSelection = {},
  setRowSelection = () => {},
  isLoading = false,
  columnFilters,
  setColumnFilters,
  globalFilter,
  setGlobalFilter,
  sorting,
  setSorting,
  manualSorting = true,
  manualPagination = true,
  maxData = 1000,
  isPagination = false,
  color = "bg-[#4099ff]",
  columnVisibility = {},
}) {
  const table = useReactTable({
    getRowId: (row: any) => row?.id,
    data,
    columns,
    pageCount,
    state: {
      columnVisibility: columnVisibility,
      rowSelection,
      pagination,
      columnFilters,
      globalFilter,
      sorting,
    },
    onSortingChange: setSorting,
    manualSorting: manualSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    manualPagination: manualPagination,
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: setRowSelection, //set the row selection state
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });

  return (
    <section className="w-full">
      <div className="py-2 overflow-auto">
        <table className="base-table rounded-lg">
          <thead className={`text-white max-w-sm font-normal`}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isNomor = header.id.includes("nomor");
                  const isWil = header.id.includes("nm_wil");
                  const stickyClass = isNomor 
                    ? "sticky left-0 z-20 bg-[#4099ff] w-[40px] min-w-[40px] max-w-[40px]" 
                    : isWil 
                    ? "sticky left-[40px] z-20 bg-[#4099ff] min-w-[140px] shadow-[3px_0_6px_-2px_rgba(0,0,0,0.15)] border-r border-white/50" 
                    : "";

                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      rowSpan={
                        header.colSpan === 1 && header.depth === 1 ? 2 : 1
                      }
                      className={cn(
                        " max-w-sm text-sm text-white border border-white",
                        header.column.columnDef.meta?.displayNone && "hidden",
                        color,
                        stickyClass
                      )}
                      style={{
                        width: isNomor ? 40 : header.getSize(),
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none py-2 flex items-center justify-center gap-1"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() ? (
                              <div className="flex flex-col">
                                {(() => {
                                  if (header.column.getIsSorted() === "asc") {
                                    return <ArrowUp className="w-4 h-4" />;
                                  } else if (
                                    header.column.getIsSorted() === "desc"
                                  ) {
                                    return <ArrowDown className="w-4 h-4" />;
                                  } else {
                                    return <ArrowUpDown className="w-4 h-4" />; // Atur ikon default di sini jika diperlukan
                                  }
                                })()}
                              </div>
                            ) : null}
                          </div>
                        </>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={table.getHeaderGroups()[0].headers.length + 10}>
                  <div className="flex items-center justify-center">
                    <span className="text-sm ">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={table.getHeaderGroups()[0].headers.length + 10}>
                  <div className="flex items-center justify-center">
                    <span className="text-sm text-gray-400">
                      Tidak ada data
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => {
                return (
                  <tr
                    key={row.id}
                    className={classNames(
                      row.getIsSelected() ? "cursor-pointer bg-green-100" : ""
                    )}
                    onClick={row.getToggleSelectedHandler()}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isNomorCell = cell.column.id.includes("nomor");
                      const isWilCell = cell.column.id.includes("nm_wil");
                      const stickyCellClass = isNomorCell 
                        ? "sticky left-0 z-10 bg-white w-[40px] min-w-[40px] max-w-[40px]" 
                        : isWilCell 
                        ? "sticky left-[40px] z-10 bg-white min-w-[140px] shadow-[3px_0_6px_-2px_rgba(0,0,0,0.15)] border-r border-gray-200" 
                        : "";

                      return (
                        <td key={cell.id} className={cn("text-sm", stickyCellClass)}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id} className="border-black border-t-2">
                {footerGroup.headers.map((header) => {
                  const isNomorFooter = header.id.includes("nomor");
                  const isWilFooter = header.id.includes("nm_wil");
                  const stickyFooterClass = isNomorFooter 
                    ? "sticky left-0 z-10 bg-slate-50 w-[40px] min-w-[40px] max-w-[40px]" 
                    : isWilFooter 
                    ? "sticky left-[40px] z-10 bg-slate-50 min-w-[140px] shadow-[3px_0_6px_-2px_rgba(0,0,0,0.15)] border-r border-gray-300" 
                    : "";

                  return (
                    <th key={header.id} className={stickyFooterClass}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>

      {isPagination && (
        <div className="w-full justify-between flex flex-col lg:flex-row items-center gap-2 my-3 text-sm">
          <div className="flex flex-col lg:flex-row gap-2 items-center">
            <div className="flex items-center gap-2">
              <p>Tampilkan</p>
              <Select
                defaultValue={table.getState().pagination.pageSize?.toString()}
                onValueChange={(e) => {
                  table.setPageSize(Number(e));
                }}
              >
                <SelectTrigger className="w-[66px]">
                  <SelectValue placeholder="Jumlah" />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 40].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize?.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p>
                Item dari total{" "}
                {/* {table.getFilteredRowModel().rows.length === 0
                    ? 0
                    : table.getFilteredRowModel().rows.length}{" "} */}
                {formatNumber(maxData)}{" "}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <div>
                <strong>|</strong> Halaman
              </div>
              <strong>
                {table.getState().pagination.pageIndex + 1} dari{" "}
                {formatNumber(table.getPageCount())}
              </strong>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row whitespace-nowrap items-center gap-2">
            <div className="flex items-center">
              <div>Pergi ke Halaman</div>
              <Input
                type="number"
                value={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  setTimeout(() => {
                    table.setPageIndex(page);
                  }, 1000);
                }}
                className="text-sm h-8 w-16 mx-2 text-black"
              />
              {/* {table.getState().pagination.pageIndex + 1} */}
              <p>dari {formatNumber(table.getPageCount())}</p>
            </div>
            <div className="flex gap-3 items-center">
              <Button
                variant={"outline"}
                onClick={() => {
                  table.setPageIndex(0);
                  // setOffset(0);
                }}
                disabled={!table.getCanPreviousPage()}
              >
                {"<<"}
              </Button>
              <Button
                variant={"outline"}
                onClick={() => {
                  table.previousPage();
                  // setOffset(
                  //   // kurangi offsetnya sesuai dengan pageSize
                  //   (prev) => prev - pagination.pageSize
                  // );
                }}
                disabled={!table.getCanPreviousPage()}
              >
                {"<"}
              </Button>
              <Button
                variant={"outline"}
                onClick={() => {
                  table.nextPage();
                  // setOffset(
                  //   (table.getState().pagination.pageIndex + 1) *
                  //     pagination.pageSize
                  // );
                }}
                disabled={!table.getCanNextPage()}
              >
                {">"}
              </Button>
              <Button
                variant={"outline"}
                onClick={() => {
                  table.setPageIndex(table.getPageCount() - 1);
                  // setOffset((table.getPageCount() - 1) * pagination.pageSize);
                }}
                disabled={!table.getCanNextPage()}
              >
                {">>"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
