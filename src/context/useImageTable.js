// import {createContext, memo, useCallback, useContext, useEffect, useMemo, useState} from 'react';
// import TableContainer from "@mui/material/TableContainer";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableRow from "@mui/material/TableRow";
// import TableCell from "@mui/material/TableCell";
// import Checkbox from "@mui/material/Checkbox";
// import {Avatar, FormControl, InputLabel, ListItemIcon, Menu, MenuItem, Select} from "@mui/material";
// import {format, parseISO} from "date-fns";
// import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import TablePagination from "@mui/material/TablePagination";
// import Paper from "@mui/material/Paper";
// import * as React from "react";
// import Toolbar from "@mui/material/Toolbar";
// import {alpha} from "@mui/material/styles";
// import Typography from "@mui/material/Typography";
// import Tooltip from "@mui/material/Tooltip";
// import DeleteIcon from "@mui/icons-material/Delete";
// import UploadFileIcon from "@mui/icons-material/CloudUpload";
// import PropTypes from "prop-types";
// import TableHead from "@mui/material/TableHead";
// import TableSortLabel from "@mui/material/TableSortLabel";
// import Box from "@mui/material/Box";
// import {visuallyHidden} from "@mui/utils";
// import {axiosInstance} from "../services/axios";
// import API from "../config/api";
// import useDialog from "../hooks/useDialog";
// import ImageDeleteDialog from "../components/image/Dialog/ImageDeleteDialog";
// import {Field, Form, Formik} from "formik";
// import TextField from "@mui/material/TextField";
// import CropIcon from "@mui/icons-material/Crop";
// import FlipIcon from "@mui/icons-material/FlipRounded";
// import BlurIcon from "@mui/icons-material/BlurOn";
// import RotateIcon from "@mui/icons-material/RotateLeft";
// import useModal from "../hooks/useModal";
// import {capitalize} from "../utils";
// import ErrorMessage from "../components/Form/ErrorMessage";
// import GeneratedImagesModal from "../components/image/Modal/GeneratedImagesModal";
//
// const ImageTableContext = createContext();
//
// function descendingComparator(a, b, orderBy) {
//     if (b[orderBy] < a[orderBy]) {
//         return -1;
//     }
//     if (b[orderBy] > a[orderBy]) {
//         return 1;
//     }
//     return 0;
// }
//
// function getComparator(order, orderBy) {
//     return order === 'desc'
//         ? (a, b) => descendingComparator(a, b, orderBy)
//         : (a, b) => -descendingComparator(a, b, orderBy);
// }
//
//
// // Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// // stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// // only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// // with exampleArray.slice().sort(exampleComparator)
// function stableSort(array, comparator) {
//     const stabilizedThis = array.map((el, index) => [el, index]);
//     stabilizedThis.sort((a, b) => {
//         const order = comparator(a[0], b[0]);
//         if (order !== 0) {
//             return order;
//         }
//         return a[1] - b[1];
//     });
//     return stabilizedThis.map((el) => el[0]);
// }
//
//
// function EnhancedTableHead(props) {
//     const {
//         onSelectAllClick,
//         order,
//         orderBy,
//         numSelected,
//         rowCount,
//         onRequestSort,
//     } = props;
//
//     const createSortHandler = (property) => (event) => {
//         onRequestSort(event, property);
//     };
//
//     const headCells = [
//         {
//             id: 'name',
//             numeric: false,
//             disablePadding: true,
//             label: 'Name',
//         },
//         {
//             id: 'thumbnail',
//             numeric: false,
//             disablePadding: false,
//             label: 'Thumbnail',
//         },
//         {
//             id: 'size',
//             numeric: false,
//             disablePadding: false,
//             label: 'Size',
//         },
//         {
//             id: 'user',
//             numeric: false,
//             disablePadding: false,
//             label: 'User',
//         },
//         {
//             id: 'created_at',
//             numeric: false,
//             disablePadding: false,
//             label: 'Created At',
//         },
//         {
//             id: 'generations',
//             numeric: false,
//             disablePadding: false,
//             label: 'Generations',
//         },
//         {
//             id: 'actions',
//             numeric: false,
//             disablePadding: false,
//             label: '',
//         },
//     ];
//
//     return (
//         <TableHead>
//             <TableRow>
//                 <TableCell padding="checkbox">
//                     <Checkbox
//                         color="primary"
//                         indeterminate={numSelected > 0 && numSelected < rowCount}
//                         checked={rowCount > 0 && numSelected === rowCount}
//                         onChange={onSelectAllClick}
//                         inputProps={{
//                             'aria-label': 'select all items',
//                         }}
//                     />
//                 </TableCell>
//                 {headCells.map((headCell) => (
//                     <TableCell
//                         key={headCell.id}
//                         align={headCell.numeric ? 'right' : 'left'}
//                         padding={headCell.disablePadding ? 'none' : 'normal'}
//                         sortDirection={orderBy === headCell.id ? order : false}
//
//                     >
//                         <TableSortLabel
//                             active={orderBy === headCell.id}
//                             direction={orderBy === headCell.id ? order : 'asc'}
//                             onClick={createSortHandler(headCell.id)}
//                         >
//                             {headCell.label}
//                             {orderBy === headCell.id ? (
//                                 <Box component="span" sx={visuallyHidden}>
//                                     {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
//                                 </Box>
//                             ) : null}
//                         </TableSortLabel>
//                     </TableCell>
//                 ))}
//             </TableRow>
//         </TableHead>
//     );
// }
//
// EnhancedTableHead.propTypes = {
//     numSelected: PropTypes.number.isRequired,
//     onRequestSort: PropTypes.func.isRequired,
//     onSelectAllClick: PropTypes.func.isRequired,
//     order: PropTypes.oneOf(['asc', 'desc']).isRequired,
//     orderBy: PropTypes.string.isRequired,
//     rowCount: PropTypes.number.isRequired,
// };
//
// const EnhancedTableToolbar = React.memo((props) => {
//     console.log('RUN EnhancedTableToolbar', props)
//     const {
//         numSelected,
//         selected,
//         setSelected,
//         setRefresh,
//         handleUploadModalOpen,
//     } = props;
//     const {
//         dialogOpen,
//         dialogTitle,
//         dialogContent,
//         handleDialogOpen,
//         handleDialogClose
//     } = useDialog();
//     const handleImageDelete = () => {
//         handleDialogOpen(
//             'Caution',
//             numSelected + ' 张图片将被删除（及其生成的所有图片）'
//         )
//     };
//
//     const handleImageDeleteConfirmation = useCallback(() => {
//         const imageIds = selected.join(",");
//         axiosInstance.delete(API.image.imageMultiDelete.replace('{imageIds}', imageIds))
//             .then(result => {
//                 setRefresh(true);
//                 setSelected([]);
//                 handleDialogClose();
//             })
//     }, [setRefresh, handleDialogClose, setSelected]);
//
//     return (
//         <>
//             <Toolbar
//                 sx={{
//                     pl: {sm: 2},
//                     pr: {xs: 1, sm: 1},
//                     ...(numSelected > 0 && {
//                         bgcolor: (theme) =>
//                             alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
//                     }),
//                 }}
//             >
//                 {numSelected > 0 ? (
//                     <Typography
//                         sx={{flex: '1 1 100%'}}
//                         color="inherit"
//                         variant="subtitle1"
//                         component="div"
//                     >
//                         {numSelected} selected
//                     </Typography>
//                 ) : (
//                     <Typography
//                         sx={{flex: '1 1 100%'}}
//                         variant="h6"
//                         id="tableTitle"
//                         component="div"
//                     >
//                         Images
//                     </Typography>
//                 )}
//
//                 {numSelected > 0 ? (
//                     <Tooltip title="Delete">
//                         <IconButton onClick={handleImageDelete}>
//                             <DeleteIcon/>
//                         </IconButton>
//                     </Tooltip>
//                 ) : (
//                     <Tooltip title="Upload">
//                         <IconButton onClick={handleUploadModalOpen}>
//                             <UploadFileIcon/>
//                         </IconButton>
//                     </Tooltip>
//                 )}
//             </Toolbar>
//             <ImageDeleteDialog
//                 open={dialogOpen}
//                 title={dialogTitle}
//                 content={dialogContent}
//                 onClose={handleDialogClose}
//                 onConfirm={handleImageDeleteConfirmation}
//             />
//         </>
//     );
// });
//
// EnhancedTableToolbar.propTypes = {
//     numSelected: PropTypes.number.isRequired,
// };
//
//
// const RowActionMenu = React.memo((
//     {
//         rowId,
//         menuAnchorEl,
//         handleMenuClose,
//         handleMenuItemClick
//     }) => {
//     return (
//         <Menu
//             id={`actions-menu-${rowId}`}
//             anchorEl={menuAnchorEl[rowId]}
//             anchorOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//             }}
//             keepMounted
//             transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//             }}
//             open={Boolean(menuAnchorEl[rowId])}
//             onClose={(event, reason) => handleMenuClose(event, reason, rowId)}
//         >
//             <MenuItem
//                 onClick={(event) => handleMenuItemClick(event, 'crop', rowId)}>
//                 <ListItemIcon>
//                     <CropIcon fontSize="small"/>
//                 </ListItemIcon>
//                 裁剪
//             </MenuItem>
//             <MenuItem
//                 onClick={(event) => handleMenuItemClick(event, 'flip', rowId)}>
//                 <ListItemIcon>
//                     <FlipIcon fontSize="small"/>
//                 </ListItemIcon>
//                 翻转
//             </MenuItem>
//             <MenuItem
//                 onClick={(event) => handleMenuItemClick(event, 'blur', rowId)}>
//                 <ListItemIcon>
//                     <BlurIcon fontSize="small"/>
//                 </ListItemIcon>
//                 模糊
//             </MenuItem>
//             <MenuItem
//                 onClick={(event) => handleMenuItemClick(event, 'rotate', rowId)}>
//                 <ListItemIcon>
//                     <RotateIcon fontSize="small"/>
//                 </ListItemIcon>
//                 旋转
//             </MenuItem>
//         </Menu>
//     )
// });
//
// export const ImageTableProvider = memo(({children}) => {
//     console.log('ImageTableProvider')
//     const [order, setOrder] = React.useState('asc');
//     const [orderBy, setOrderBy] = React.useState('calories');
//     const [selected, setSelected] = React.useState([]);
//     const [page, setPage] = React.useState(0);
//     const [rowsPerPage, setRowsPerPage] = React.useState(5);
//     const [rows, setRows] = React.useState([]);
//     const [refresh, setRefresh] = React.useState(true);
//
//         // 生成图片查看
//     const [generatedImagesModalTitle, setGeneratedImagesModalTitle] = useState('');
//     const [generatedImagesModalOpen, setGeneratedImagesModalOpen] = useState(false);
//     const [generatedImageData, setGeneratedImageData] = useState([]);
//     const [generatedImageId, setGeneratedImage] = useState(null);
//
//     const handleGeneratedImagesModalClose = useCallback(() => {
//         setGeneratedImagesModalOpen(false)
//     });
//
//     const handleGenerationViewClick = (event, rowId, imageName) => {
//         event.preventDefault();
//         event.stopPropagation();
//         axiosInstance.get(API.image.imageDetail.replace('{imageId}', rowId))
//             .then((response) => {
//                 setGeneratedImageData(response.data.generations);
//             })
//         setGeneratedImagesModalTitle(`${imageName}`);
//         setGeneratedImagesModalOpen(true);
//     }
//
//         // 图片处理请求提交
//     const [processedImageModalOpen, setProcessedImageModalOpen] = useState(false);
//     const [processedImageModalTitle, setProcessedImageModalTitle] = useState('');
//     const [processedImageSrc, setProcessedImageSrc] = useState('');
//     const handleActionSubmit = useCallback((action, rowId, values) => {
//         console.log('handleActionSubmit', action, rowId)
//         const url = API.image.imageProcess.replace('{imageId}', rowId).replace('{action}', action)
//         axiosInstance.put(url, values).then((response) => {
//             const data = response.data;
//             setProcessedImageSrc(data.processed_image);
//             const title = `Processed Image (${(capitalize(action))}) [${data.width}x${data.height}]`
//             setProcessedImageModalTitle(title);
//             setProcessedImageModalOpen(true);
//             setGeneratedImage(data.id);
//             setRefresh(true);
//         }).catch((reason) => {
//             console.log('reason', reason)
//         })
//     }, []);
//
//     const handleProcessedImageModalClose = useCallback(() => {
//         setProcessedImageModalOpen(false);
//     }, []);
//
//     // 缩略图查看原图
//     const [originalImageSrc, setOriginalImageSrc] = React.useState('');
//     const [originalImageName, setOriginalImageName] = React.useState('');
//     const {
//         modalOpen: showImageModalOpen,
//         handleModalOpen: handleShowImageModalOpen,
//         handleModalClose: handleShowImageModalClose,
//     } = useModal();
//     const handleThumbnailClick = useCallback((event, originalImage, originalImageName) => {
//         event.stopPropagation();
//         setOriginalImageSrc(originalImage);
//         setOriginalImageName(originalImageName);
//         handleShowImageModalOpen();
//     }, [handleShowImageModalOpen]);
//
//
//     const handleRequestSort = (event, property) => {
//         const isAsc = orderBy === property && order === 'asc';
//         setOrder(isAsc ? 'desc' : 'asc');
//         setOrderBy(property);
//     };
//
//     const handleSelectAllClick = (event) => {
//         if (event.target.checked) {
//             const newSelected = rows.map((n) => n.id);
//             setSelected(newSelected);
//             return;
//         }
//         setSelected([]);
//     };
//
//     const handleClick = (event, id) => {
//         // Check if the click is on the modal backdrop
//         if (event.target.classList.contains('MuiModal-backdrop')) {
//             // Do nothing or close the modal if needed
//             return;
//         }
//         const selectedIndex = selected.indexOf(id);
//         let newSelected = [];
//
//         if (selectedIndex === -1) {
//             newSelected = newSelected.concat(selected, id);
//         } else if (selectedIndex === 0) {
//             newSelected = newSelected.concat(selected.slice(1));
//         } else if (selectedIndex === selected.length - 1) {
//             newSelected = newSelected.concat(selected.slice(0, -1));
//         } else if (selectedIndex > 0) {
//             newSelected = newSelected.concat(
//                 selected.slice(0, selectedIndex),
//                 selected.slice(selectedIndex + 1),
//             );
//         }
//         setSelected(newSelected);
//     };
//
//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };
//
//     const handleChangeRowsPerPage = (event) => {
//         console.log('handleChangeRowsPerPage', event.target.value)
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };
//
//     const isSelected = (id) => selected.indexOf(id) !== -1;
//
//     // Avoid a layout jump when reaching the last page with empty rows.
//     const emptyRows =
//         page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
//
//     const visibleRows = React.useMemo(
//         () =>
//             stableSort(rows, getComparator(order, orderBy)).slice(
//                 page * rowsPerPage,
//                 page * rowsPerPage + rowsPerPage,
//             ),
//         [rows, order, orderBy, page, rowsPerPage],
//     );
//
//     // 上传图片
//     const {
//         modalOpen: uploadModalOpen,
//         handleModalOpen: handleUploadModalOpen,
//         handleModalClose: handleUploadModalClose,
//     } = useModal();
//
//     // 菜单打开关闭
//     const [menuAnchorEl, setMenuAnchorEl] = React.useState({});
//
//     const handleMenuOpen = useCallback((event, rowId) => {
//         console.log('RUN handleMenuOpen')
//         event.stopPropagation();
//         setMenuAnchorEl((prevMenuAnchorEl) => ({
//             ...prevMenuAnchorEl,
//             [rowId]: event.currentTarget,
//         }));
//     }, [setMenuAnchorEl]);
//
//     const handleMenuClose = useCallback((event, reason, rowId) => {
//         console.log('RUN handleMenuClose', 'reason: ' + reason)
//         event.stopPropagation();
//         setMenuAnchorEl((prevMenuAnchorEl) => ({
//             ...prevMenuAnchorEl,
//             [rowId]: null,
//         }));
//     }, [setMenuAnchorEl]);
//
//     // 点击菜单
//     const {
//             modalOpen: actionModalOpen,
//             modalTitle: actionModalTitle,
//             setModalTitle: setActionModalTitle,
//             modalContent: actionModalContent,
//             setModalContent: setActionModalContent,
//             handleModalOpen: handleActionModalOpen,
//             handleModalClose: handleActionModalClose,
//         } = useModal();
//     const handleMenuItemClick = useCallback((event, action, rowId) => {
//         console.log('RUN handleMenuItemClick', event, action, rowId)
//         event.preventDefault();
//         event.stopPropagation();
//
//         let modelContent = '<></>';
//         switch (action) {
//             case 'crop':
//                 // 处理裁剪操作
//                 modelContent = () => {
//                     return (
//                         <Formik
//                             initialValues={{width: '', height: ''}}
//                             validate={values => {
//                                 const errors = {};
//                                 if (!values.width) {
//                                     errors.width = 'Width is required.';
//                                 } else if (
//                                     !/^[1-9]\d*$/.test(values.width)
//                                 ) {
//                                     errors.width = 'A positive integer is required.';
//                                 }
//                                 if (!values.height) {
//                                     errors.height = 'Height is required.';
//                                 } else if (
//                                     !/^[1-9]\d*$/.test(values.height)
//                                 ) {
//                                     errors.height = 'A positive integer is required.';
//                                 }
//                                 return errors;
//                             }}
//                             onSubmit={(values, {setSubmitting}) => {
//                                 handleActionSubmit(action, rowId, values);
//                                 setSubmitting(false);
//                             }}
//                         >
//                             {({isSubmitting}) => (
//                                 <Form>
//                                     <Field
//                                         type="number"
//                                         name="width"
//                                         as={TextField}
//                                         label="Width"
//                                         fullWidth
//                                         margin="normal"
//                                         variant="outlined"
//                                     />
//                                     <ErrorMessage name="width"/>
//                                     <Field
//                                         type="number"
//                                         name="height"
//                                         as={TextField}
//                                         label="Height"
//                                         fullWidth
//                                         margin="normal"
//                                         variant="outlined"
//                                     />
//                                     <ErrorMessage name="height"/>
//                                     <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={26}
//                                          sx={{marginTop: (theme) => theme.spacing(2)}}>
//                                         <Button type="submit" disabled={isSubmitting}>
//                                             Submit
//                                         </Button>
//                                         <Button onClick={handleActionModalClose}>Close</Button>
//                                     </Box>
//                                 </Form>
//                             )}
//                         </Formik>
//                     )
//                 }
//                 break;
//             case 'flip':
//                 modelContent = () => {
//                     return (
//                         <Formik
//                             initialValues={{axis: ''}}
//                             validate={values => {
//                                 const errors = {};
//                                 if (!values.axis) {
//                                     errors.axis = 'Axis is required.';
//                                 } else if (
//                                     !/^[1-9]\d*$/.test(values.axis)
//                                 ) {
//                                     errors.axis = 'A positive integer is required.';
//                                 }
//                                 return errors;
//                             }}
//                             onSubmit={(values, {setSubmitting}) => {
//                                 handleActionSubmit(action, rowId, values);
//                                 setSubmitting(false);
//                             }}
//                         >
//                             {({isSubmitting}) => (
//                                 <Form>
//                                     <Field
//                                         type="number"
//                                         name="axis"
//                                         as={TextField}
//                                         label="Axis"
//                                         fullWidth
//                                         margin="normal"
//                                         variant="outlined"
//                                     />
//                                     <ErrorMessage name="axis"/>
//                                     <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={26}
//                                          sx={{marginTop: (theme) => theme.spacing(2)}}>
//                                         <Button type="submit" disabled={isSubmitting}>
//                                             Submit
//                                         </Button>
//                                         <Button onClick={handleActionModalClose}>Close</Button>
//                                     </Box>
//                                 </Form>
//                             )}
//                         </Formik>
//                     )
//                 };
//                 break;
//             case 'rotate':
//                 modelContent = () => {
//                     return (
//                         <Formik
//                             initialValues={{angle: ''}}
//                             validate={values => {
//                                 const errors = {};
//                                 if (!values.angle) {
//                                     errors.angle = 'Angle is required.';
//                                 } else if (
//                                     !/^[1-9]\d*$/.test(values.angle)
//                                 ) {
//                                     errors.angle = 'A positive integer is required.';
//                                 }
//                                 return errors;
//                             }}
//                             onSubmit={(values, {setSubmitting}) => {
//                                 handleActionSubmit(action, rowId, values);
//                                 setSubmitting(false);
//                             }}
//                         >
//                             {({isSubmitting}) => (
//                                 <Form>
//                                     <Field
//                                         type="number"
//                                         name="angle"
//                                         as={TextField}
//                                         label="Angle"
//                                         fullWidth
//                                         margin="normal"
//                                         variant="outlined"
//                                     />
//                                     <ErrorMessage name="angle"/>
//                                     <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={26}
//                                          sx={{marginTop: (theme) => theme.spacing(2)}}>
//                                         <Button type="submit" disabled={isSubmitting}>
//                                             Submit
//                                         </Button>
//                                         <Button onClick={handleActionModalClose}>Close</Button>
//                                     </Box>
//                                 </Form>
//                             )}
//                         </Formik>
//                     )
//                 };
//                 break;
//             case 'blur':
//                 modelContent = () => {
//                     return (
//                         <Formik
//                             initialValues={{mode: ''}}
//                             validate={values => {
//                                 const errors = {};
//                                 if (!values.mode) {
//                                     errors.mode = 'Mode is required.';
//                                 }
//                                 return errors;
//                             }}
//                             onSubmit={(values, {setSubmitting}) => {
//                                 handleActionSubmit(action, rowId, values);
//                                 setSubmitting(false);
//                             }}
//                         >
//                             {({isSubmitting}) => (
//                                 <Form>
//                                     <FormControl fullWidth>
//                                         <InputLabel id="demo-simple-select-label">Mode</InputLabel>
//                                         <Field
//                                             as={Select}
//                                             name="mode"
//                                             labelId="blur-mode-label"
//                                             label="Mode"
//                                             fullWidth
//                                         >
//                                             <MenuItem value="mean">Mean</MenuItem>
//                                             <MenuItem value="median">Median</MenuItem>
//                                             <MenuItem value="gaussian">Gaussian</MenuItem>
//                                         </Field>
//                                     </FormControl>
//                                     <ErrorMessage name="mode"/>
//                                     <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={26}
//                                          sx={{marginTop: (theme) => theme.spacing(2)}}>
//                                         <Button type="submit" disabled={isSubmitting}>
//                                             Submit
//                                         </Button>
//                                         <Button onClick={handleActionModalClose}>Close</Button>
//                                     </Box>
//                                 </Form>
//                             )}
//                         </Formik>
//                     )
//                 };
//                 break;
//             default:
//                 break;
//         }
//
//         handleActionModalOpen(capitalize(action), modelContent);
//
//         setMenuAnchorEl((prevMenuAnchorEl) => ({
//             ...prevMenuAnchorEl,
//             [rowId]: null,
//         }));
//     }, []);
//
//     useEffect(() => {
//         if (refresh) {
//             console.log('refreshData')
//             axiosInstance.get(API.image.imageList)
//                 .then(response => {
//                     console.log(response.data);
//                     setRows(response.data.results);
//                 })
//                 .catch(error => {
//                     console.error('Error fetching data:', error);
//                 })
//                 .finally(() => {
//                     setRefresh(false);
//                 });
//         }
//     }, [refresh]);
//
//     const value = useMemo(() => {
//         return {
//             selected,
//             setSelected,
//             refresh,
//             setRefresh,
//             handleActionSubmit,
//             originalImageName
//         };
//     }, []);
//
//     return (
//         <ImageTableContext.Provider value={value}>
//             {children}
//             <Paper sx={{width: '100%', mb: 2}}>
//                 <EnhancedTableToolbar
//                     numSelected={selected.length}
//                     selected={selected}
//                     setSelect={setSelected}
//                     setRefresh={setRefresh}
//                     handleUploadModalOpen={handleUploadModalOpen}
//                 />
//                 <TableContainer>
//                     <Table
//                         sx={{minWidth: 750}}
//                         aria-labelledby="tableTitle"
//                         size="medium"
//                     >
//                         <EnhancedTableHead
//                             numSelected={selected.length}
//                             order={order}
//                             orderBy={orderBy}
//                             onSelectAllClick={handleSelectAllClick}
//                             onRequestSort={handleRequestSort}
//                             rowCount={rows.length}
//                         />
//                         <TableBody>
//                             {visibleRows.map((row, index) => {
//                                 const isItemSelected = isSelected(row.id);
//                                 const labelId = `enhanced-table-checkbox-${index}`;
//
//                                 return (
//                                     <TableRow
//                                         hover
//                                         onClick={(event) => handleClick(event, row.id)}
//                                         role="checkbox"
//                                         aria-checked={isItemSelected}
//                                         tabIndex={-1}
//                                         key={row.id}
//                                         selected={isItemSelected}
//                                         sx={{cursor: 'pointer'}}
//                                     >
//                                         <TableCell padding="checkbox">
//                                             <Checkbox
//                                                 color="primary"
//                                                 checked={isItemSelected}
//                                                 inputProps={{
//                                                     'aria-labelledby': labelId,
//                                                 }}
//                                             />
//                                         </TableCell>
//                                         <TableCell
//                                             component="th"
//                                             id={labelId}
//                                             scope="row"
//                                             padding="none"
//                                         >
//                                             {row.name}
//                                         </TableCell>
//                                         <TableCell align="left">
//                                             <Avatar
//                                                 src={row.thumbnail}
//                                                 alt="Thumbnail"
//                                                 onClick={(e) => handleThumbnailClick(e, row.image, row.name)}
//                                                 sx={{
//                                                     maxWidth: '100%',
//                                                     maxHeight: theme => theme.spacing(5)
//                                                 }}
//                                             />
//                                         </TableCell>
//                                         <TableCell align="left">{`${row.width}x${row.height}`}</TableCell>
//                                         <TableCell align="left">{row.user.username}</TableCell>
//                                         <TableCell
//                                             align="left">{format(parseISO(row.created_at), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
//                                         <TableCell align="left">{
//                                             row.generation_num > 0 ?
//                                                 <Button size="small"
//                                                         onClick={(event) => handleGenerationViewClick(event, row.id, row.name)}
//                                                 >
//                                                     View
//                                                 </Button> : <Button size="small" disabled>View</Button>
//                                         }
//                                         </TableCell>
//                                         <TableCell align="left">
//                                             <IconButton
//                                                 aria-label="more"
//                                                 id={`actions-menu-${row.id}`}
//                                                 aria-controls={`actions-menu-${row.id}`}
//                                                 aria-haspopup="true"
//                                                 onClick={(event) => handleMenuOpen(event, row.id)}
//                                             >
//                                                 <MoreVertIcon/>
//                                             </IconButton>
//
//                                             <RowActionMenu
//                                                 rowId={row.id}
//                                                 menuAnchorEl={menuAnchorEl}
//                                                 handleMenuClose={handleMenuClose}
//                                                 handleMenuItemClick={handleMenuItemClick}
//                                             />
//
//                                         </TableCell>
//                                     </TableRow>
//                                 );
//                             })}
//                             {emptyRows > 0 && (
//                                 <TableRow
//                                     style={{
//                                         height: (53) * emptyRows,
//                                     }}
//                                 >
//                                     <TableCell colSpan={6}/>
//                                 </TableRow>
//                             )}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//                 <TablePagination
//                     rowsPerPageOptions={[5, 10, 25]}
//                     component="div"
//                     count={rows.length}
//                     rowsPerPage={rowsPerPage}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                 />
//             </Paper>
//             <GeneratedImagesModal
//                 title={generatedImagesModalTitle}
//                 handleClose={handleGeneratedImagesModalClose}
//                 open={generatedImagesModalOpen}
//                 data={generatedImageData}
//             />
//         </ImageTableContext.Provider>
//     );
// });
//
// export const useImageTable = () => {
//     return useContext(ImageTableContext);
// };