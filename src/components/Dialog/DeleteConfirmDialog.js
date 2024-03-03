import {useCallback} from "react";
import {axiosInstance} from "../../services/axios";
import API from "../../config/api";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Button from "@mui/material/Button";
import * as React from "react";


const TableMultiRowDeleteConfirmDialog = (
    {
        setRefresh,
        selected,
        setSelected,
        dialogOpen,
        dialogTitle,
        dialogContent,
        handleDialogClose
    }) => {

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