import React from "react";
import {Slide, Snackbar} from "@mui/material";
import Alert from "@mui/material/Alert";

const AlertSnackbar = ({open, onClose, severity, message}) => {
        console.log('RUN GlobalSnackbar')
        return (
            <Snackbar
                open={open}
                autoHideDuration={3000}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                onClose={onClose}
                TransitionComponent={Slide}
            >
                <Alert onClose={onClose} severity={severity} variant="filled">
                    {message}
                </Alert>
            </Snackbar>
        )
    };

export default AlertSnackbar;