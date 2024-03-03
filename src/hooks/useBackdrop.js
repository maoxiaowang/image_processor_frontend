import { useState } from 'react';

const useBackdrop = () => {
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [backdropMessage, setBackdropMessage] = useState('');

    const openBackdrop = (message='') => {
        setBackdropMessage(message);
        setBackdropOpen(true);
    };

    const closeBackdrop = () => {
        setBackdropOpen(false);
    };

    return {
        backdropOpen,
        backdropMessage,
        setBackdropMessage,
        openBackdrop,
        closeBackdrop
    };
};

export default useBackdrop;