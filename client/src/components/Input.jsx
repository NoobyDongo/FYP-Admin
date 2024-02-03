'use client'
import { Box, Stack, TextField, IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useState } from 'react';
import dayjs from 'dayjs';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export function TextInputField({ edit, value, setValue, censored, multiline }) {

    const [visible, setVisible] = useState(false)

    const toggleVisible = (e) => {
        setVisible(!visible)
    }

    return (
        <Box>
            <Stack direction="row">
                <TextField
                    hiddenLabel
                    defaultValue={!value && !edit ? "——" : value}
                    variant="standard"
                    size="small"
                    type={censored && !visible ? "password" : "text"}
                    required
                    onChange={(e) => setValue(e)}
                    fullWidth
                    multiline={multiline}

                    InputProps={{
                        disableUnderline: !edit,
                        readOnly: !edit,
                    }}
                />
                {censored && value && <IconButton size="small" onClick={toggleVisible}>
                    {!visible && <VisibilityIcon />} {visible && <VisibilityOffIcon />}
                </IconButton>
                }

            </Stack>
        </Box>
    )
}

export function DateInputField({ edit, value, setValue }) {

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            {(value || edit) &&
                <DatePicker
                    defaultValue={value || dayjs(new Date())}
                    disableOpenPicker={!edit}
                    onChange={(e) => setValue(e)}
                    slotProps={{
                        disableUnderline: !edit, textField: {
                            variant: "standard", size: 'small', readOnly: !edit, InputProps: {
                                disableUnderline: !edit
                            }
                        }
                    }}
                />
            }
            {(!value && !edit) && <TextInputField value={"——"} />}
        </LocalizationProvider>
    )
}
