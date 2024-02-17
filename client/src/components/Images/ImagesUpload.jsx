'use client'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';
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
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import useHistory from '../useHistory';
import HoverButtonGroup from '../HoverButtonGroup';
import NextImage from './NextImage';
import useCustomTransition from '@/utils/hooks/useCustomTransition';

const ImageListItemIconWrapper = React.forwardRef((props, ref) => {
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

//think it takes more time on useCallback and useMemo then actually rendering the component lol
function ImageListItem({ disabled, image, index, link, ...others }) {

    const { onImageRemove, onImageUpdate } = others
    const uploadIconWrapper = React.useRef(null)
    const uploadingIcon = React.useRef(null)
    const uploadedIcon = React.useRef(null)
    const ImageWrapper = React.useRef(null)

    const onUploadingStart = React.useCallback(() => {
        ImageWrapper.current.style.borderWidth = 0
        uploadIconWrapper.current.style.opacity = 1
        uploadingIcon.current.style.opacity = 1
    }, [])

    const onUploadingEnd = React.useCallback(() => {
        uploadingIcon.current.style.opacity = 0
        uploadedIcon.current.style.opacity = 1
    }, [])

    const removeImage = React.useCallback(() => {
        onImageRemove(index)
    }, [index, onImageRemove])

    const updateImage = React.useCallback(() => {
        onImageUpdate(index)
    }, [index, onImageUpdate])

    useRawProgressListener(image.name, onUploadingStart, onUploadingEnd)

    const RowSx = React.useMemo(() => ({
        overflow: "visible",
        alignItems: "center",
        position: "relative",
        gap: .5,
        mb: 2,
        flexShrink: 0
    }), [])

    const ImageWrapperSx = React.useCallback((theme) => ({
        margin: .2,
        border: 2,
        borderColor: 'transparent',
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
        boxSizing: 'border-box'
    }), [])

    const IconWrapper = React.useMemo(() => (
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
                <DoneIcon fontSize="small" color="success" sx={{
                    stroke: "currentcolor",
                    strokeWidth: 1,
                    filter: "drop-shadow(0px 0px 5px rgba(0, 0, 0, 1))"
                }} />
            </ImageListItemIconWrapper>
        </div>
    ), [])

    const Image = React.useMemo(() => (
        <NextImage src={image['data'] || link + image['name']} alt=''
            height={35} width={35}
        />
    ), [image, link])


    const Info = React.useMemo(() => (
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
    ), [image])

    const ButtonGroups = React.useMemo(() => (
        <>
            <IconButton disabled={disabled} ml="auto" size="small" color="primary" onClick={updateImage}>
                <EditIcon />
            </IconButton>
            <IconButton disabled={disabled} size="small" color="error" onClick={removeImage}>
                {image['data'] && <RemoveCircleOutlineIcon />}
                {!image['data'] && <DeleteIcon />}
            </IconButton>
        </>
    ), [disabled, image, removeImage, updateImage])

    return (
        <Stack direction="row" sx={RowSx}>
            <Stack ref={ImageWrapper} sx={ImageWrapperSx}>
                {Image}
                {IconWrapper}
            </Stack>
            {Info}
            {ButtonGroups}
        </Stack>
    )
}

//this is indeed faster than before when loading a lot of images
const ImagesUpload = React.forwardRef((props, ref) => {
    const { validationErrors, setValidationErrors,
        maxNumber = 69,
        size = 250,
        onChange: changeParent,
        label,
        name,
        required = false,
        disabled = false,
        value,
        link = "",
        ...others } = props

    const simpleMode = maxNumber <= 1
    const [images, _setImages] = React.useState(value || []);
    const [, startLoading] = useCustomTransition(_setImages)

    const setImages = React.useCallback((value) => startLoading(() => {
        _setImages(value)
    }), [])
    const resetImage = React.useCallback(() => setImages([]), [])
    const comparator = React.useCallback((value) => value.map((image) => image['data'] || image['name']), [])

    React.useImperativeHandle(ref, () => ({
        getValue() { return simpleMode ? images[0] : images },
        clear() {
            resetImage()
            resetHistory()
        }
    }))

    const { add: addToHistory, renderTools, resetHistory } =
        useHistory({
            disabled,
            initialValue: images,
            valueSetter: setImages,
            removeAll: resetImage,
            comparator
        })

    const onChange = React.useCallback((imageList, addUpdateIndex) => {
        if (validationErrors?.[name])
            setValidationErrors({
                ...validationErrors,
                [name]: undefined,
            })
        addUpdateIndex?.forEach((i) => {
            imageList[i].name = generateUniqueHashedString(i)
            imageList[i].isUploading = false
            imageList[i].size = bytesToSize(imageList[i].file.size)
        })
        changeParent?.(simpleMode ? imageList[0] : imageList)
        setImages(imageList)
        addToHistory(imageList)
    }, [changeParent, simpleMode, validationErrors, name, setValidationErrors, setImages, addToHistory])
    
    const customUiContent = React.useCallback(({
        onImageUpdate,
        onImageRemove,
        singleRecord,
        imageList,
        full,
    }) => {
        return (
            <Fade in={full}>
                <Box sx={{
                    overflowX: "hidden",
                    overflowY: "overlay",
                    scrollbarGutter: 'stable',
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
                            <Collapse {...(singleRecord && { timeout: 0 })} key={image['name']}>
                                <ImageListItem link={link} disabled={disabled} index={index}
                                    onImageUpdate={onImageUpdate}
                                    onImageRemove={onImageRemove}
                                    image={image}
                                />
                            </Collapse>
                        ))}
                    </TransitionGroup>
                </Box>
            </Fade>
        )
    }, [disabled, link, size])

    const menu = React.useCallback((images, onImageRemoveAll) => (
        <HoverButtonGroup disabled={disabled} in={!disabled} floating>
            {renderTools({ enableDeleteAll: images.length > 0, remove: onImageRemoveAll })}
        </HoverButtonGroup>
    ), [disabled])

    const customUI = React.useCallback(({
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
        var error = !!validationErrors?.[name]

        const customLoadedContent = customUiContent({
            full,
            onImageUpdate,
            onImageRemove,
            singleRecord,
            imageList,
        })

        return (
            <OutlinedDiv
                label={label}
                active={isDragging}
                fullWidth={!simpleMode}
                disabled={disabled}
                required={required}

                sx={{ position: 'relative', overflow: 'hidden' }}

                error={!isDragging && !!validationErrors?.[name]}
                helperText={validationErrors?.[name]}
            >
                <Stack direction="row">
                    <Box
                        sx={(theme) => ({
                            boxSizing: "border-box",
                            backgroundColor: "transparent",
                            color:
                                isDragging && !disabled ? theme.palette.primary.main :
                                    error ? theme.palette.error.main :
                                        theme.palette.text.disabled,
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
                        <Typography sx={{ height: 20 }} variant="body2">{others.imagePlaceholder || "Drag and Drop here"}</Typography>
                        <div style={{ width: "100%", height: "100%", position: "absolute" }} {...dragProps} draggable="true"></div>
                        <Button disabled={disabled} onClick={onImageUpload} sx={{ mt: 2, borderRadius: 1, height: 35, }} variant="outlined">Browse</Button>
                    </Box>

                    {customLoadedContent}


                </Stack>
                {menu(imageList, onImageRemoveAll)}
            </OutlinedDiv >
        )
    }, [disabled, validationErrors])


    return (
        <div className="ImageUpload">
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

export function ImageUpload(props) {
    const theme = useTheme()

    const { name, onChange } = props
    const { images, maxNumber, inputProps, ...others } = props

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