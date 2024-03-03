import {useCallback, useState} from "react";
import CropIcon from "@mui/icons-material/Crop";
import FlipIcon from "@mui/icons-material/FlipRounded";
import RotateIcon from "@mui/icons-material/RotateLeft";
import BlurIcon from "@mui/icons-material/BlurOn";
import InfoIcon from "@mui/icons-material/Info";
import {Grid, ImageList, ImageListItem, ImageListItemBar, Modal} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ImageShowModal from "./ShowOriginalImageModal";
import * as React from "react";

const GeneratedImagesModal = (
    {
        open,
        onClose,
        title,
        data,
    }) => {
    const [innerModalOpen, setInnerModalOpen] = useState(false);
    const [innerModalTitle, setInnerModalTitle] = useState('');
    const [innerModalImageSrc, setInnerModalImageSrc] = useState('');

    const handleInnerModalOpen = useCallback((src, action, id) => {
        setInnerModalTitle(`${action}-${id}`);
        setInnerModalImageSrc(src);
        setInnerModalOpen(true);
    }, []);
    const handleInnerModalClose = useCallback(() => {
        setInnerModalOpen(false)
    }, []);
    const renderActionIcon = (action) => {
        console.log(action)
        switch (action.toLowerCase()) {
            case 'crop':
                return <CropIcon/>;
            case 'flip':
                return <FlipIcon/>;
            // 可以根据需要添加更多的 case
            case 'rotate':
                return <RotateIcon/>
            case 'blur':
                return <BlurIcon/>
            default:
                return <InfoIcon/>;
        }
    };
  return (
      <Modal
          open={open}
          onClose={onClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{overflow:'scroll'}}
      >
          <Box className="showImageModalBox">
              <Grid container spacing={2} sx={{marginBottom: (theme) => theme.spacing(1)}}>
                  <Grid item xs={8}>
                      <Typography variant="h6" component="h2">
                          {title}
                      </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="right">
                      <Button onClick={onClose}>Close</Button>
                  </Grid>
              </Grid>
              <ImageList variant="masonry" cols={2} gap={8}>
                  {data.map((item) => (
                      <ImageListItem key={item.id}>
                          <Tooltip title="Click to see original image" placement="top">
                              <img
                                  srcSet={`${item.processed_image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                  src={`${item.processed_image}?w=248&fit=crop&auto=format`}
                                  alt={item.action}
                                  loading="lazy"
                                  onClick={() => handleInnerModalOpen(item.processed_image, item.action, item.id)}
                                  style={{ width: '100%', cursor: 'pointer' }}
                              />
                          </Tooltip>
                          <ImageListItemBar
                              title={`${item.action}-${item.id}`}
                              subtitle={`${item.width}x${item.height}`}
                              actionIcon={
                                  <IconButton
                                      sx={{color: 'rgba(255, 255, 255, 0.54)'}}
                                      aria-label={`info about ${item.action}`}
                                  >
                                      {renderActionIcon(item.action)}
                                  </IconButton>
                              }
                              position="below"
                          />
                      </ImageListItem>

                  ))}
              </ImageList>

              <ImageShowModal
              open={innerModalOpen}
              onClose={handleInnerModalClose}
              src={innerModalImageSrc}
              title={innerModalTitle}
          />
          </Box>
      </Modal>

  )
}

export default GeneratedImagesModal;