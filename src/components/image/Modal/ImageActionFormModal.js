import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const ImageActionFormModal = (
    {
        open,
        onClose,
        onSubmit,
        modalTitle,
        modalContent
    }) => {
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
        <h2 id="modal-title">{modalTitle}</h2>
        <div id="modal-description">{modalContent}</div>
        <Button onClick={onSubmit} variant="text" color="primary">
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default ImageActionFormModal;
