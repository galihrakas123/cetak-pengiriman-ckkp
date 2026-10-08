/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { HTMLProps } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormInputIcon from "../input/FormInputIcon";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils/utils";

export function TablePagination({
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
  maxLimit = 100,
  maxData,
  isPagination = true,
  color = "bg-primary text-white",
}) {
  const table = useReactTable({
    getRowId: (row: any) => row?.id,
    data,
    columns,
    pageCount,
    state: {
      columnVisibility: {},
      rowSelection,
      pagination,
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    manualPagination: true,
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: setRowSelection, //set the row selection state
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
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
        <table className="base-table rounded-lg w-[calc(100dvw-80px)]">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(color, "font-semibold py-3")}
                      style={{ minWidth: `${header.getSize()}px` }}
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
                          {header.column.getCanFilter() ? (
                            <div className="flex justify-center items-center">
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null}
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
                <td colSpan={table.getHeaderGroups()[0].headers.length}>
                  <div className="flex items-center justify-center">
                    <span className="text-sm text-gray-400">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={table.getHeaderGroups()[0].headers.length}>
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
                    className={
                      row.getIsSelected() ? "cursor-pointer bg-blue-100" : ""
                    }
                    onClick={row.getToggleSelectedHandler()}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          key={cell.id}
                          className="text-sm font-semibold text-muted-foreground"
                        >
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
          {/* <tfoot>
          <tr>
            <td className="p-1 text-center m-auto">
              <IndeterminateCheckbox
                {...{
                  checked: table.getIsAllPageRowsSelected(),
                  indeterminate: table.getIsSomePageRowsSelected(),
                  onChange: table.getToggleAllPageRowsSelectedHandler(),
                }}
              />
            </td>
            <td colSpan={20}>
              Pilih Semua ({table.getRowModel().rows.length})
            </td>
          </tr>
        </tfoot> */}
        </table>

        {/* <div>
        <LoadingMobil open={isLoading} />
      </div> */}
      </div>
      {/* Pagination  */}
      {isPagination && (
        <div className="w-full justify-between flex flex-row items-center gap-2 mt-3 text-sm">
          <div className="flex gap-2 items-center">
            <span>Tampilkan</span>
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
                {[10, 20, 30, 40, 50, maxLimit].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize?.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span>
              Item dari total{" "}
              {/* {table.getFilteredRowModel().rows.length === 0
              ? 0
              : table.getFilteredRowModel().rows.length}{" "} */}
              {formatNumber(maxData)}{" "}
            </span>
            <span className="flex items-center gap-1">
              <div>
                <strong>|</strong> Halaman
              </div>
              <strong>
                {table.getState().pagination.pageIndex + 1} dari{" "}
                {formatNumber(table.getPageCount())}
              </strong>
            </span>
          </div>
          <div className="flex flex-row whitespace-nowrap items-center gap-2">
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
                onClick={() => table.setPageIndex(0)}
                // disabled={!table.getCanPreviousPage()}
              >
                {"<<"}
              </Button>
              <Button
                variant={"outline"}
                onClick={() => table.previousPage()}
                // disabled={!table.getCanPreviousPage()}
              >
                {"<"}
              </Button>
              <Button
                variant={"outline"}
                onClick={() => table.nextPage()}
                // disabled={!table.getCanNextPage()}
              >
                {">"}
              </Button>
              <Button
                variant={"outline"}
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                // disabled={!table.getCanNextPage()}
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

function Filter({ column, table }) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === "number" ? (
    <div>
      <div className="flex space-x-2 w-full">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={columnFilterValue?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={columnFilterValue?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
      {/* <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value) => (
          <option value={value} key={value} />
        ))}
      </datalist> */}
      <DebouncedInput
        type="text"
        value={columnFilterValue ?? ""}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Cari... (${column.getFacetedUniqueValues().size})`}
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  );
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 1000,
  ...props
}) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <>
      <FormInputIcon
        {...props}
        value={value}
        className="max-w-[90px] text-black"
        onChange={(e) => setValue(e.target.value)}
      />
    </>
  );
}

export function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={
        className +
        " cursor-pointer form-checkbox h-5 w-5 disabled:cursor-not-allowed disabled:opacity-50"
      }
      {...rest}
    />
  );
}
