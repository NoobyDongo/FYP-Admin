import { phoneReg } from "@/utils/hooks/regex";
import reformat from '../reformat';
import hashString from "../../../server/util/hash/_hashString";
import formEditMode from "@/components/Form/formEditMode";

const customer = reformat({
    label: "Customer",
    name: "customer",
    nameFn: (record) => record.fname + " " + record.lname,
    columns: [
        {
            accessorKey: 'id',
            enableClickToCopy: true,
        },
        {
            tab: "Thsi is a fking test",
            content: [
                {
                    group: "Basic Information",
                    content: [
                        {
                            accessorKey: 'fname',
                            header: "First Name",
                            input: {
                                required: true,
                            }
                        },
                        {
                            accessorKey: 'lname',
                            header: "Last Name",
                            input: {
                                required: true,
                            }
                        },
                    ]
                },
                {
                    group: "Additional Information",
                    content: [
                        {
                            accessorKey: 'address',
                            size: 250,
                            input: {
                                multiline: true,
                            }
                        },
                        {
                            accessorKey: 'phone',
                            input: {
                                type: "number",
                                validator: (value) => value && phoneReg.test(value),
                                errorMessage: "Please provide a 8-digit phone number"
                            }
                        },
                    ]
                },
                {
                    group: "User Information",
                    content: [
                        {
                            accessorKey: 'username',
                            input: {
                                required: true,
                            }
                        },
                        {
                            accessorKey: 'password',
                            input: {
                                type: "password",
                                required: true,
                                [formEditMode.update]: false,
                            }
                        },
                    ]
                },
            ]
        }

    ],
    props: {
        crud: {
            methods: {
                customCreate: (record) => {
                    record.password = hashString(record.password)
                    return record
                }
            }
        }
    }
})
export default customer