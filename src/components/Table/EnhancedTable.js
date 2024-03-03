import * as React from "react";
import useDialog from "../../hooks/useDialog";
import useModal from "../../hooks/useModal";
import {useCallback, useState} from "react";
import {capitalize} from "../../utils";
import API from "../../config/api";
import {axiosInstance} from "../../services/axios";
import {Field, Form, Formik} from "formik";
import TextField from "@mui/material/TextField";
import ErrorMessage from "../form/ErrorMessage";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {Avatar, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Checkbox from "@mui/material/Checkbox";
import {format, parseISO} from "date-fns";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import {visuallyHidden} from "@mui/utils";
import PropTypes from "prop-types";


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

const EnhancedTable = (props) => {
    console.log('RUN EnhancedTable', props)
    const {
        rows,
        setRefresh,
        handleUploadModalOpen
    } = props;

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
                    size={'medium'}
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
        </Paper>
    );
};

export default EnhancedTable;
