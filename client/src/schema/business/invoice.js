import formEditMode from '@/components/Form/formEditMode';
import reformat from '../reformat';
import customer from './customer';
import inventoryproduct from './invoiceproduct';
import invoiceproduct from './invoiceproduct';

const invoice = reformat({
    label: "Invoice",
    name: "invoice",
    columns: [
        {
            accessorKey: 'id',
            enableClickToCopy: true,
        },
        
        {
            accessorFn: (record) => record.customer?.fname + " " + record.customer?.lname,
            header: "Customer Name",
            enableClickToCopy: true,
        },
        {
            hidden: true,
            accessorKey: 'customer',
            input: {
                type: "record",
                table: customer,
                required: true,
                full: true,
                sx:{
                    minWidth: 300
                },
                [formEditMode.update]: false
            },
        },
        {
            tab: "Products",
            content: [
                {
                    hidden: true,
                    accessorKey: 'invoiceProduct',
                    header: 'Invoice Products',
                    input: {
                        type: "records",
                        setterKey: 'invoice',
                        schema: invoiceproduct,
                    }
                },
            ]
        }
        
    ],
})
export default invoice