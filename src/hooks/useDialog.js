import {useState} from 'react';

const useDialog = () => {
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogContent, setDialogContent] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

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