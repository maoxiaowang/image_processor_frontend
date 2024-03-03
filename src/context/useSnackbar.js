import {createContext, memo, useCallback, useContext, useMemo, useState} from 'react';
import {Slide, Snackbar} from "@mui/material";
import Alert from "@mui/material/Alert";

const SnackbarContext = createContext();

export const SnackbarProvider = memo(({children}) => {
    console.log('SnackbarProvider')
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const openSnackbar = useCallback((message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity)
        setSnackbarOpen(true);
    }, [setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen]);

    const closeSnackbar = useCallback(() => {
        setSnackbarOpen(false);
        setTimeout(() => {
            setSnackbarMessage('');
        }, 1000);
    }, [setSnackbarOpen, setSnackbarMessage]);

    const value = useMemo(() => {
        return {
            openSnackbar,
            closeSnackbar
        };
    }, [openSnackbar, closeSnackbar]);

    return (
        <SnackbarContext.Provider value={value}>
            {children}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={closeSnackbar}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                TransitionComponent={Slide}
            >
                <Alert onClose={closeSnackbar} severity={snackbarSeverity} variant="filled">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
}, []);

export const useSnackbar = () => {
    return useContext(SnackbarContext);
};