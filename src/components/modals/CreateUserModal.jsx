import React, { useState } from 'react';
import Modal from '../common/Modal';
import { ref, set, get } from 'firebase/database';
import { database } from '../../config/firebase';
import { generateId } from '../../utils/helpers';
import { DEFAULT_WALLET_BALANCE } from '../../utils/constants';

const CreateUserModal = ({ isOpen, onClose, onSuccess, institutionId }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'student',
        department: '',
        usn: ''
    });
    const [loading, setLoading] = useState(false);
    const [showCredentials, setShowCredentials] = useState(false);
    const [newCredentials, setNewCredentials] = useState(null);
    const [institutionName, setInstitutionName] = useState('');

    useState(() => {
        if (institutionId) {
            get(ref(database, `institutions/${institutionId}`)).then(snapshot => {
                if (snapshot.exists()) {
                    setInstitutionName(snapshot.val().name);
                }
            });
        }
    }, [institutionId]);

    const handleSubmit = async () => {
        if (!formData.name || !formData.email || !formData.role) {
            alert('Please fill in all required fields');
            return;
        }

        if (formData.role === 'student' && !formData.usn) {
            alert('USN is required for students');
            return;
        }

        setLoading(true);

        try {
            const userId = generateId();
            const tempPassword = formData.role.charAt(0).toUpperCase() + formData.role.slice(1) + '@' +
                Math.random().toString(36).substr(2, 6);

            const newUser = {
                name: formData.name,
                email: formData.email,
                password: tempPassword,
                role: formData.role,
                department: formData.department,
                institutionId: institutionId,
                mustChangePassword: true,
                createdAt: Date.now()
            };

            if (formData.role === 'student') {
                newUser.usn = formData.usn;
                newUser.wallet = DEFAULT_WALLET_BALANCE;
            }

            await set(ref(database, `users/${userId}`), newUser);

            // Get institution name
            const instSnapshot = await get(ref(database, `institutions/${institutionId}`));
            const instName = instSnapshot.exists() ? instSnapshot.val().name : 'Your Institution';

            setNewCredentials({
                name: formData.name,
                email: formData.email,
                password: tempPassword,
                role: formData.role,
                department: formData.department,
                usn: formData.usn,
                wallet: newUser.wallet,
                institutionName: instName
            });

            setShowCredentials(true);
            setFormData({ name: '', email: '', role: 'student', department: '', usn: '' });

        } catch (error) {
            console.error('Error creating user:', error);
            alert('Failed to create user: ' + error.message);
        }

        setLoading(false);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const handleClose = () => {
        setShowCredentials(false);
        setNewCredentials(null);
        onClose();
        onSuccess();
    };

    const getRoleColor = (role) => {
        const colors = {
            student: '#667eea',
            faculty: '#28a745',
            hod: '#ffc107',
            principal: '#dc3545'
        };
        return colors[role] || '#667eea';
    };

    if (showCredentials && newCredentials) {
        return (
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title="User Created Successfully"
                size="large"
            >
                <div style={{
                    background: `linear-gradient(135deg, ${getRoleColor(newCredentials.role)} 0%, ${getRoleColor(newCredentials.role)}dd 100%)`,
                    color: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ marginBottom: '10px', fontSize: '20px' }}>
                        {newCredentials.role.toUpperCase()} Account Created!
                    </h3>
                    <p>{newCredentials.name}</p>
                </div>

                <div style={{
                    background: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '10px',
                    marginBottom: '15px'
                }}>
                    <h4 style={{ color: '#667eea', marginBottom: '15px' }}>User Details</h4>

                    <div style={{ marginBottom: '10px' }}>
                        <strong>Name:</strong> {newCredentials.name}
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <strong>Role:</strong> {newCredentials.role.charAt(0).toUpperCase() + newCredentials.role.slice(1)}
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <strong>Department:</strong> {newCredentials.department || 'N/A'}
                    </div>

                    {newCredentials.usn && (
                        <div style={{ marginBottom: '10px' }}>
                            <strong>USN:</strong> {newCredentials.usn}
                        </div>
                    )}

                    {newCredentials.wallet !== undefined && (
                        <div style={{ marginBottom: '10px' }}>
                            <strong>Wallet Balance:</strong> ₹{newCredentials.wallet}
                        </div>
                    )}
                </div>

                <div style={{
                    background: '#fff3cd',
                    border: '2px solid #ffc107',
                    padding: '20px',
                    borderRadius: '10px'
                }}>
                    <h4 style={{ color: '#856404', marginBottom: '15px' }}>
                        Login Credentials
                    </h4>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                            Email:
                        </label>
                        <div style={{
                            background: 'white',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ddd',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span>{newCredentials.email}</span>
                            <button
                                onClick={() => copyToClipboard(newCredentials.email)}
                                className="btn btn-secondary"
                                style={{ padding: '5px 15px', fontSize: '12px' }}
                            >
                                Copy
                            </button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                            Temporary Password:
                        </label>
                        <div style={{
                            background: 'white',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ddd',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <code style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                {newCredentials.password}
                            </code>
                            <button
                                onClick={() => copyToClipboard(newCredentials.password)}
                                className="btn btn-secondary"
                                style={{ padding: '5px 15px', fontSize: '12px' }}
                            >
                                Copy
                            </button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                            Institution:
                        </label>
                        <div style={{
                            background: 'white',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ddd'
                        }}>
                            {newCredentials.institutionName}
                        </div>
                    </div>

                    <div className="message message-warning" style={{ marginTop: '15px' }}>
                        <strong>Important Instructions:</strong>
                        <ul style={{ marginTop: '10px', paddingLeft: '20px', fontSize: '14px' }}>
                            <li>Share these credentials with {newCredentials.name}</li>
                            <li>User must select their institution during login</li>
                            <li>User must change password on first login</li>
                            <li>Password cannot be recovered - save it now!</li>
                        </ul>
                    </div>
                </div>

                <div className="modal-footer" style={{ marginTop: '20px' }}>
                    <button
                        onClick={() => {
                            const text = `Login Credentials for ${newCredentials.name}\n\n` +
                                `Role: ${newCredentials.role.toUpperCase()}\n` +
                                `Email: ${newCredentials.email}\n` +
                                `Password: ${newCredentials.password}\n` +
                                `Institution: ${newCredentials.institutionName}\n` +
                                (newCredentials.usn ? `USN: ${newCredentials.usn}\n` : '') +
                                (newCredentials.wallet ? `Wallet: ₹${newCredentials.wallet}\n` : '') +
                                `\nImportant: Change password on first login!`;
                            copyToClipboard(text);
                        }}
                        className="btn btn-info"
                    >
                        Copy All Details
                    </button>
                    <button
                        onClick={handleClose}
                        className="btn btn-primary"
                    >
                        Done
                    </button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New User">
            <div className="form-group">
                <label>Full Name *</label>
                <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                />
            </div>

            <div className="form-group">
                <label>Email *</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@example.com"
                />
            </div>

            <div className="form-group">
                <label>Role *</label>
                <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="hod">HOD</option>
                    <option value="principal">Principal</option>
                </select>
            </div>

            <div className="form-group">
                <label>Department</label>
                <input
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g., Computer Science"
                />
            </div>

            {formData.role === 'student' && (
                <div className="form-group">
                    <label>USN / Roll Number *</label>
                    <input
                        value={formData.usn}
                        onChange={(e) => setFormData({ ...formData, usn: e.target.value })}
                        placeholder="Student USN"
                    />
                </div>
            )}

            <div className="message message-info">
                A temporary password will be auto-generated and shown after creation. User must change it on first login.
            </div>

            <div className="modal-footer">
                <button onClick={onClose} className="btn btn-secondary" disabled={loading}>
                    Cancel
                </button>
                <button onClick={handleSubmit} className="btn btn-success" disabled={loading}>
                    {loading ? 'Creating...' : 'Create User'}
                </button>
            </div>
        </Modal>
    );
};

export default CreateUserModal;