import * as React from 'react';
import PropTypes from 'prop-types';
import {alpha} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/CloudUpload';
import {visuallyHidden} from '@mui/utils';
import {Container} from "@mui/system";
import {Link as RouterLink} from 'react-router-dom';
import ButtonAppBar from "../../components/AppBar";
import {useCallback, useEffect, useRef, useState} from "react";
import {axiosInstance} from "../../services/axios";
import API from "../../config/api";
import {
    Avatar,
    Breadcrumbs,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl, Grid, ImageList, ImageListItem, ImageListItemBar, InputLabel,
    Link, ListItemIcon, Menu, MenuItem,
    Modal, Select, Skeleton
} from "@mui/material";
import ROUTES from "../../config/route";
import useModal from "../../hooks/useModal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import useDialog from "../../hooks/useDialog";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CropIcon from "@mui/icons-material/Crop";
import FlipIcon from "@mui/icons-material/FlipRounded";
import BlurIcon from "@mui/icons-material/BlurOn";
import RotateIcon from "@mui/icons-material/RotateLeft";
import InfoIcon from '@mui/icons-material/Info'
import {format, parseISO} from 'date-fns';
import '../../assets/styles/image/imageList.css';
import {Field, Form, Formik} from "formik";
import ErrorMessage from "../../components/form/ErrorMessage";
import {capitalize} from "../../utils";
import {useSnackbar} from "../../context/useSnackbar";



const EnhancedTableToolbar = React.memo((props) => {
    console.log('RUN EnhancedTableToolbar', props)
    const {
        numSelected,
        handleUploadModalOpen,
        setDialogTitle,
        setDialogContent,
        handleDialogOpen,
    } = props;


    const handleImageDelete = () => {
        setDialogTitle('Caution')
        setDialogContent(numSelected + ' 张图片将被删除（及其生成的所有图片）')
        handleDialogOpen()
    };

    return (
        <Toolbar
            sx={{
                pl: {sm: 2},
                pr: {xs: 1, sm: 1},
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{flex: '1 1 100%'}}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{flex: '1 1 100%'}}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Images
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton onClick={handleImageDelete}>
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Upload">
                    <IconButton onClick={handleUploadModalOpen}>
                        <UploadFileIcon/>
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
});

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};


const ShowImageModal = (props) => {
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


const RowActionMenu = React.memo((
    {
        rowId,
        menuAnchorEl,
        handleMenuClose,
        handleMenuItemClick
    }) => {
    return (
        <Menu
            id={`actions-menu-${rowId}`}
            anchorEl={menuAnchorEl[rowId]}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={Boolean(menuAnchorEl[rowId])}
            onClose={(event, reason) => handleMenuClose(event, reason, rowId)}
        >
            <MenuItem
                onClick={(event) => handleMenuItemClick(event, 'crop', rowId)}>
                <ListItemIcon>
                    <CropIcon fontSize="small"/>
                </ListItemIcon>
                裁剪
            </MenuItem>
            <MenuItem
                onClick={(event) => handleMenuItemClick(event, 'flip', rowId)}>
                <ListItemIcon>
                    <FlipIcon fontSize="small"/>
                </ListItemIcon>
                翻转
            </MenuItem>
            <MenuItem
                onClick={(event) => handleMenuItemClick(event, 'blur', rowId)}>
                <ListItemIcon>
                    <BlurIcon fontSize="small"/>
                </ListItemIcon>
                模糊
            </MenuItem>
            <MenuItem
                onClick={(event) => handleMenuItemClick(event, 'rotate', rowId)}>
                <ListItemIcon>
                    <RotateIcon fontSize="small"/>
                </ListItemIcon>
                旋转
            </MenuItem>
        </Menu>
    )
});


const ActionModal = (
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

          <ShowImageModal
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
};


const GeneratedImagesModal = (
    {
        open,
        handleClose,
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
          onClose={handleClose}
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
                      <Button onClick={handleClose}>Close</Button>
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

              <ShowImageModal
              open={innerModalOpen}
              onClose={handleInnerModalClose}
              src={innerModalImageSrc}
              title={innerModalTitle}
          />
          </Box>
      </Modal>

  )
}


export default function ImageListPage() {
    console.log('RUN ImageListPage')

    useEffect(() => {
        console.log('ImageListPage component mounted');
    }, []); // 空数组表示只在组件挂载时执行

    // Table
    const [rows, setRows] = React.useState([]);

    const {
        modalOpen: uploadModalOpen,
        handleModalOpen: handleUploadModalOpen,
        handleModalClose: handleUploadModalClose,
    } = useModal();

    // Data refreshing
    const [refresh, setRefresh] = React.useState(true);
    useEffect(() => {
        if (refresh) {
            console.log('useEffect refreshData')
            axiosInstance.get(API.image.imageList)
                .then(response => {
                    console.log(response.data);
                    setRows(response.data.results);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                })
                .finally(() => {
                    setRefresh(false);
                });
            setRefresh(false)
        }
    }, [refresh]);


    // Dialog conformation
    const {
        dialogOpen,
        dialogTitle,
        dialogContent,
        setDialogTitle,
        setDialogContent,
        handleDialogOpen,
        handleDialogClose,
    } = useDialog();

    const {
        modalOpen: showImageModalOpen,
        handleModalOpen: handleShowImageModalOpen,
        handleModalClose: handleShowImageModalClose,
    } = useModal();

    // Original image shown
    const [originalImageSrc, setOriginalImageSrc] = React.useState('');
    const [originalImageName, setOriginalImageName] = React.useState('');

    // Action menu
    const [menuAnchorEl, setMenuAnchorEl] = React.useState({});

    // 使用 useCallback 确保函数引用不变
    const handleMenuOpen = useCallback((event, rowId) => {
        console.log('RUN handleMenuOpen')
        event.stopPropagation();
        setMenuAnchorEl((prevMenuAnchorEl) => ({
            ...prevMenuAnchorEl,
            [rowId]: event.currentTarget,
        }));
    }, [setMenuAnchorEl]);

    // 使用 useCallback 确保函数引用不变
    const handleMenuClose = useCallback((event, reason, rowId) => {
        console.log('RUN handleMenuClose', 'reason: ' + reason)
        event.stopPropagation();
        setMenuAnchorEl((prevMenuAnchorEl) => ({
            ...prevMenuAnchorEl,
            [rowId]: null,
        }));
    }, [setMenuAnchorEl]);

    const {
        modalOpen: actionModalOpen,
        setModalOpen: setActionModalOpen,
        modalTitle: actionModalTitle,
        setModalTitle: setActionModalTitle,
        modalContent: actionModalContent,
        setModalContent: setActionModalContent
    } = useModal();
    const [generatedImageId, setGeneratedImage] = useState(null);

    const handleActionModalOpen = useCallback((action) => {
        console.log('handleActionModalOpen')
        setActionModalTitle(capitalize(action));
        setActionModalOpen(true)
    }, [setActionModalOpen, setActionModalTitle])

    const handleActionModalClose = useCallback(() => {
        console.log('handleActionModalOpen')
        setActionModalOpen(false)
    }, [setActionModalOpen]);

    const [processedImageModalOpen, setProcessedImageModalOpen] = useState(false);
    const [processedImageModalTitle, setProcessedImageModalTitle] = useState('');
    const [processedImageSrc, setProcessedImageSrc] = useState('');

    const handleProcessedImageModalClose = useCallback(() => {
        setProcessedImageModalOpen(false);
    }, []);

    const handleActionSubmit = useCallback((action, rowId, values) => {
        console.log('handleActionSubmit', action, rowId)
        const url = API.image.imageProcess.replace('{imageId}', rowId).replace('{action}', action)
        axiosInstance.put(url, values).then((response) => {
            const data = response.data;
            setProcessedImageSrc(data.processed_image);
            const title = `Processed Image (${(capitalize(action))}) [${data.width}x${data.height}]`
            setProcessedImageModalTitle(title);
            setProcessedImageModalOpen(true);
            setGeneratedImage(data.id);
            setRefresh(true);
        }).catch((reason) => {
            console.log('reason', reason)
        })
    }, [])

    // 处理菜单项点击的逻辑
    const handleMenuItemClick = useCallback((event, action, rowId) => {
        console.log('RUN handleMenuItemClick', event, action, rowId)
        event.preventDefault();
        event.stopPropagation();

        let modelContent = '<></>';
        switch (action) {
            case 'crop':
                // 处理裁剪操作
                modelContent = () => {
                    return (
                        <Formik
                            initialValues={{width: '', height: ''}}
                            validate={values => {
                                const errors = {};
                                if (!values.width) {
                                    errors.width = 'Width is required.';
                                } else if (
                                    !/^[1-9]\d*$/.test(values.width)
                                ) {
                                    errors.width = 'A positive integer is required.';
                                }
                                if (!values.height) {
                                    errors.height = 'Height is required.';
                                } else if (
                                    !/^[1-9]\d*$/.test(values.height)
                                ) {
                                    errors.height = 'A positive integer is required.';
                                }
                                return errors;
                            }}
                            onSubmit={(values, {setSubmitting}) => {
                                handleActionSubmit(action, rowId, values);
                                setSubmitting(false);
                            }}
                        >
                            {({isSubmitting}) => (
                                <Form>
                                    <Field
                                        type="number"
                                        name="width"
                                        as={TextField}
                                        label="Width"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                    />
                                    <ErrorMessage name="width"/>
                                    <Field
                                        type="number"
                                        name="height"
                                        as={TextField}
                                        label="Height"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                    />
                                    <ErrorMessage name="height"/>
                                    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={26}
                                         sx={{marginTop: (theme) => theme.spacing(2)}}>
                                        <Button type="submit" disabled={isSubmitting}>
                                            Submit
                                        </Button>
                                        <Button onClick={handleActionModalClose}>Close</Button>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    )
                }
                break;
            case 'flip':
                modelContent = () => {
                    return (
                        <Formik
                            initialValues={{axis: ''}}
                            validate={values => {
                                const errors = {};
                                if (!values.axis) {
                                    errors.axis = 'Axis is required.';
                                } else if (
                                    !/^[1-9]\d*$/.test(values.axis)
                                ) {
                                    errors.axis = 'A positive integer is required.';
                                }
                                return errors;
                            }}
                            onSubmit={(values, {setSubmitting}) => {
                                handleActionSubmit(action, rowId, values);
                                setSubmitting(false);
                            }}
                        >
                            {({isSubmitting}) => (
                                <Form>
                                    <Field
                                        type="number"
                                        name="axis"
                                        as={TextField}
                                        label="Axis"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                    />
                                    <ErrorMessage name="axis"/>
                                    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={26}
                                         sx={{marginTop: (theme) => theme.spacing(2)}}>
                                        <Button type="submit" disabled={isSubmitting}>
                                            Submit
                                        </Button>
                                        <Button onClick={handleActionModalClose}>Close</Button>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    )
                };
                break;
            case 'rotate':
                modelContent = () => {
                    return (
                        <Formik
                            initialValues={{angle: ''}}
                            validate={values => {
                                const errors = {};
                                if (!values.angle) {
                                    errors.angle = 'Angle is required.';
                                } else if (
                                    !/^[1-9]\d*$/.test(values.angle)
                                ) {
                                    errors.angle = 'A positive integer is required.';
                                }
                                return errors;
                            }}
                            onSubmit={(values, {setSubmitting}) => {
                                handleActionSubmit(action, rowId, values);
                                setSubmitting(false);
                            }}
                        >
                            {({isSubmitting}) => (
                                <Form>
                                    <Field
                                        type="number"
                                        name="angle"
                                        as={TextField}
                                        label="Angle"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                    />
                                    <ErrorMessage name="angle"/>
                                    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={26}
                                         sx={{marginTop: (theme) => theme.spacing(2)}}>
                                        <Button type="submit" disabled={isSubmitting}>
                                            Submit
                                        </Button>
                                        <Button onClick={handleActionModalClose}>Close</Button>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    )
                };
                break;
            case 'blur':
                modelContent = () => {
                    return (
                        <Formik
                            initialValues={{mode: ''}}
                            validate={values => {
                                const errors = {};
                                if (!values.mode) {
                                    errors.mode = 'Mode is required.';
                                }
                                return errors;
                            }}
                            onSubmit={(values, {setSubmitting}) => {
                                handleActionSubmit(action, rowId, values);
                                setSubmitting(false);
                            }}
                        >
                            {({isSubmitting}) => (
                                <Form>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Mode</InputLabel>
                                        <Field
                                            as={Select}
                                            name="mode"
                                            labelId="blur-mode-label"
                                            label="Mode"
                                            fullWidth
                                        >
                                            <MenuItem value="mean">Mean</MenuItem>
                                            <MenuItem value="median">Median</MenuItem>
                                            <MenuItem value="gaussian">Gaussian</MenuItem>
                                        </Field>
                                    </FormControl>
                                    <ErrorMessage name="mode"/>
                                    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={26}
                                         sx={{marginTop: (theme) => theme.spacing(2)}}>
                                        <Button type="submit" disabled={isSubmitting}>
                                            Submit
                                        </Button>
                                        <Button onClick={handleActionModalClose}>Close</Button>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    )
                };
                break;
            default:
                break;
        }

        setActionModalTitle(capitalize(action))
        setActionModalContent(modelContent)
        handleActionModalOpen(action);

        setMenuAnchorEl((prevMenuAnchorEl) => ({
            ...prevMenuAnchorEl,
            [rowId]: null,
        }));
    }, [setActionModalTitle, setActionModalContent, handleActionModalOpen, handleActionModalClose, handleActionSubmit]);

    const handleThumbnailClick = useCallback((event, originalImage, originalImageName) => {
        event.stopPropagation();
        setOriginalImageSrc(originalImage);
        setOriginalImageName(originalImageName);
        handleShowImageModalOpen();
    }, [handleShowImageModalOpen]);

    // React.useEffect(() => {
    //     // 在menuAnchorEl发生变化时进行处理
    //     // 可以在这里处理关闭菜单时的逻辑，使用menuAnchorEl中的信息
    //     console.log('useEffect menuAnchorEl', menuAnchorEl)
    // }, [menuAnchorEl]);

    const [generatedImagesModalTitle, setGeneratedImagesModalTitle] = useState('');
    const [generatedImagesModalOpen, setGeneratedImagesModalOpen] = useState(false);
    const [generatedImageData, setGeneratedImageData] = useState([]);

    const handleGeneratedImagesModalClose = () => {
        setGeneratedImagesModalOpen(false);
    }

    const handleGenerationViewClick = (event, rowId, imageName) => {
        axiosInstance.get(API.image.imageDetail.replace('{imageId}', rowId))
            .then((response) => {
                setGeneratedImageData(response.data.generations);
            })
        event.stopPropagation();
        setGeneratedImagesModalTitle(`${imageName}`);
        setGeneratedImagesModalOpen(true);
    }


        console.log('RUN DeleteConfirmDialog', selected)
    const handleImageDeleteConfirm = useCallback(() => {
        const imageIds = selected.join(",");
        axiosInstance.delete(API.image.imageMultiDelete.replace('{imageIds}', imageIds))
            .then(result => {
                console.log(result)
                setRefresh(true);
                handleDialogClose();
                setSelected([]);
            })
    }, [selected, setRefresh, handleDialogClose, setSelected]);

    return (
        <Container>
            <ButtonAppBar/>
            <Typography variant="h4" component={'h1'} sx={{marginY: 2}}>
                Images
            </Typography>
            <Breadcrumbs aria-label="breadcrumb" sx={{
                marginTop: theme => theme.spacing(1),
                marginBottom: theme => theme.spacing(2)
            }}>
                <Link component={RouterLink} underline="hover" color="inherit" to={ROUTES.homePage}>
                    Home
                </Link>
                <Typography color="text.primary">Images</Typography>
            </Breadcrumbs>

            <EnhancedTable
                rows={rows}
                setRows={setRows}
                handleUploadModalOpen={handleUploadModalOpen}
                setRefresh={setRefresh}
            />

        <UploadModal
            open={uploadModalOpen}
            onClose={handleUploadModalClose}
            handleModalClose={handleUploadModalClose}
            setRefresh={setRefresh}
        />
    <ShowImageModal
        open={showImageModalOpen}
        onClose={handleShowImageModalClose}
        src={originalImageSrc}
        title={originalImageName}
    />
    <ActionModal
        open={actionModalOpen}
        onClose={handleActionModalClose}
        modalTitle={actionModalTitle}
        modalContent={actionModalContent}
        showImageSrc={processedImageSrc}
        showImageTitle={processedImageModalTitle}
        showImageModalOpen={processedImageModalOpen}
        handleShowImageModalClose={handleProcessedImageModalClose}
        generateImageId={generatedImageId}
        setRefresh={setRefresh}

    />
    <GeneratedImagesModal
        title={generatedImagesModalTitle}
        handleClose={handleGeneratedImagesModalClose}
        open={generatedImagesModalOpen}
        data={generatedImageData}
    />
            <DeleteConfirmDialog
                setRefresh={setRefresh}
                selected={selected}
                setSelected={setSelected}
                dialogOpen={dialogOpen}
                dialogContent={dialogContent}
                dialogTitle={dialogTitle}
                handleDialogClose={handleDialogClose}
            />

        </Container>
    )
}