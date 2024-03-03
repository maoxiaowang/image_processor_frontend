import {useCallback, useState} from 'react';

const useModal = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');

    const handleModalOpen = useCallback(() => {
        setModalOpen(true)
    }, []);

    const handleModalClose = useCallback(() => {
        setModalOpen(false);
    }, []);

    return {
        modalOpen,
        setModalOpen,
        handleModalOpen,
        handleModalClose,
        modalTitle,
        setModalTitle,
        modalContent,
        setModalContent
    };
};

export default useModal;