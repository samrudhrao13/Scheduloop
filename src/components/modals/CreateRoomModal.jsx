import React, { useState } from 'react';
import Modal from '../common/Modal';
import { createRoom } from '../../services/roomService';

const CreateRoomModal = ({ isOpen, onClose, onSuccess, institutionId }) => {
    const [formData, setFormData] = useState({
        name: '',
        capacity: '',
        latitude: '',
        longitude: '',
        radius: '100'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!formData.name || !formData.capacity || !formData.latitude || !formData.longitude || !formData.radius) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.radius <= 0) {
            setError('Radius must be greater than 0');
            return;
        }

        setLoading(true);
        setError('');

        const result = await createRoom(formData, institutionId);

        setLoading(false);

        if (result.success) {
            onSuccess();
            onClose();
            setFormData({ name: '', capacity: '', latitude: '', longitude: '', radius: '100' });
        } else {
            setError(result.error);
        }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData({
                        ...formData,
                        latitude: position.coords.latitude.toFixed(6),
                        longitude: position.coords.longitude.toFixed(6)
                    });
                },
                (error) => {
                    setError('Unable to get location: ' + error.message);
                }
            );
        } else {
            setError('Geolocation is not supported by your browser');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Room">
            {error && <div className="message message-error">{error}</div>}

            <div className="form-group">
                <label>Room Name *</label>
                <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Auditorium, Lab 101"
                />
            </div>

            <div className="form-group">
                <label>Capacity *</label>
                <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="Maximum number of people"
                />
            </div>

            <div className="form-group">
                <label>Latitude *</label>
                <input
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="e.g., 12.9716"
                />
            </div>

            <div className="form-group">
                <label>Longitude *</label>
                <input
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="e.g., 77.5946"
                />
            </div>

            <div className="form-group">
                <label>Geo-fence Radius (meters) *</label>
                <input
                    type="number"
                    value={formData.radius}
                    onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
                    placeholder="e.g., 100"
                    min="1"
                />
                <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                    Students must be within this distance to mark attendance
                </small>
            </div>

            <button onClick={getCurrentLocation} className="btn btn-info" style={{ marginBottom: '15px' }}>
                📍 Use Current Location
            </button>

            <div className="modal-footer">
                <button onClick={onClose} className="btn btn-secondary" disabled={loading}>
                    Cancel
                </button>
                <button onClick={handleSubmit} className="btn btn-success" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Room'}
                </button>
            </div>
        </Modal>
    );
};

export default CreateRoomModal;