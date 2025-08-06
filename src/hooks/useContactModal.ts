import React from 'react';
import { useModal } from '../contexts/ModalContext';
import { ContactModal } from '../component/common/ContactModal';

export const useContactModal = () => {
  const { openModal, closeModal } = useModal();

  const openContactModal = () => {
    openModal(React.createElement(ContactModal, { onClose: closeModal }));
  };

  return {
    openContactModal,
  };
};