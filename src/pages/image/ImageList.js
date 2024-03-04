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
import useAxios from "../../services/useAxios";
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
import ErrorMessage from "../../components/Form/ErrorMessage";
import {capitalize} from "../../utils";
import {useSnackbar} from "../../context/useSnackbar";
import DefaultBackdrop from "../../components/Backdrop/DefaultBackdrop";


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}


const UploadModal = React.memo((
    {
        open,
        onClose,
        handleModalClose,
        setRefresh,
        axiosInstance
    }) => {
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
                    handleModalClose();
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
            open={open}
            onClose={onClose}
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
});


function EnhancedTableHead(props) {
    const {onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    const headCells = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Name',
        },
        {
            id: 'thumbnail',
            numeric: false,
            disablePadding: false,
            label: 'Thumbnail',
        },
        {
            id: 'size',
            numeric: false,
            disablePadding: false,
            label: 'Size',
        },
        {
            id: 'user',
            numeric: false,
            disablePadding: false,
            label: 'User',
        },
        {
            id: 'created_at',
            numeric: false,
            disablePadding: false,
            label: 'Created At',
        },
        {
            id: 'generations',
            numeric: false,
            disablePadding: false,
            label: 'Generations',
        },
        {
            id: 'actions',
            numeric: false,
            disablePadding: false,
            label: '',
        },
    ];

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all items',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}

                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};


const DeleteConfirmDialog = (
    {
        setRefresh,
        selected,
        setSelected,
        dialogOpen,
        dialogTitle,
        dialogContent,
        handleDialogClose,
        axiosInstance
    }) => {
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
    }, [selected, setRefresh, handleDialogClose, setSelected, axiosInstance]);

    return (
        <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {dialogTitle}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {dialogContent}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button color="error" onClick={handleImageDeleteConfirm} autoFocus>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}


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
                        <div style={{ display: 'flex', height: '300px' }}>
        <Skeleton variant="rectangular" width="100%" height='300px'
                  align="center"
                  component="div">
                Loading
        </Skeleton>
    </div>
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
            <MenuItem
                onClick={(event) => handleMenuItemClick(event, 'detect', rowId)}>
                <ListItemIcon>
                    <RotateIcon fontSize="small"/>
                </ListItemIcon>
                靶点检测
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
        setRefresh,
        axiosInstance
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


const EnhancedTable = React.memo((props) => {
    console.log('RUN EnhancedTable', props)
    const {
        rows,
        setRefresh,
        axiosInstance
    } = props;

    console.log('axiosInstance', axiosInstance)

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const {
        modalOpen: uploadModalOpen,
        handleModalOpen: handleUploadModalOpen,
        handleModalClose: handleUploadModalClose,
    } = useModal();

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

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        // Check if the click is on the modal backdrop
        if (event.target.classList.contains('MuiModal-backdrop')) {
            // Do nothing or close the modal if needed
            return;
        }
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        console.log('handleChangePage')
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        console.log('handleChangeRowsPerPage', event.target.value)
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [rows, order, orderBy, page, rowsPerPage],
    );

    // Action menu
    const [menuAnchorEl, setMenuAnchorEl] = useState({});

    const handleMenuOpen = useCallback((event, rowId) => {
        console.log('RUN handleMenuOpen')
        event.stopPropagation();
        setMenuAnchorEl((prevMenuAnchorEl) => ({
            ...prevMenuAnchorEl,
            [rowId]: event.currentTarget,
        }));
    }, [setMenuAnchorEl]);

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
    }, [setRefresh, axiosInstance])

    // 处理菜单项点击的逻辑
    const handleMenuItemClick = useCallback((event, action, rowId) => {
        console.log('RUN handleMenuItemClick', event, action, rowId)
        event.preventDefault();
        event.stopPropagation();

        let modelContent = '';
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
            case 'detect':
                modelContent = () => {
                    <></>
                };
                break
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
        event.stopPropagation();
        axiosInstance.get(API.image.imageDetail.replace('{imageId}', rowId))
            .then((response) => {
                setGeneratedImageData(response.data.generations);
            })
        setGeneratedImagesModalTitle(`${imageName}`);
        setGeneratedImagesModalOpen(true);
    }

    return (
        <Paper sx={{width: '100%', mb: 2}}>
            <EnhancedTableToolbar
                numSelected={selected.length}
                selected={selected}
                handleUploadModalOpen={handleUploadModalOpen}
                setDialogTitle={setDialogTitle}
                setDialogContent={setDialogContent}
                handleDialogOpen={handleDialogOpen}
            />
            <TableContainer>
                <Table
                    sx={{minWidth: 750}}
                    aria-labelledby="tableTitle"
                    size="medium"
                >
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                    />
                    <TableBody>
                        {visibleRows.map((row, index) => {
                            const isItemSelected = isSelected(row.id);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    onClick={(event) => handleClick(event, row.id)}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.id}
                                    selected={isItemSelected}
                                    sx={{cursor: 'pointer'}}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isItemSelected}
                                            inputProps={{
                                                'aria-labelledby': labelId,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        id={labelId}
                                        scope="row"
                                        padding="none"
                                    >
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="left">
                                        <Avatar
                                            src={row.thumbnail}
                                            alt="Thumbnail"
                                            onClick={(e) => handleThumbnailClick(e, row.image, row.name)}
                                            sx={{
                                                maxWidth: '100%',
                                                maxHeight: theme => theme.spacing(5)
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="left">{`${row.width}x${row.height}`}</TableCell>
                                    <TableCell align="left">{row.user.username}</TableCell>
                                    <TableCell
                                        align="left">{format(parseISO(row.created_at), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                                    <TableCell align="left">{
                                        row.generation_num > 0 ?
                                            <Button size="small"
                                                    onClick={(event) => handleGenerationViewClick(event, row.id, row.name)}
                                            >
                                                View
                                            </Button> : <Button size="small" disabled>View</Button>
                                    }
                                    </TableCell>
                                    <TableCell align="left">
                                        <IconButton
                                            aria-label="more"
                                            id={`actions-menu-${row.id}`}
                                            aria-controls={`actions-menu-${row.id}`}
                                            aria-haspopup="true"
                                            onClick={(event) => handleMenuOpen(event, row.id)}
                                        >
                                            <MoreVertIcon/>
                                        </IconButton>

                                        <RowActionMenu
                                            rowId={row.id}
                                            menuAnchorEl={menuAnchorEl}
                                            handleMenuClose={handleMenuClose}
                                            handleMenuItemClick={handleMenuItemClick}
                                        />

                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: (53) * emptyRows,
                                }}
                            >
                                <TableCell colSpan={6}/>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
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
                axiosInstance={axiosInstance}
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
                axiosInstance={axiosInstance}
            />
            <UploadModal
                open={uploadModalOpen}
                onClose={handleUploadModalClose}
                handleModalClose={handleUploadModalClose}
                setRefresh={setRefresh}
                axiosInstance={axiosInstance}
            />
        </Paper>
    );
})


export default function ImageListPage() {
    console.log('RUN ImageListPage')
    const {backdropOpen, axiosInstance} = useAxios();

    useEffect(() => {
        console.log('ImageListPage component mounted');
    }, []);

    // Table
    const [rows, setRows] = React.useState([]);
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
        }
    }, [refresh, axiosInstance]);

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
                setRefresh={setRefresh}
                axiosInstance={axiosInstance}
            />
            <DefaultBackdrop open={backdropOpen}/>
        </Container>
    )
}