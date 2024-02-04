import reformat from "../reformat"

const origin = reformat({
    label: "Origin",
    name: "origin",
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
export default origin