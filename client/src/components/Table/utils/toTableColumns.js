import NextImage from '../../Images/NextImage';
import Box from "@mui/material/Box";
import formEditMode from '../../Form/formEditMode';
import capitalizeEachWord from '@/utils/capitalizeEachWord';
import sanitizeString from '@/utils/sanitizeString';

function createAccessorFunction(accessorKey) {
    const keys = accessorKey.split('.');

    return (row) => {
        let value = row;
        for (const key of keys) {
            if (value === undefined) {
                break;
            }
            value = value[key];
        }
        return value;
    };
}
function createInputValueSetter(accessorKey) {
    const keys = accessorKey.includes('.') ? accessorKey.split('.') : [accessorKey];

    return (form, value) => {
        const clonedKeys = [...keys];
        const lastKey = clonedKeys.pop();
        const nestedObject = clonedKeys.reduce((acc, key) => {
            if (acc[key] === undefined) {
                acc[key] = {};
            }
            return acc[key];
        }, form);

        nestedObject[lastKey] = value;

        return form;
    };
}

export default function toTableColumns(list, addColumns = true) {
    const CREATE = formEditMode.create;
    const UPDATE = formEditMode.update;
    const options = [UPDATE, CREATE];
    const inputs = {};

    const columns = [];
    const columnVisibility = {};

    const inputList = options.reduce((accumulator, mode) => {
        accumulator[mode] = {
            content: new Map([
                [0, {
                    content: new Map([
                        [0, { content: [], order: 0 }]
                    ]),
                    order: 0,
                }]
            ]),
            [formEditMode.validator]: []
        };
        return accumulator;
    }, {});

    const newCol = (col, tab, group, order) => {
        const bigColumn = TableColumn(col);
        if (bigColumn.column.hidden === true) {

        } else {
            columns.push(bigColumn.column);
            if (bigColumn.column.display !== undefined)
                columnVisibility[bigColumn.column.accessorKey] = !bigColumn.column.display;
        }
        if (bigColumn.input) {
            options.forEach(mode => {
                const { [mode]: allow, ...others } = bigColumn.input;
                if (allow) {
                    const contentGroup = inputList[mode].content.get(tab).content.get(group);
                    contentGroup.content.push({ ...others, order });
                    inputList[mode][formEditMode.validator].push({ ...others });
                }
            });
        }
    };

    const manageContent = (intab, ingroup, column, index) => {
        const tab = column.tab || intab;
        const group = column.group || ingroup;
        const { order = index } = column;

        if (column.content) {
            options.forEach(mode => {
                if (tab && !inputList[mode].content.has(tab)) {
                    inputList[mode].content.set(tab, { content: new Map(), order });
                }
                if (!inputList[mode].content.get(tab).content.has(group)) {
                    inputList[mode].content.get(tab).content.set(group, { content: [], order });
                }
            });
            column.content.forEach((col, place) => {
                manageContent(tab, group, col, place);
            });
        } else {
            newCol(column, tab, group, order);
        }
    };

    list.forEach((def, index) => {
        manageContent(0, 0, def, index);
    });

    Object.keys(inputList).forEach(key => {
        inputs[key] = {};
        inputs[key][formEditMode.content] = Object.fromEntries(
            new Map(
                Array.from(inputList[key].content.entries())
                    .sort((a, b) => a[1].order - b[1].order)
                    .map(([k, v]) => [
                        k,
                        v.content
                            ? Object.fromEntries(
                                new Map(
                                    Array.from(v.content.entries())
                                        .sort((a, b) => a[1].order - b[1].order)
                                        .map(([kk, vv]) => [kk, vv.content])
                                        .filter(e => {
                                            return e[1].length > 0
                                        })
                                )
                            )
                            : v
                    ]).filter((e) => {
                        //console.log("dwadwadawdwadaw", e[1], e)
                        return Object.keys(e[1]).length > 0;
                    })
            )
        );
        inputs[key][formEditMode.validator] = inputList[key][formEditMode.validator];
    });

    return { columns, inputs, columnVisibility };
}

const noncreatetype = ['records']

function TableColumn(props) {
    const { accessorKey, accessorFn: oriAccessorFn, header: rawHeader, size: rawSize, input, display, ...others } = props;

    let accessorFn = oriAccessorFn || createAccessorFunction(accessorKey);
    let header = capitalizeEachWord(rawHeader || accessorKey);
    let size = rawSize || 120 + header.length * 10;

    let inputType
    let inputValueSetter
    let inputValueGetter

    if (input) {
        inputType = sanitizeString(input.type || 'text')
        inputValueSetter = input.valueSetter || createInputValueSetter(input.setterKey || accessorKey, /*!input?.simple && input?.optionList*/);

        if (inputType === "records") {
            inputValueGetter = input.valueGetter || createAccessorFunction(input.getterKey || 'id');
        } else {
            inputValueGetter = input.valueGetter || createAccessorFunction(input.getterKey || accessorKey);
        }
        /*
        if(input.type === "record"){
            inputObjectGetter = createAccessorFunction(accessorKey.split('.').slice(0, -1).join("."));
        }
        */
    }

    return {
        column: {
            accessorFn,
            accessorKey,
            header,
            size,
            ...(display && {
                ...(display.type === "imageText" && TableImageTextCell({ accessorFn: display.accessorFn, showText: true })),
            }),
            ...others
        },
        ...(input && {
            input: {
                ...input,
                label: header,
                name: accessorKey,
                type: inputType === "number" ? "tel" : inputType, //no updown arrow this way lol
                valueGetter: inputValueGetter,
                valueSetter: inputValueSetter,
                [formEditMode.create]: !noncreatetype.includes(inputType) || input[formEditMode.create] !== false,
                [formEditMode.update]: input[formEditMode.update] !== false,
            },
            ...((!inputType || inputType === "text") && TableTextCell()),
            ...(inputType && {
                ...(inputType === "image" && TableImageTextCell({ accessorFn })),
                ...(inputType === "select" && TableSelectCell(input)),
            }),
        }),
    };
}


function TableImageTextCell(props) {
    const { accessorFn, showText = false } = props;

    return {
        Cell: ({ renderedCellValue, row }) => {
            return (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                }}>
                    <Box sx={{
                        maxHeight: 0,
                        display: 'flex',
                        alignItems: 'center',
                        color: "background.default"
                    }}>
                        <NextImage
                            alt="image"
                            height={30}
                            width={30}
                            src={accessorFn(row.original)}
                            defaultSrc={"/image/avatar.png"}
                            sx={{
                                borderRadius: '50%',
                                color: 'inherit',
                                outline: '2px solid currentColor',
                                marginLeft: '-.75rem',
                                marginRight: '-.5rem',
                                zIndex: 1,
                            }}
                        />
                    </Box>
                    {showText && <span style={{ whiteSpace: "nowrap" }}>{renderedCellValue}</span>}
                </Box>
            );
        },
    };
}


function TableTextCell() {
    return {
        Cell: ({ renderedCellValue }) => {
            return (
                <Box sx={{ textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <span>{renderedCellValue}</span>
                </Box>
            );
        },
    };
}

function TableSelectCell(input) {

    return {
        Cell: ({ cell }) => (
            <Box sx={{ textTransform: "capitalize" }}>
                {cell.getValue()}
            </Box>
        ),
    };
}
