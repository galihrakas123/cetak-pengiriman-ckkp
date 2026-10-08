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
  getExpandedRowModel,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfigContext } from "@/contexts/configContext";
import FormInputIcon from "../input/FormInputIcon";
import { Button } from "@/components/ui/button";
import { getLocalStorage } from "@/services/localStorageService";

export function BaseTableExpanded({
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
  expanded,
  setExpanded,
  exportExcel,
  print,
  isLoadingPrint,
}) {
  const isAdmin = getLocalStorage("userData").bidang === "psip";
  const [isDetail, setIsDetail] = React.useState(false);
  const [targetType, setTargetType] = React.useState<"murni" | "perubahan">("perubahan");

  const table = useReactTable({
    getRowId: (row: any) => row?.id,
    data,
    columns,
    pageCount,
    state: {
      columnVisibility: {
        aksi: isAdmin,
      },
      rowSelection,
      pagination,
      columnFilters,
      globalFilter,
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows,
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
    getExpandedRowModel: getExpandedRowModel(),

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
    <section>
      <div className="flex justify-between space-x-4 mt-4 mb-2 flex-wrap gap-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant={"outline"}
            onClick={() => {
              if (isDetail) {
                setExpanded({
                  "0": true,
                });
                setIsDetail(!isDetail);
              } else {
                setExpanded({
                  "0": true,
                  "0.0": true,
                  "0.1": true,
                  "0.2": true,
                  "0.0.0": true,
                  "0.0.1": true,
                  "0.0.2": true,
                  "0.0.3": true,
                  "0.1.0": true,
                  "0.1.1": true,
                  "0.2.0": true,
                  "0.2.1": true,
                  "0.2.2": true,
                });
                setIsDetail(!isDetail);
              }
              // table.toggleAllRowsExpanded();
            }}
          >
            Lihat Detail
          </Button>

          {/* Toggle Target Murni & Target Perubahan (HIDDEN) */}
          {/* <div className="bg-gray-200/70 p-1 rounded-lg inline-flex gap-1 items-center">
            <button
              type="button"
              onClick={() => setTargetType("murni")}
              className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all duration-200 ${
                targetType === "murni"
                  ? "bg-[#3B82F6] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Target Murni
            </button>
            <button
              type="button"
              onClick={() => setTargetType("perubahan")}
              className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all duration-200 ${
                targetType === "perubahan"
                  ? "bg-[#3B82F6] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Target Perubahan
            </button>
          </div> */}
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Button
              variant={"outline"}
              className="text-green-600 border-green-600"
              onClick={exportExcel}
            >
              {isLoadingPrint ? (
                "Loading..."
              ) : (
                <>
                  <FileText /> Excel
                </>
              )}
            </Button>
          )}
          <Button
            onClick={print}
            variant={"outline"}
            className="text-destructive border-destructive"
          >
            <FileText /> PDF
          </Button>
        </div>
      </div>
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
                      className="bg-[#4099ff] max-w-sm text-sm text-white"
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
                        <td key={cell.id} className="text-sm">
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
