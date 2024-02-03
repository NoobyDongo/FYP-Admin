import formEditMode from '@/components/Form/formEditMode';
import reformat from '../reformat';
import inventoryproduct from './inventoryproduct';

const inventory = reformat({
    label: "Inventory",
    name: "inventory",
    columns: [
        {
            accessorKey: 'id',
            enableClickToCopy: true,
        },
        {
            accessorKey: 'name',
            enableClickToCopy: true,
            size: 200,
            input: {
                required: true,
            },
        },
        {
            accessorKey: 'address',
            enableClickToCopy: true,
            size: 250,
            input: {
                multiline: true,
                required: true,
            },
        },
        {
            tab: "Products",
            content: [
                {
                    hidden: true,
                    accessorKey: 'inventoryProduct',
                    header: 'Inventory Product',
                    input: {
                        type: "records",
                        setterKey: 'inventory',
                        schema: inventoryproduct,
                    }
                },
            ]
        }
        
    ],
})
export default inventory