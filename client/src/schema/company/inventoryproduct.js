import { integerReg } from "@/utils/hooks/regex";
import reformat from '../reformat';
import product from '../product/product';

const inventoryproduct = reformat({
    label: "Inventory Product",
    name: "inventoryproduct",
    columns: [
        {
            header: "Product",
            size: 300,
            accessorKey: 'product.name',
            accessorFn: (record) => `${record.product?.name} (id:${record.product?.id})`,
            enableClickToCopy: true,
        },
        {
            hidden: true,
            accessorKey: 'product',
            input: {
                type: "record",
                table: product,
                required: true,
                sx:{
                    minWidth: 300
                }
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
        {
            accessorKey: 'restock',
            header: "Restock Quantity",
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
        getRowId: (row) => {row.id? row.id.product : 0 },
    }
})
export default inventoryproduct