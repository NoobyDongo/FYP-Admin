'use client'
import { Table as rawTable } from '@/components/Table/Table'
import { numberReg } from '@/utils/hooks/useRecordValidation';
import TableWrapper from '@/components/Table/_wrapper';
import { toTableColumns } from '@/components/Table/TableColumnEditField';
import { dataFn } from '@/utils/crud/useAPI';
import { serverApi } from '../../config';


function Table() {
    const tableName = "product"

    console.log("Table rendered")

    const serverAPI = dataFn(serverApi + "/record/" + tableName)
    const columns = (fetchedRecords) => toTableColumns([
        {
            accessorKey: 'id',
            enableClickToCopy: true,
        },
        {
            accessorKey: 'images',
            input: {
                type: "image",
                linkFn: (record) => `/api/image/product/${record.id}/`,
            }
        },
        {
            accessorKey: 'name',
            enableClickToCopy: true,
            size: 200,
            display: {
                type: "imageText",
                accessorFn: (record) => record.images?.length > 0 ? `/api/image/product/${record.id}/${record.images[0].name}` : null
            },
            input: {
                required: true,
            },
        },
        {
            accessorKey: 'desc',
            header: 'Description',
            size: 250,
            input: {
                multiline: true,
                required: true,
            },
        },
        {
            accessorKey: 'price',
            header: 'Price',
            enableClickToCopy: true,
            size: 150,
            input: {
                type: "number",
                required: true,
                validator: (value) => value > 0 && numberReg.test(value),
                errorMessage: "Number format incorrect"
            },
        },
        {
            accessorKey: 'productType',
            header: 'Type',
            size: 200,
            input: {
                order: 1,
                type: "select",
                simple: true,
                optionList: fetchedRecords.producttype || [{ id: 1, name: "test" }],
                required: true,
                group: 2,
            }
        },
        {
            accessorKey: 'origin',
            size: 200,
            input: {
                type: "select",
                simple: true,
                optionList: fetchedRecords.origin || [{ id: 1, name: "test" }],
                required: true,
                group: 2,
            }
        }
    ])

    const Table = () => rawTable({
        crud: {
            tableName: "product",
            simple: true,
            subTable: [
                { name: "producttype", param: { option: "all", simple: false } },
                { name: "origin", param: { option: "all", simple: false } },
            ],
            methods: {
                create: serverAPI,
                createOption: "",
                createSimple: false,

                update: serverAPI,
                updateOption: "",
                updateSimple: false,

                delete: serverAPI,
                deleteOption: "/",
                deleteSimple: false,
            }
        },

        columns,
        tableName,
        initialState: {
            columnVisibility: { images: false }
        }
    })
    return (<Table />)
}

export default function ProductTable() {
    return (
        <TableWrapper>
            <Table />
        </TableWrapper>
    )
}