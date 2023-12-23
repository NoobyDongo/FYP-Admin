import { useTheme } from '@emotion/react';
import { IconButton, Paper } from '@mui/material';
import React, { useEffect } from 'react';
import ImageUploading from 'react-images-uploading';
import ImageIcon from '@mui/icons-material/Image';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';


export default function ImageUpload({ images, maxNumber, onChange, inputProps, ...others }) {

    const theme = useTheme()

    useEffect(() => {
        console.log(images)
    }, [images])

    return (
        <div className="App">
            <ImageUploading
                multiple
                value={images}
                onChange={onChange}
                maxNumber={maxNumber}
                dataURLKey="data_url"
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
                                    if (images.length == 1) {
                                        onImageUpdate(0)
                                    }
                                    else {
                                        onImageUpload(e)
                                    }
                                }}
                                {...dragProps}
                            >
                                {
                                    images.length < 1 &&
                                    <>
                                        <ImageIcon />
                                        {others.imagePlaceholder || "Click or Drop here"}
                                    </>
                                }
                                {
                                    images.length == 1 &&
                                    imageList.map((image, index) => (
                                        <div key={index} style={{width:"100%",height:"100%"}}>
                                            <img  src={image['data_url']} alt="" width="100%" height="100%"
                                                style={{
                                                    objectFit: "contain",
                                                    objectPosition: "center"
                                                }}
                                            />
                                            <IconButton
                                                key={index+1/2}
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
                                    ))
                                }
                            </Paper>
                        }
                        {maxNumber > 1 && <button onClick={onImageUpload} {...dragProps}>Click or Drop here</button>}
                        &nbsp;
                        {maxNumber > 1 && <button onClick={onImageRemoveAll}>Remove all images</button>}

                        {maxNumber > 1 && imageList.map((image, index) => (
                            <div key={index} className="image-item">
                                <img src={image['data_url']} alt="" width="100" />
                                <div className="image-item__btn-wrapper">
                                    <button onClick={() => onImageUpdate(index)}>Update</button>
                                    <button onClick={() => onImageRemove(index)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ImageUploading>
        </div>
    );
}