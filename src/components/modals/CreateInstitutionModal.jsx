import React, { useState } from 'react';
import Modal from '../common/Modal';
import { createInstitution } from '../../services/institutionService';

const CreateInstitutionModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        adminEmail: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!formData.name || !formData.location || !formData.adminEmail) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        const result = await createInstitution(
            { name: formData.name, location: formData.location },
            formData.adminEmail
        );

        setLoading(false);

        if (result.success) {
            onSuccess();
            onClose();
            setFormData({ name: '', location: '', adminEmail: '' });
        } else {
            setError(result.error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Institution">
            {error && <div className="message message-error">{error}</div>}

            <div className="form-group">
                <label>Institution Name *</label>
                <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter institution name"
                />
            </div>

            <div className="form-group">
                <label>Location *</label>
                <input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, State"
                />
            </div>

            <div className="form-group">
                <label>Admin Email *</label>
                <input
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    placeholder="admin@institution.com"
                />
            </div>

            <div className="modal-footer">
                <button onClick={onClose} className="btn btn-secondary" disabled={loading}>
                    Cancel
                </button>
                <button onClick={handleSubmit} className="btn btn-success" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Institution'}
                </button>
            </div>
        </Modal>
    );
};

export default CreateInstitutionModal;