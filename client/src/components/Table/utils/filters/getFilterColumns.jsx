export default function getFilterColumns(rawColumns, columnVisibility = {}) {
    return rawColumns.filter(e => e.enableColumnFilter !== false && columnVisibility[e.accessorKey] !== false).map(obj => obj.accessorKey);
}
