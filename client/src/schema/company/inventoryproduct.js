import { integerReg } from "@/utils/hooks/regex";
import reformat from '../reformat';
import product from '../product/product';

const inventoryproduct = reformat({
    label: "Inventory Product",
    name: "inventoryproduct",
    columns: [
        {
            header: "Product",
            size: 400,
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
            size: 150,
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
            size: 150,
            input: {
                type: "number",
                required: true,
                validator: (value) => value > 0 && integerReg.test(value),
                errorMessage: "Number format incorrect"
            },
        },
    ]
})
export default inventoryproduct