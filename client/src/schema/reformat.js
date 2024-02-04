import toTableColumns from '@/components/Table/utils/toTableColumns'

export default function reformat(schema) {
    var bigCol = toTableColumns(schema.columns)
    schema.columns = bigCol.columns
    schema.inputs = bigCol.inputs

    schema.props = {
        ...schema.props,
        initialState: {
            ...schema.props?.initialState,
            columnVisibility: bigCol.columnVisibility
        }
    }
    return schema
}
