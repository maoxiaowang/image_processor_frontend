import React, {useRef, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {Typography, Paper, IconButton} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ImageUploadField = ({field, form, onUploadSuccess}) => {
    const [previewUrl, setPreviewUrl] = useState('');
    const inputRef = useRef(null);

    const dropzoneContainerStyle = {
        padding: '16px',
        textAlign: 'center',
        marginBottom: '8px',
        marginTop: '16px',
        border: '2px dashed #ddd',
        borderRadius: '4px',
        backgroundColor: '#fafafa',
        cursor: 'pointer',
    };

    const previewImageStyle = {
        maxWidth: '100%',
        maxHeight: '200px',
        marginTop: '8px',
    };

    const {getRootProps, getInputProps} = useDropzone({
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
        },
        multiple: false,
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            form.setFieldValue(field.name, file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);

            onUploadSuccess(() => setPreviewUrl(''));
        },
    });

    const handleClickDropzone = () => {
        // 手动触发 input 的点击事件
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    return (
        <Paper
            {...getRootProps()}
            elevation={0}
            style={dropzoneContainerStyle}
            onClick={handleClickDropzone}
        >
            <input {...getInputProps()} style={{display: 'none'}} ref={inputRef}/>
            <IconButton component="span" disableRipple>
                <CloudUploadIcon/>
            </IconButton>
            <Typography variant="subtitle2">拖拽文件到此处或点击按钮上传</Typography>
            {previewUrl && <img src={previewUrl} alt="Preview" style={previewImageStyle}/>}
        </Paper>
    );
};

export default ImageUploadField;