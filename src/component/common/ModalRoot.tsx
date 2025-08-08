import React from 'react';
import { useModal } from '../../contexts/ModalContext';
import { Modal } from './Modal';

export const ModalRoot: React.FC = () => {
  const { isOpen, isClosing, modalContent, closeModal } = useModal();

  return (
    <Modal isOpen={isOpen} isClosing={isClosing} onClose={closeModal}>
      {modalContent}
    </Modal>
  );
};