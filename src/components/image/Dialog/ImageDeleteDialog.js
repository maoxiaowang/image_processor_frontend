import {useCallback} from "react";
import {axiosInstance} from "../../../services/axios";
import API from "../../../config/api";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Button from "@mui/material/Button";
import * as React from "react";


const ImageDeleteDialog = (
    {
        open,
        title,
        content,
        onConfirm,
        onClose
    }) => {

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="error" onClick={onConfirm} autoFocus>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(ImageDeleteDialog);