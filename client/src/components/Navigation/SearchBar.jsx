'use client';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Search from '@mui/icons-material/Search';
import React from 'react';
import NavOption from './NavOption';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Cancel from '@mui/icons-material/Cancel';
import { useRouter } from "next/navigation";
import { SearchNavOptions } from './navoptions/options';
import { toolSize } from './appbar/customAppbarConfig';

function filterOptions(search, searchOptions) {
    if (!search) {
        return searchOptions;
    }
    return searchOptions.map(option => {
        if (option.content) {
            return {
                ...option,
                content: option.content.filter(item => item.displayname.nav.toLowerCase().includes(search.toLowerCase()))
            };
        }
        return option;
    }).filter(option => (option.content && option.content.length > 0) || option.displayname.nav.toLowerCase().includes(search.toLowerCase()));
}


const gap = 1

export default function SearchBar(props) {

    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState('')
    const Router = useRouter();

    const addFn = (e) => {
        if (e.link)
            setOpen(false)
    }

    const onOpen = () => {
        setValue('')
        setOpen(true)
    }
    const onClose = () => {
        setOpen(false)
    }

    return (
        <>
            <Stack direction='row'>
                <NavOption open={true} e={{
                    name: "Search for page",
                    icon: <Search />,
                    func: onOpen
                }} sx={{
                    overflow: 'hidden',
                    padding: 0,
                    height: toolSize,
                    width: { xs: 0, md: 180 },
                    transitionDelay: { xs: 0, md: "200ms" },
                    transform: { xs: 'translateX(0)', md: `translateX(${toolSize}px)` },
                    transitionDuration: '200ms',
                    transitionProperty: 'width, transform',
                }}
                    textProps={{
                        sx: {
                            whiteSpace: "nowrap",
                        }
                    }}
                    buttonProps={{
                        sx: {
                            height: toolSize,
                            minHeight: 0,
                            border: 1,
                            borderRadius: 1,
                            borderColor: "input.border.main",
                        }
                    }} />
                <IconButton
                    sx={{
                        transition: 'opacity 200ms',
                        transitionDelay: { xs: '200ms', md: 0 },
                        width: toolSize,
                        opacity: { xs: 1, md: 0 },
                        pointerEvents: { xs: 'auto', md: 'none' },
                        border: 1,
                        borderColor: "input.border.main",
                    }}
                    onClick={onOpen}
                >
                    <Search />
                </IconButton>
            </Stack>
            <Dialog open={open} onClose={onClose}
                sx={{
                    '& .MuiDialog-container': {
                        alignItems: 'flex-start',
                    },
                }}
                PaperProps={{
                    sx: {
                        width: 500,
                        backgroundImage: "none !important",
                        backgroundColor: "background.default",
                        border: 1,
                        borderColor: "input.border.main"
                    }
                }}
            >
                <DialogTitle sx={{
                    padding: 0,
                    fontSize: 14,
                    width: 1,
                }}>
                    <TextField
                        onChange={(e) => setValue(e.target.value)}
                        placeholder='Search'
                        variant='standard'
                        sx={{
                            width: 1,
                        }}
                        InputProps={{
                            disableUnderline: true,
                            sx: {
                                border: 0,
                                fontSize: 15,
                                px: 2,
                                pl: 2.5,
                                py: 0,
                                '& .MuiInputBase-input': {
                                    py: 2
                                }
                            },
                            startAdornment: (
                                <InputAdornment position="start" sx={{ cursor: "default" }}>
                                    <Search />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton size='small' onClick={onClose}>
                                        <Cancel color='error' fontSize='small' />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <Divider sx={{ mx: 2 }} />
                </DialogTitle>
                <DialogContent sx={{
                    px: 0,
                    py: 1,
                    overflowX: "hidden"
                }}>
                    {
                        filterOptions(value, SearchNavOptions).map((e, i) => {
                            if (e.content) {
                                return (
                                    <Box key={i}>
                                        <CustomListOption func={addFn} key={i} open={true} e={e} />
                                        <Stack direction='column' sx={{ width: 1 }}>
                                            {
                                                e.content.map((content, i) => {
                                                    return (
                                                        <CustomListOption func={addFn} key={i} parent={e} open={true} e={content} />
                                                    )
                                                })
                                            }
                                        </Stack>
                                    </Box>
                                )
                            }
                            else return (
                                <CustomListOption key={i} open={true} e={e} />
                            )
                        })
                    }

                </DialogContent>
            </Dialog>
        </>
    );
}

function CustomListOption(props) {
    return (
        <NavOption {...props}
            sx={{
                pt: gap,
            }}
            buttonProps={{
                sx: {
                    gap: 0,
                    height: 45,
                    minHeight: 45,
                },
            }}
            textProps={(theme) => ({
                sx: {
                    fontSize: theme.typography.fontSize,
                    fontWeight: 400,
                    color: "text.primary"
                }
            })}
            iconProps={{ sx: { transform: "scale(.9)" } }}
        />
    )
}
