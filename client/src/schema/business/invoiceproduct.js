import { integerReg } from "@/utils/hooks/regex";
import reformat from '../reformat';
import product from '../product/product';
import formEditMode from "@/components/Form/formEditMode";
import inventory from "../company/inventory";

const invoiceproduct = reformat({
    label: "Invoice Product",
    name: "invoiceproduct",
    columns: [
        {
            header: "Product",
            accessorKey: 'product.name',
            accessorFn: (record) => `${record.product?.name} (id:${record.product?.id})`,
            enableClickToCopy: true,
        },
        {
            header: "Inventory",
            accessorKey: 'inventory.name',
            size: 300,
            accessorFn: (record) => `${record.inventory?.name} (${record.inventory?.address})`,
            enableClickToCopy: true,
        },
        {
            hidden: true,
            accessorKey: 'product',
            input: {
                type: "record",
                table: product,
                required: true,
                full: true,
                sx:{
                    minWidth: 300
                },
                [formEditMode.update]: false
            },
        },
        {
            hidden: true,
            accessorKey: 'inventory',
            input: {
                type: "record",
                table: inventory,
                required: true,
                sx:{
                    minWidth: 300
                },
            },
        },
        {
            accessorKey: 'quantity',
            enableClickToCopy: true,
            input: {
                type: "number",
                required: true,
                validator: (value) => value > 0 && integerReg.test(value),
                errorMessage: "Number format incorrect"
            },
        },
    ],
    props: {
        crud:{
            methods:{
                customCreate: (record) => {
                    record.price = record.product.price
                    record.product = record.product.id
                    return record
                },
                customUpdate: (record) => {
                    record.product = record.product.id
                    return record
                }
            }
        },
        //getRowId: (row) => row.id.product.id,
    }
})
export default invoiceproduct