import { integerReg, phoneReg } from "@/utils/hooks/regex";
import reformat from '../reformat';
import hashString from "../../../server/util/hash/_hashString";
import formEditMode from "@/components/Form/formEditMode";
import product from "../product/product";

const demo = reformat({
    columns: [
        {
            tab: "TextFields",
            content: [
                {
                    accessorKey: 'text.ntnr',
                    header: 'Normal Textfield',
                    input: {
                        [formEditMode.update]: false,
                    },
                },
                {
                    accessorKey: 'text.ntml',
                    header: 'Normal Textfield(multiLine)',
                    input: {
                        multiline: true,
                        [formEditMode.update]: false,
                    },
                },
                {

                    group: "With Validation",
                    content: [
                        {
                            accessorKey: 'text.ntr',
                            header: 'Normal Textfield(required)',
                            input: {
                                required: true,
                                [formEditMode.update]: false,
                            },
                        },
                        {
                            accessorKey: 'text.ntrcv',
                            header: 'Normal Textfield(required, custom validator)',
                            input: {
                                required: true,
                                validator: (value) => value === 'i want to pass',
                                errorMessage: "This input has a custom validator",
                                [formEditMode.update]: false,
                            },
                        },
                    ],
                }
            ]
        },
        {
            tab: "Other Components",
            content: [
                {
                    group: "Image Upload",
                    content: [
                        {
                            accessorKey: 'image',
                            header: "Images",
                            input: {
                                type: 'image',
                                required: true,
                            }
                        },
                    ]
                },
                {
                    group: "Hidden Fields",
                    content: [
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
                {
                    group: "Number",
                    content: [
                        {
                            accessorKey: 'Integer',
                            input: {
                                required: true,
                                type: "number",
                                validator: (value) => integerReg.test(value),
                                errorMessage: "Please provide an integer"
                            }
                        },
                        {
                            accessorKey: 'phone',
                            input: {
                                required: true,
                                type: "number",
                                validator: (value) => phoneReg.test(value),
                                errorMessage: "Please provide a 8-digit phone number"
                            }
                        },
                    ]
                },
                {
                    group: "Other Record, eg: product",
                    content: [
                        {
                            hidden: true,
                            accessorKey: 'product',
                            header: 'Product',
                            input: {
                                type: 'record',
                                table: product,
                                required: true,
                                full: true,
                                group: 2,
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
export default demo