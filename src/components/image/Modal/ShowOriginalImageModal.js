import {useEffect, useState} from "react";
import {Grid, Modal, Skeleton} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import * as React from "react";


const ShowOriginalImageModal = (props) => {
    /**
     * Show single image modal
     */
    const {
        open,
        onClose,
        src,
        title,
        bottom,
    } = props
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const image = new Image();
        image.src = src;

        const handleImageLoad = () => {
            setLoading(false);
        };

        image.addEventListener('load', handleImageLoad);

        return () => {
            image.removeEventListener('load', handleImageLoad);
        };
    }, [src]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="showImageModalBox">
                <Grid container spacing={2} sx={{marginBottom: (theme) => theme.spacing(1)}}>
                    <Grid item xs={8}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {title}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} textAlign="right">
                        <Button onClick={onClose}>Close</Button>
                    </Grid>
                </Grid>
                {loading ? (
        <Skeleton variant="rectangular" width="100%" >
                Loading
        </Skeleton>
                ) : (
                    <img
                        src={src}
                        alt="Original"
                        className="originalImage"
                    />
                )}
                {bottom}
            </Box>
        </Modal>
    )
};

export default React.memo(ShowOriginalImageModal);