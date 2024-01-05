import { useTheme } from '@emotion/react';
import { Box, Button, CircularProgress, Collapse, Fade, IconButton, ImageList, ListItem, Paper, Stack, Typography, lighten } from '@mui/material';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ImageIcon from '@mui/icons-material/Image';
import CancelIcon from '@mui/icons-material/Cancel';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { TransitionGroup } from 'react-transition-group';
import ReactImageUploading from 'react-images-uploading';
import { useNotification } from '@/components/Notifications/useNotification';
import { useImageUploadListener } from './useImageUpload';
import axios from 'axios';
import { useProgress, useProgressListener, useRawProgressListener } from '@/utils/useProgress';
import DoneIcon from '@mui/icons-material/Done';
import Image from 'next/image';

const crypto = require('crypto');

function generateUniqueHashedString(extra = "") {
    const timestamp = Date.now().toString() + extra;
    const hash = crypto.createHash('sha256').update(timestamp).digest('hex');
    return hash;
}

const ImageListItemIconWrapper = forwardRef((props, ref) => {
    const {children, sx, ...others} = props
    return (
        <Box ref={ref} sx={{
            position: "absolute",
            height: 1,
            width: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
            ...sx
        }} {...others}>
            {children}
        </Box>
    )
})
ImageListItemIconWrapper.displayName = "ImageListItemIconWrapper";

function ImageListItem({ image, index, ...others }) {

    const { onImageRemove, onImageUpdate } = others
    const uploadIconWrapper = useRef(null)
    const uploadingIcon = useRef(null)
    const uploadedIcon = useRef(null)

    const onUploadingStart = () => {
        uploadIconWrapper.current.style.opacity = 1
        uploadingIcon.current.style.opacity = 1
    }
    const onUploadingEnd = () => {
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
                mb: 1.5,
                flexShrink: 0
            }}>
            <Stack sx={(theme) => ({
                border: 2,
                borderColor: theme.palette.primary.main,
                borderRadius: "50%",
                overflow: "hidden",
                alignContent: "center",
                justifyContent: "center",
                height: 35, width: 35,
                marginRight: .5,
                position: "relative",
            })}>
                <img src={image['data']} alt="" style={{
                    height: "100%", width: "100%",
                    objectFit: "contained",
                    objectPosition: "center"
                }} />
                <div ref={uploadIconWrapper} style={{
                    opacity: 0,
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    backdropFilter: "brightness(0.3) blur(3px) saturate(200%)",
                    transition: "200ms opacity ease",
                }}>
                    <ImageListItemIconWrapper sx={{transition: "200ms opacity ease 50ms"}} ref={uploadingIcon}>
                        <CircularProgress size={20} />
                    </ImageListItemIconWrapper>
                    <ImageListItemIconWrapper  sx={{transition: "200ms opacity ease 100ms"}} ref={uploadedIcon}>
                        <DoneIcon fontSize="small" color="success" sx={(theme) => ({
                            stroke: "currentcolor",
                            strokeWidth: 1,
                            filter: "drop-shadow(0px 0px 5px rgba(0, 0, 0, 1))"
                        })} />
                    </ImageListItemIconWrapper>

                </div>
            </Stack>
            <Typography variant="caption" flex={1} inline="true" noWrap overflow="hidden" textOverflow={"ellipsis"}>{image['file'].name}</Typography>

            <IconButton ml="auto" size="small" color="primary" onClick={() => onImageUpdate(index)}><EditIcon /></IconButton>
            <IconButton size="small" color="error" onClick={() => onImageRemove(index)}><DeleteIcon /></IconButton>

        </Stack>
    )
}

export const ImagesUpload = forwardRef((props, ref) => {
    const { maxNumber = 69, size = 250, ...others } = props
    const [images, setImages] = useState([]);

    useImperativeHandle(ref, () => ({
        getImages(){return images}
    }));

    const onChange = (imageList, addUpdateIndex) => {
        // data for submit
        addUpdateIndex?.forEach((i) => {
            imageList[i].name = generateUniqueHashedString(i)
            imageList[i].isUploading = false
        })
        console.log(imageList, addUpdateIndex);
        setImages(imageList);
    };


    const customOnImageUpload = (onImageUpload, imageList, e) => {
        console.log(imageList, e)
        onImageUpload(e)
    }

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
            // write your building UI
            <Box elevation={1} className="upload__image-wrapper"
                sx={(theme) => ({
                    overflow: "hidden",
                    border: 1,
                    borderRadius: 1,
                    borderColor: theme.palette.border.main,

                    //backgroundColor: lighten(theme.palette.background.default, .1),
                })}>
                <Stack direction="row" >

                    <Box
                        sx={(theme) => ({
                            border: 2,
                            borderColor: isDragging ? theme.palette.primary.main : 'transparent',
                            borderRadius: 1,
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
                        <div {...dragProps} style={{ width: "100%", height: "100%", position: "absolute" }}></div>
                        <FileUploadOutlinedIcon sx={{ height: .5, width: .5, }} />
                        <Typography variant="body2">{others.imagePlaceholder || "Drag and Drop here"}</Typography>

                        <Button onClick={(e) => customOnImageUpload(onImageUpload, imageList, e)} sx={{ mt: 2, borderRadius: 1 }} variant="outlined">Browse</Button>

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
                                overflow: 'hidden'
                            }}>
                                {imageList.map((image) => (
                                    <Collapse {...(singleRecord && { timeout: 0 })} key={image['name']} mountOnEnter unmountOnExit>
                                        <ImageListItem onImageUpdate={onImageUpdate} onImageRemove={onImageRemove} image={image} />
                                    </Collapse>
                                ))}
                            </TransitionGroup>
                        </Box>
                    </Fade>
                </Stack>

                {false && <button onClick={onImageRemoveAll}>Remove all images</button>}


            </Box>
        )
    }, [])


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

export function ImageUpload(props) {

    const theme = useTheme()

    const { name, onChange } = props
    const { images, maxNumber, inputProps, ...others } = props

    useEffect(() => {
        console.log(images)
    }, [images])

    const onImageChange = (imageList, addUpdateIndex) => {
        onChange({ ...imageList })
        /*
            target: {
                name: name || "image",
                value: imageList[0]?.data || null
            }
        */
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