import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
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
import useAxios, {defaultAxios} from "../../services/useAxios";
import API from "../../config/api";
import {
    Avatar,
    Breadcrumbs, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    Grid,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    InputLabel,
    Link,
    ListItemIcon,
    Menu,
    MenuItem,
    Modal,
    Select,
    Skeleton,
    Switch
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
import ReactJson from '@microlink/react-json-view'
import ImageUploadField from "../../components/Form/ImageUploadField";
import {useAuth} from "../../context/useAuth";


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
        handleModalClose,
        setRefresh,
        axiosInstance
    }) => {
    const handleUploadSuccess = (clearPreview) => {
        clearPreview();
    };

    // Data submit

    const handleSubmit = (values) => {
        const formData = new FormData();
        // 将表单数据添加到 FormData
        formData.append('name', values.name);
        formData.append('image', values.image);
        formData.append('is_public', values.is_public)
        axiosInstance.post(API.image.imageUpload, formData)
            .then(() => {
                handleModalClose();
                // Optionally, reset selectedFile when modal is closed
                setRefresh(true)
            })
            .catch(error => {
                console.error('Upload error:', error);
            });

    };

    return (
        <Modal
            open={open}
            onClose={handleModalClose}
            aria-labelledby="upload-modal-title"
            aria-describedby="upload-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
            }}>
                <Typography variant="h5" component="h2">Upload Image</Typography>
                <p id="upload-modal-description">Select an image to upload.</p>

                <Formik
                    initialValues={{
                        name: '',
                        image: null,
                        is_public: false
                    }}
                    validate={values => {
                        const errors = {};
                        if (!values.name) {
                            errors.name = 'Name is required.';
                        }
                        if (!values.image) {
                            errors.image = 'Image is required.';
                        }
                        return errors;
                    }}
                    onSubmit={(values, {setSubmitting}) => {
                        handleSubmit(values);
                        setSubmitting(false);
                    }}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <FormGroup>
                                <FormControl>
                                    <Field
                                        as={TextField}
                                        type="text"
                                        name="name"
                                        label="Name"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                    />
                                    <ErrorMessage name="name"/>
                                    <Field
                                        name="image"
                                        component={ImageUploadField}
                                        label="Image"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        onUploadSuccess={handleUploadSuccess}
                                    />
                                    <ErrorMessage name="image"/>
                                    <Field name="is_public">
                                        {({field}) => (
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        {...field}
                                                        checked={field.value}  // 使用 field.value 代替外部的 isPublic 状态
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                        }}
                                                    />
                                                }
                                                label="Public"
                                                sx={{marginTop: '16px', marginBottom: '8px'}}
                                            />
                                        )
                                        }
                                    </Field>
                                    <FormHelperText>Be cautious, enabling this will make this data visible and
                                        accessible to everyone.</FormHelperText>
                                </FormControl>
                            </FormGroup>

                            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={26}
                                 sx={{marginTop: (theme) => theme.spacing(2)}}>
                                <Button type="submit" disabled={isSubmitting}>
                                    Submit
                                </Button>
                                <Button onClick={handleModalClose}>Close</Button>
                            </Box>
                        </Form>
                    )}
                </Formik>

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
            label: 'Size (W x H)',
        },
        {
            id: 'scope',
            numeric: false,
            disablePadding: false,
            label: 'Public',
        },
        {
            id: 'owner',
            numeric: false,
            disablePadding: false,
            label: 'Owner',
        },
        {
            id: 'created_at',
            numeric: false,
            disablePadding: false,
            label: 'Created At',
        },
        {
            id: 'detection',
            numeric: false,
            disablePadding: false,
            label: 'Detection',
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


const DeleteConfirmDialog = React.memo((
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
    const handleImageDeleteConfirm = useCallback(() => {
        const imageIds = selected.join(",");
        axiosInstance.delete(API.image.imageMultiDelete.replace('{imageIds}', imageIds))
            .then(result => {
                setRefresh(true);
                handleDialogClose();
                setSelected([]);
            }).catch(() => {
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
});


const EnhancedTableToolbar = React.memo((props) => {
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
            aria-labelledby="show-modal-title"
            aria-describedby="show-modal-description"
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
                    <div style={{display: 'flex', height: '300px'}}>
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
                openSnackbar('Saved successfully.', 'success');
                handleShowImageModalClose();
                setRefresh(true);
            })
    };
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="action-modal-title"
            aria-describedby="action-modal-description"
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


const GeneratedImagesDialog = React.memo((
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
        setInnerModalOpen(false);
    }, []);

    const renderActionIcon = (action) => {
        switch (action.toLowerCase()) {
            case 'crop':
                return <CropIcon/>;
            case 'flip':
                return <FlipIcon/>;
            case 'rotate':
                return <RotateIcon/>;
            case 'blur':
                return <BlurIcon/>;
            default:
                return <InfoIcon/>;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <DialogTitle>
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
            </DialogTitle>
            <DialogContent dividers sx={{overflowY: 'scroll'}}>
                <ImageList variant="masonry" cols={4} gap={8}>
                    {data.map((item) => (
                        <ImageListItem key={item.id}>
                            <Tooltip title="Click to see original image" placement="top">
                                <img
                                    srcSet={`${item.processed_image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    src={`${item.processed_image}?w=248&fit=crop&auto=format`}
                                    alt={item.action}
                                    loading="lazy"
                                    onClick={() => handleInnerModalOpen(item.processed_image, item.action, item.id)}
                                    style={{width: '100%', cursor: 'pointer'}}
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
            </DialogContent>
        </Dialog>
    );
});


const DetectViewModal = React.memo((
    {
        open,
        handleClose,
        title,
        jsonObject,
        onDetect
    }) => {

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{overflow: 'scroll'}}
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
                <Box sx={{marginY: (theme) => theme.spacing(4)}}>
                    <ReactJson src={jsonObject} name={false} style={{fontFamily: 'initial'}}/>
                </Box>
                <Grid container spacing={2} sx={{marginBottom: (theme) => theme.spacing(1)}}>
                    <Grid item xs={4} textAlign="left">
                        <Button onClick={(event) => onDetect(event)}>Detect</Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>

    )
});


const EnhancedTable = React.memo((props) => {
    const {userId} = useAuth();
    const {
        rows,
        setRefresh,
        axiosInstance,
        refreshing
    } = props;

    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [openedRowId, setOpenedRowId] = useState(0);

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
            const newSelected = rows.map((n) => {
                if (userId === n.user.id) {
                    return n.id
                }
                return null;
            })
                .filter((value) => value !== null);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, row) => {
        const rowId = row.id;
        const rowUser = row.user;
        // Check if the click is on the modal backdrop
        if (event.target.classList.contains('MuiModal-backdrop')) {
            // Do nothing or close the modal if needed
            return;
        }
        if (rowUser.id !== userId) {
            return;
        }

        const selectedIndex = selected.indexOf(rowId);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, rowId);
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
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
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
    const [menuAnchorEl, setMenuAnchorEl] = useState({msg: "loading"});

    const handleMenuOpen = useCallback((event, rowId) => {
        event.stopPropagation();
        setMenuAnchorEl((prevMenuAnchorEl) => ({
            ...prevMenuAnchorEl,
            [rowId]: event.currentTarget,
        }));
    }, [setMenuAnchorEl]);

    const handleMenuClose = useCallback((event, reason, rowId) => {
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
        setActionModalTitle(capitalize(action));
        setActionModalOpen(true);
    }, [setActionModalOpen, setActionModalTitle])

    const handleActionModalClose = useCallback(() => {
        setActionModalOpen(false)
    }, [setActionModalOpen]);

    const [processedImageModalOpen, setProcessedImageModalOpen] = useState(false);
    const [processedImageModalTitle, setProcessedImageModalTitle] = useState('');
    const [processedImageSrc, setProcessedImageSrc] = useState('');

    const handleProcessedImageModalClose = useCallback(() => {
        setProcessedImageModalOpen(false);
    }, []);

    const handleActionSubmit = useCallback((action, rowId, values) => {
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
        })
    }, [setRefresh, axiosInstance])

    // 处理菜单项点击的逻辑
    const [detectModalTitle, setDetectModalTitle] = useState('');
    const [detectModalOpen, setDetectModalOpen] = useState(false);
    const [detectModalJsonObject, setDetectModalJsonObject] = useState({msg: "loading"});

    const handleDetectModalOpen = (rowId) => {
        setOpenedRowId(rowId);
        setDetectModalOpen(true)
    }
    const handleDetectModalClose = () => {
        setDetectModalOpen(false);
        setOpenedRowId(0);
    }
    const handleDetectViewClick = (event, rowId, imageName) => {
        event.stopPropagation();
        setDetectModalTitle(imageName)
        handleDetectModalOpen(rowId)

        defaultAxios.get(API.image.imageDetail.replace('{imageId}', rowId))
            .then((response) => {
                const jsonObject = JSON.parse(response.data.detected_info)
                setDetectModalJsonObject(jsonObject)
            })
    }

    const handleImageDetectSubmit = (event) => {
        event.preventDefault();
        const url = API.image.imageProcess.replace('{imageId}', String(openedRowId)).replace('{action}', 'detect')
        axiosInstance.put(url, {}).then((response) => {
            const jsonObject = JSON.parse(response.data.detected_info);
            setDetectModalJsonObject(jsonObject);
            setRefresh(true);
        }).catch((reason) => {
        })
    };

    const handleMenuItemClick = (event, action, rowId) => {
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
                                        <InputLabel id="action-flip-axis-select-label">Axis</InputLabel>
                                        <Field
                                            as={Select}
                                            name="axis"
                                            labelId="flip-axis-label"
                                            label="Axis"
                                            fullWidth
                                        >
                                            <MenuItem value="0">0</MenuItem>
                                            <MenuItem value="1">1</MenuItem>
                                        </Field>
                                    </FormControl>
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
                                        <InputLabel id="action-blur-mode-select-label">Mode</InputLabel>
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


    };

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

    const handleGeneratedImagesModalClose = useCallback(() => {
        setGeneratedImagesModalOpen(false);
    }, []);

    const handleGenerationViewClick = (event, rowId, imageName) => {
        event.stopPropagation();
        axiosInstance.get(API.image.imageDetail.replace('{imageId}', rowId))
            .then((response) => {
                setGeneratedImageData(response.data.generations);
            })
        setGeneratedImagesModalTitle(`${imageName}`);
        setGeneratedImagesModalOpen(true);
    }

    const handlePublicSwitchChange = (event, rowId) => {
        event.stopPropagation();
        axiosInstance.patch(API.image.imageUpdate.replace('{imageId}', rowId), {
            'is_public': event.target.checked
        })
            .then(() => {
                setRefresh(true)
            })
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
                        {refreshing ? (
                            <TableRow>
                                <TableCell colSpan={11} align="center">
                                    <CircularProgress size={32} />
                                    <Typography variant="subtitle2">Loading</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            visibleRows.map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;
                                const isOwner = userId === row.user.id;
                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row)}
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
                                        <TableCell align="left">
                                            {isOwner ? (
                                                <Switch
                                                    size="small"
                                                    checked={row.is_public}
                                                    onClick={(event) => handlePublicSwitchChange(event, row.id)}
                                                />
                                            ) : (
                                                <Switch
                                                    size="small"
                                                    checked={row.is_public}
                                                    disabled
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell align="left">{row.user.username}</TableCell>
                                        <TableCell
                                            align="left">{format(parseISO(row.created_at), 'yyyy/MM/dd HH:mm:ss')}</TableCell>
                                        <TableCell align="left">{
                                            <Button onClick={(event) => handleDetectViewClick(event, row.id, row.name)}
                                                    size="small">View</Button>
                                        }
                                        </TableCell>
                                        <TableCell align="left">{
                                            row.generation_num > 0 ?
                                                <Button size="small"
                                                        onClick={(event) => handleGenerationViewClick(event, row.id, row.name)}>
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
                            })
                        )}

                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: (73) * emptyRows,
                                }}
                            >
                                <TableCell colSpan={11}/>
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
            <DetectViewModal
                open={detectModalOpen}
                title={detectModalTitle}
                handleClose={handleDetectModalClose}
                jsonObject={detectModalJsonObject}
                onDetect={handleImageDetectSubmit}
            />
            <GeneratedImagesDialog
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
                handleModalClose={handleUploadModalClose}
                setRefresh={setRefresh}
                axiosInstance={axiosInstance}
            />
        </Paper>
    );
})


export default function ImageListPage() {
    const {backdropOpen, axiosInstance} = useAxios();

    useEffect(() => {

    }, []);

    // Table
    const [rows, setRows] = React.useState([]);
    // Data refreshing
    const [refresh, setRefresh] = React.useState(true);
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        if (refresh) {
            setRefresh(false);
            setRefreshing(true);
            defaultAxios.get(API.image.imageList)
                .then(response => {
                    setRows(response.data.results);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                })
                .finally(() => {
                    setRefreshing(false)
                })
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
                refreshing={refreshing}
            />
            <DefaultBackdrop open={backdropOpen}/>
        </Container>
    )
}