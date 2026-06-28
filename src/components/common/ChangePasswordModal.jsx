import React, { useState } from 'react';
import Modal from './Modal';
import { ref, update, get } from 'firebase/database';
import { database } from '../../config/firebase';

const ChangePasswordModal = ({ isOpen, onClose, user }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill all fields');
            return;
        }

        if (newPassword.length < 6) {
            alert('New password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        setLoading(true);

        try {
            // Verify current password
            const userSnapshot = await get(ref(database, `users/${user.id}`));
            const userData = userSnapshot.val();

            if (userData.password !== currentPassword) {
                alert('Current password is incorrect');
                setLoading(false);
                return;
            }

            // Update password
            await update(ref(database, `users/${user.id}`), {
                password: newPassword
            });

            alert('Password changed successfully! Please login again.');

            // Force re-login
            localStorage.removeItem('erp_user');
            window.location.reload();

        } catch (error) {
            console.error('Error changing password:', error);
            alert('Failed to change password: ' + error.message);
        }

        setLoading(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
            <div className="form-group">
                <label>Current Password</label>
                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                />
            </div>

            <div className="form-group">
                <label>New Password</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                />
            </div>

            <div className="form-group">
                <label>Confirm New Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                />
            </div>

            <div className="modal-footer">
                <button onClick={onClose} className="btn btn-secondary" disabled={loading}>
                    Cancel
                </button>
                <button onClick={handleSubmit} className="btn btn-success" disabled={loading}>
                    {loading ? 'Changing...' : 'Change Password'}
                </button>
            </div>
        </Modal>
    );
};

export default ChangePasswordModal;