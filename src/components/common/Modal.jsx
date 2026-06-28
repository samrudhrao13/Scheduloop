import React from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'default' }) => {
    if (!isOpen) return null;

    const modalClass = size === 'large' ? 'modal modal-large' :
        size === 'small' ? 'modal modal-small' : 'modal';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={modalClass} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;