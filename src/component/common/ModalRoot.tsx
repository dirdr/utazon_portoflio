import React from 'react';
import { useModal } from '../../contexts/ModalContext';
import { Modal } from './Modal';

export const ModalRoot: React.FC = () => {
  const { isOpen, modalContent, closeModal } = useModal();

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      {modalContent}
    </Modal>
  );
};