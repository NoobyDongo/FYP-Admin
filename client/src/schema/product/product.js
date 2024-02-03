import { floatReg } from "@/utils/hooks/regex";
import reformat from '../reformat';
import origin from "./origin";
import producttype from "./producttype";

const product = reformat({
    label: "Product",
    name: "product",
    columns: [
        {
            accessorKey: 'id',
            enableClickToCopy: true,
        },
        {
            hidden: true,
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
            size: 150,
            input: {
                type: "number",
                required: true,
                validator: (value) => value > 0 && floatReg.test(value),
                errorMessage: "Number format incorrect"
            },
        },
        {
            accessorKey: 'origin.name',
            header: 'Origin',
            size: 200,
        },
        {
            accessorKey: 'producttype.name',
            header: 'Type',
            size: 200,
        },
        {
            hidden: true,
            accessorKey: 'producttype',
            header: 'Type',
            input: {
                type:'record',
                table: producttype,
                required: true,
                full: true,
                group: 2,
            }
        },
        {
            hidden: true,
            accessorKey: 'origin',
            header: 'Origin',
            input: {
                type:'record',
                table: origin,
                required: true,
                full: true,
                group: 2,
            }
        }
    ],
    props: {
        upload: true,
    }
})
export default product