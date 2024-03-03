import {useSnackbar} from "../../../context/useSnackbar";
import {axiosInstance} from "../../../services/axios";
import API from "../../../config/api";
import {Grid, Modal} from "@mui/material";
import Box from "@mui/material/Box";
import ImageShowModal from "./ShowOriginalImageModal";
import Button from "@mui/material/Button";
import * as React from "react";

const ProcessedImageModal = (
    {
        open,
        onClose,
        modalTitle,
        modalContent,
        showImageModalOpen,
        handleShowImageModalClose,
        showImageSrc,
        showImageTitle,
        generateImageId,
        setRefresh
    }) => {

    const {openSnackbar} = useSnackbar();
    const handleSaveAsOriginal = () => {
        axiosInstance.put(API.image.imageElevate.replace('{generatedImageId}', generateImageId), {})
            .then((response) => {
                console.log(response.data)
                openSnackbar('Saved successfully.', 'success');
                handleShowImageModalClose();
                setRefresh(true);
        })
    };
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'white',
          boxShadow: 24,
          p: 4,
        }}
      >
        <h2 id="action-modal-title">{modalTitle}</h2>
          {modalContent}

          <ImageShowModal
              open={showImageModalOpen}
              onClose={handleShowImageModalClose}
              src={showImageSrc}
              title={showImageTitle}
              bottom={
                  <Grid container justifyContent="flex-end" sx={{marginTop: (theme) => theme.spacing(2)}}>
                      <Button onClick={handleSaveAsOriginal}>As original</Button>
                  </Grid>
              }
          />
      </Box>
    </Modal>
  )
}

export default ProcessedImageModal;