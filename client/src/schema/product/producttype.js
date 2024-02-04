import reformat from "../reformat"

const producttype = reformat({
    label: "Product Type",
    name: "producttype",
    columns: [
        {
            accessorKey: 'id',
            enableClickToCopy: true,
        },
        {
            accessorKey: 'name',
            input: {
                required: true,
            }
        }
    ]
})

export default producttype