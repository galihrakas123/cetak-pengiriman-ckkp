import { useState } from "react";

export function useSorting({ initialField = "no", initialOrder = "asc" }) {
  const [sorting, setSorting] = useState(
    initialField ? [{ id: initialField, desc: initialOrder === "desc" }] : []
  );

  return {
    sorting,
    onSortingChange: setSorting,
    order: !sorting.length ? initialOrder : sorting[0].desc ? "desc" : "asc",
    field: sorting.length ? sorting[0].id : initialField,
  };
}
