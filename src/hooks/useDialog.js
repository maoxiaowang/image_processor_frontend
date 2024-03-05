import {useCallback, useState} from 'react';

const useDialog = () => {
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogContent, setDialogContent] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDialogOpen = useCallback(() => {
        setDialogOpen(true);
    }, []);

    const handleDialogClose = useCallback(() => {
        setDialogOpen(false);
    }, []);

    return {
        dialogOpen,
        dialogTitle,
        dialogContent,
        setDialogTitle,
        setDialogContent,
        setDialogOpen,
        handleDialogOpen,
        handleDialogClose
    };
};

export default useDialog;