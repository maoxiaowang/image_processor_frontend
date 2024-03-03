import * as React from "react";
import useModal from "../../../hooks/useModal";
import {useRef, useState} from "react";
import {axiosInstance} from "../../../services/axios";
import API from "../../../config/api";
import {Modal} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";


const UploadImageModal = ({
                                    setRefresh
                                }) => {
    const {
        modalOpen: uploadModalOpen,
        handleModalOpen: handleUploadModalOpen,
        handleModalClose: handleUploadModalClose,
    } = useModal();

    // Modal
    const [previewUrl, setPreviewUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    // Data submit
    const formRef = useRef(null);

    const handleUploadButtonClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (formRef.current) {
            const formData = new FormData(formRef.current);
            axiosInstance.post(API.image.imageUpload, formData)
                .then(() => {
                    handleUploadModalClose();
                    // Optionally, reset selectedFile when modal is closed
                    setSelectedFile(null);
                    setRefresh(true)
                })
                .catch(error => {
                    console.error('Upload error:', error);
                });

        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Modal
            open={uploadModalOpen}
            onClose={handleUploadModalClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
            }}>
                <Typography variant="h5" component="h2">Upload Image</Typography>
                <p id="modal-description">Select an image to upload.</p>
                <form method="post" ref={formRef}>
                    <TextField
                        type="text"
                        name="name"
                        label="Name"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    {selectedFile && (
                        <div>
                            <p>Selected:</p>
                            <img src={previewUrl} alt="Preview" style={{maxWidth: '100%', maxHeight: '200px'}}/>
                        </div>
                    )}
                    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={26}
                         sx={{marginTop: (theme) => theme.spacing(2)}}>
                        <Button type="button" onClick={(event) => handleUploadButtonClick(event)}>Upload</Button>
                        {/*<Button onClick={onClose}>Close</Button>*/}
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};


export default React.memo(UploadImageModal);