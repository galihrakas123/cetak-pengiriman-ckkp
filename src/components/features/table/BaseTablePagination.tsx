/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { HTMLProps, useContext, useEffect } from "react";
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
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfigContext } from "@/contexts/configContext";
import FormInputIcon from "../input/FormInputIcon";

export function BaseTablePagination({
  data,
  columns,
  pageCount = 100,
  pagination,
  setPagination,
  setSelectedPilih,
  setSelectedHapus,
  enableRowSelection = false,
  isHapus = false,
  isPilih = false,
  rowSelection = {},
  setRowSelection,
  isLoading = false,
  columnFilters,
  setColumnFilters,
  globalFilter,
  setGlobalFilter,
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

  const { state } = useContext(ConfigContext);

  useEffect(() => {
    // console.log(table.getSelectedRowModel().rows);
    if (isHapus) {
      setSelectedHapus(table.getSelectedRowModel().rows);
    }
    if (isPilih) {
      setSelectedPilih(table.getSelectedRowModel().rows);
    }
  }, [table.getState()]);

  useEffect(() => {
    // reset row selection when data changes
    setRowSelection({});
  }, [data]);

  return (
    <div className="w-full overflow-auto Content">
      <table className="base-table rounded-lg">
        <thead className="bg-primary text-white max-w-sm font-normal">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="bg-primary text-white max-w-sm font-semibold text-sm"
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
                  <span className="text-sm ">Loading...</span>
                </div>
              </td>
            </tr>
          ) : table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={table.getHeaderGroups()[0].headers.length}>
                <div className="flex items-center justify-center">
                  <span className="text-sm text-gray-400">Tidak ada data</span>
                </div>
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => {
              return (
                <tr
                  key={row.id}
                  className={cn(
                    row.getIsSelected() ? "cursor-pointer bg-green-100" : "",
                    state.kodeWilayah === row.original?.kd_wil
                      ? "bg-gray-300"
                      : ""
                  )}
                  onClick={row.getToggleSelectedHandler()}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} className="text-sm font-semibold">
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
            <tr key={footerGroup.id} className="text-lg border-t-2 ">
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
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
          className="w-24 border shadow rounded"
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
          className="w-24 border shadow rounded"
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
        className="w-full border shadow rounded-xl text-primary"
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
        className="max-w-[90px]"
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
