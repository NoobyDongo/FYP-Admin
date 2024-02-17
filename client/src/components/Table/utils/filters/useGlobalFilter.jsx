import React from 'react';
import Filter from '@/components/Table/utils/filters/Filter';
import getFilterColumns from '@/components/Table/utils/filters/getFilterColumns';
import findFilterColumn from '@/components/Table/utils/filters/findFilterColumn';
import toFilters from '@/components/Table/utils/filters/toFilters';

export default function useGlobalFilter(rawColumns, columnVisibility, rawGlobalFilter) {
    const globleFilterColumns = React.useMemo(() => new Set(getFilterColumns(rawColumns, columnVisibility)),
        [rawColumns, columnVisibility]
    );

    const globalFilter = React.useMemo(() => {
        if (rawGlobalFilter && typeof rawGlobalFilter === 'string') {
            let columnAndValue = findFilterColumn(rawGlobalFilter);
            if (columnAndValue.id && globleFilterColumns.has(columnAndValue.id))
                return toFilters([columnAndValue])
            else
                return Array.from(globleFilterColumns).map(column => new Filter(
                    column,
                    rawGlobalFilter,
                    'cn',
                    'any'
                ));
        }
    }, [rawGlobalFilter, globleFilterColumns]);

    return globalFilter || [];
}