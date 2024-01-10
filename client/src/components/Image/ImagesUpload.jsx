'use client'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ImageIcon from '@mui/icons-material/Image';
import CancelIcon from '@mui/icons-material/Cancel';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import ReactImageUploading from 'react-images-uploading';
import useRawProgressListener from "@/components/Progress/useProgress/useRawProgressListener";
import DoneIcon from '@mui/icons-material/Done';
import Image from 'next/image';
import bytesToSize from '@/utils/bytesToSize';
import generateUniqueHashedString from '@/utils/hash/generateUniqueHashedString';
import OutlinedDiv from '../OutlinedDiv';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import useHistory from './useHistory';

const ImageListItemIconWrapper = forwardRef((props, ref) => {
    const { children, sx, ...others } = props
    return (
        <Box ref={ref} sx={{
            position: "absolute",
            height: 1,
            width: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...sx
        }} {...others}>
            {children}
        </Box>
    )
})
ImageListItemIconWrapper.displayName = "ImageListItemIconWrapper";

const CopyToClipboardButton = ({ children, ...others }) => {
    const handleClick = () => navigator.clipboard.writeText(children)

    return <Button {...others} onClick={handleClick}>{children}</Button>
}

function ImageListItem({ disabled, image, index, link, ...others }) {

    const { onImageRemove, onImageUpdate } = others
    const uploadIconWrapper = useRef(null)
    const uploadingIcon = useRef(null)
    const uploadedIcon = useRef(null)
    const ImageWrapper = useRef(null)

    const onUploadingStart = (e) => {
        ImageWrapper.current.style.borderWidth = 0
        ImageWrapper.current.style.padding = 2
        uploadIconWrapper.current.style.opacity = 1
        uploadingIcon.current.style.opacity = 1
    }
    const onUploadingEnd = (e) => {
        uploadingIcon.current.style.opacity = 0
        uploadedIcon.current.style.opacity = 1
    }
    useRawProgressListener(image.name, onUploadingStart, onUploadingEnd)

    return (
        <Stack direction="row"
            sx={{
                overflow: "visible",
                alignItems: "center",
                position: "relative",
                gap: .5,
                mb: 2,
                flexShrink: 0
            }}>
            <Stack ref={ImageWrapper} sx={(theme) => ({
                margin: .2,
                border: 2,
                borderColor:'transparent',
                outline: 2,
                outlineColor: image['data'] ? theme.palette.primary.main : theme.palette.action.disabled,
                borderRadius: "50%",
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
                height: 35, width: 35,
                marginRight: .8,
                position: "relative",
                userSelect: "none",
            })}>
                <img src={image['data'] || link + image['name']} alt="" style={{
                    height: "100%", width: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    objectPosition: "center",
                }} />
                <div ref={uploadIconWrapper} style={{
                    opacity: 0,
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    backdropFilter: "brightness(0.3) blur(3px) saturate(200%)",
                    transition: "200ms opacity ease",
                }}>
                    <ImageListItemIconWrapper sx={{ transition: "200ms opacity ease 50ms", opacity: 0 }} ref={uploadingIcon}>
                        <CircularProgress size={25} />
                    </ImageListItemIconWrapper>
                    <ImageListItemIconWrapper sx={{ transition: "200ms opacity ease 100ms", opacity: 0 }} ref={uploadedIcon}>
                        <DoneIcon fontSize="small" color="success" sx={(theme) => ({
                            stroke: "currentcolor",
                            strokeWidth: 1,
                            filter: "drop-shadow(0px 0px 5px rgba(0, 0, 0, 1))"
                        })} />
                    </ImageListItemIconWrapper>

                </div>
            </Stack>
            <Stack flex={1} overflow="hidden">

                <Typography variant="body2"
                    {...(!image['data'] && {
                        fontStyle: "italic",
                    })}
                    fontSize={12}
                    inline="true"
                    noWrap textOverflow={"ellipsis"}
                >
                    {image['file']?.name || image['name']}
                </Typography>
                <Typography
                    variant="caption"
                    fontSize={10}
                    sx={(theme) => ({ color: theme.palette.text.disabled })}
                    noWrap
                >
                    {image['size'] || "uploaded to server"}
                </Typography>
            </Stack>
            <IconButton disabled={disabled} ml="auto" size="small" color="primary" onClick={() => onImageUpdate(index)}>
                <EditIcon />
            </IconButton>
            <IconButton disabled={disabled} size="small" color="error" onClick={() => onImageRemove(index)}>
                {image['data'] && <RemoveCircleOutlineIcon />}
                {!image['data'] && <DeleteIcon />}
            </IconButton>

        </Stack>
    )
}

const IconButtonWithTooltip = ({ label, disabled, onClick, children, ...other }) => {
    const adjustedButtonProps = {
        disabled: disabled,
        onClick: disabled ? undefined : onClick
    };
    return (
        <Tooltip title={label}>
            <div>
                <IconButton {...other} {...adjustedButtonProps}>
                    {children}
                </IconButton>
            </div>
        </Tooltip>
    );
};

const ImagesUpload = forwardRef((props, ref) => {
    const { maxNumber = 69, size = 250, onChange: changeParent } = props
    const simpleMode = maxNumber <= 1
    const { name = 'images', required = false, disabled = false } = props
    const { value = simpleMode ? {} : [], ...others } = props
    const { link = "" } = props
    const [images, setImages] = useState([]);


    useImperativeHandle(ref, () => ({
        getImages() { return simpleMode ? images[0] : images },
        clear() {
            setImages(simpleMode ? {} : [])
            history.current = [simpleMode ? {} : []]
            pointer.current = 0
        }
    }));

    const { history, pointer, add: addToHistory, undo, redo, numUndo, numRedo } = useHistory(value, setImages, (value) => value.map((image) => image['data'] || image['name']))


    useEffect(() => {
        setImages(value)
    }, [])

    const onChange = (imageList, addUpdateIndex) => {
        addUpdateIndex?.forEach((i) => {
            imageList[i].name = generateUniqueHashedString(i)
            imageList[i].isUploading = false
            imageList[i].size = bytesToSize(imageList[i].file.size)
        })
        console.log("imageList", imageList, "addUpdateIndex", addUpdateIndex);
        changeParent?.(simpleMode ? imageList[0] : imageList)
        setImages(imageList)

        addToHistory(imageList)
    };

    const customUI = useCallback(({
        imageList,
        onImageUpload,
        onImageRemoveAll,
        onImageUpdate,
        onImageRemove,
        isDragging,
        dragProps,
    }) => {
        var full = imageList.length > 0
        var singleRecord = imageList.length == 1
        console.log(imageList)
        return (
            <OutlinedDiv sx={(theme) => ({
                padding: 0,
                position: 'relative',
            })} boxSx={(theme) => ({
                ...(!disabled && {
                    '& .MuiOutlinedInput-notchedOutline, .MuiOutlinedInput-notchedOutline.Mui-focused': {
                        borderWidth: `${isDragging ? 2 : 1}px !important`,
                        borderColor: `${isDragging ? theme.palette.primary.main : theme.palette.input.border.main} !important`,
                    },

                    '& .MuiFormLabel-root': {
                        color: `${isDragging ? theme.palette.primary.main : theme.palette.input.label.main} !important`
                    },
                })

            })} label={name} fullWidth={!simpleMode} disabled={disabled} required={required}>

                <Stack direction="row">

                    <Box
                        sx={(theme) => ({
                            boxSizing: "border-box",
                            backgroundColor: "transparent",
                            color: isDragging ? theme.palette.primary.main : theme.palette.text.disabled,
                            height: others.height || size,
                            width: full ? size : 1,
                            transition: `200ms width ease ${full ? 0 : 250}ms`,
                            padding: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            userSelect: "none",
                            overflow: "hidden",
                            position: 'relative',
                            gap: .5,
                            flexShrink: 0,
                        })}
                    >
                        <FileUploadOutlinedIcon sx={{ height: .5, width: .5, }} />
                        <Typography variant="body2">{others.imagePlaceholder || "Drag and Drop here"}</Typography>
                        <div style={{ width: "100%", height: "100%", position: "absolute" }} {...dragProps} draggable="true"></div>
                        <Button disabled={disabled} onClick={onImageUpload} sx={{ mt: 2, borderRadius: 1 }} variant="outlined">Browse</Button>

                    </Box>

                    <Fade in={full}>
                        <Box sx={{
                            overflowX: "hidden",
                            overflowY: "auto",
                            height: size,
                            flex: 1,
                            borderRadius: 1
                        }}>
                            <TransitionGroup style={{
                                display: "flex",
                                flexDirection: "column",
                                padding: 16,
                                paddingBottom: 32,
                                overflow: 'hidden'
                            }}>
                                {imageList.map((image, index) => (
                                    <Collapse {...(singleRecord && { timeout: 0 })} key={image['name']} mountOnEnter unmountOnExit>
                                        <ImageListItem link={link} disabled={disabled} index={index} onImageUpdate={onImageUpdate} onImageRemove={onImageRemove} image={image} />
                                    </Collapse>
                                ))}
                            </TransitionGroup>
                        </Box>
                    </Fade>
                </Stack>
                <HoverButtonGroup>
                    <IconButtonWithTooltip
                        label="Remove all images"
                        disabled={imageList.length < 1 || disabled}
                        onClick={onImageRemoveAll}
                        color="error"
                        size="small"
                    >
                        <CancelIcon />
                    </IconButtonWithTooltip>
                    <IconButtonWithTooltip
                        label="Undo"
                        disabled={numUndo() <= 0 || disabled}
                        onClick={undo}
                        color="primary"
                        size="small"
                    >
                        <UndoIcon />
                    </IconButtonWithTooltip>
                    <IconButtonWithTooltip
                        label="Redo"
                        disabled={numRedo() <= 0 || disabled}
                        onClick={redo}
                        color="primary"
                        size="small"
                    >
                        <RedoIcon />
                    </IconButtonWithTooltip>
                </HoverButtonGroup>

            </OutlinedDiv >
        )
    }, [disabled])


    return (
        <div className="App">
            <ReactImageUploading
                multiple
                value={images}
                onChange={onChange}
                maxNumber={maxNumber}
                dataURLKey="data"
            >
                {customUI}
            </ReactImageUploading>
        </div>
    );
})
ImagesUpload.displayName = "ImagesUpload"
export default ImagesUpload;

function HoverButtonGroup({ children }) {

    const [expand, setExpand] = useState(false)
    const [locked, setLocked] = useState(false)

    return (
        <Box sx={(theme) => ({
            backdropFilter: "blur(3px) saturate(200%)",
            position: "absolute",
            bottom: 12,
            right: 24,
            borderRadius: 30,
            border: 1,
            borderColor: theme.palette.input.border.main,
            px: .25,
            py: .25,
        })}>
            <div style={{
                height: "fit-content",
                width: "fit-content",
                display: "flex",
                flexDirection: "row-reverse",
                alignContent: "center",
                alignItems: "center",
            }}
                onMouseEnter={() => setExpand(true)}
                onMouseLeave={() => setExpand(false)}
            >
                <IconButton size='small' onClick={() => setLocked(!locked)}
                    sx={{
                        transition: "200ms transform ease",
                        transform: `rotate(${locked ? 45 : 0}deg)`
                    }}
                >
                    <MoreVertIcon />
                </IconButton>

                {children.map((child, index) => {

                    let transitionDelay = expand ? index * 15 : (children.length - index) * 25
                    let transitionDuration = 200 + transitionDelay

                    return (
                        <Collapse key={index} orientation='horizontal' style={{ transitionDelay: `${transitionDelay}ms` }} in={expand || locked} timeout={transitionDuration} unmountOnExit mountOnEnter>
                            <div style={{ paddingRight: 8 }}>
                                {child}
                            </div>
                        </Collapse>
                    )
                }
                )}
            </div>
        </Box>
    )
}

export function ImageUpload(props) {
    const theme = useTheme()

    const { name, onChange } = props
    const { images, maxNumber, inputProps, ...others } = props

    useEffect(() => {
        console.log(images)
    }, [images])

    const onImageChange = (imageList, addUpdateIndex) => {
        onChange({ ...imageList })
    }

    return (
        <div className="App">
            <ReactImageUploading
                multiple
                value={images}
                onChange={onImageChange}
                maxNumber={maxNumber}
                dataURLKey="data"
                inputProps={{
                    ...inputProps
                }}
            >
                {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                }) => (
                    // write your building UI
                    <div className="upload__image-wrapper">

                        {maxNumber <= 1 &&
                            <Paper
                                elevation={1}
                                sx={{
                                    backgroundColor: "transparent",
                                    color: isDragging ? theme.palette.primary.main : theme.palette.text.disabled,
                                    border: isDragging ? 2 : 0,
                                    borderColor: isDragging ? theme.palette.primary.main : 'transparent',
                                    height: others.height || 200,
                                    width: others.width || 200,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    userSelect: "none",
                                    overflow: "hidden",
                                    position: 'relative',
                                }}
                                onClick={(e) => {
                                    if (images?.length == 1) {
                                        onImageUpdate(0)
                                    }
                                    else {
                                        onImageUpload(e)
                                    }
                                }}
                                {...dragProps}
                            >
                                {
                                    (images?.length < 1 || !images) &&
                                    <>
                                        <ImageIcon />
                                        {others.imagePlaceholder || "Click or Drop here"}
                                    </>
                                }
                                {
                                    maxNumber == 1 && images &&
                                    <div style={{ width: "100%", height: "100%" }}>
                                        <Image src={images} alt=""
                                            height={others.height || 200}
                                            width={others.width || 200}
                                            style={{
                                                objectFit: "contain",
                                                objectPosition: "center"
                                            }}
                                        />
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onImageRemoveAll(e)
                                            }}
                                            color="error"
                                            sx={{
                                                position: "absolute",
                                                bottom: 8,
                                                right: 8,
                                                height: 30,
                                                width: 30,
                                            }}>
                                            <CancelIcon />
                                        </IconButton>
                                    </div>

                                }
                            </Paper>
                        }
                        {maxNumber > 1 && <button onClick={onImageUpload} {...dragProps}>Click or Drop here</button>}
                        &nbsp;
                        {maxNumber > 1 && <button onClick={onImageRemoveAll}>Remove all images</button>}

                        {maxNumber > 1 && imageList.map((image, index) => (
                            <div key={index} className="image-item">
                                <Image src={image['data']} alt="" height={others.height || 200} width={others.width || 200} />
                                <div className="image-item__btn-wrapper">
                                    <button onClick={() => onImageUpdate(index)}>Update</button>
                                    <button onClick={() => onImageRemove(index)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ReactImageUploading>
        </div>
    );
}