import React from 'react';
import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
            <p style={{ marginBottom: '20px', fontSize: '16px', color: '#666' }}>
                {message}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={onClose}>
                    {cancelText}
                </button>
                <button className="btn btn-danger" onClick={handleConfirm}>
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;