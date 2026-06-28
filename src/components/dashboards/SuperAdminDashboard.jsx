import React, { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../../config/firebase';
import Header from '../common/Header';
import StatCard from '../common/StatCard';
import Table from '../common/Table';
import Modal from '../common/Modal';
import { generateId } from '../../utils/helpers';

const SuperAdminDashboard = ({ user, onLogout }) => {
    const [institutions, setInstitutions] = useState({});
    const [users, setUsers] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);
    const [newCredentials, setNewCredentials] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        adminName: '',
        adminEmail: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const institutionsRef = ref(database, 'institutions');
        const usersRef = ref(database, 'users');

        const unsubInstitutions = onValue(institutionsRef, (snapshot) => {
            setInstitutions(snapshot.val() || {});
        });

        const unsubUsers = onValue(usersRef, (snapshot) => {
            setUsers(snapshot.val() || {});
        });

        return () => {
            unsubInstitutions();
            unsubUsers();
        };
    }, []);

    const createInstitution = async () => {
        if (!formData.name || !formData.location || !formData.adminName || !formData.adminEmail) {
            alert('Please fill all fields');
            return;
        }

        setLoading(true);

        try {
            const institutionId = generateId();
            const adminId = generateId();
            const tempPassword = 'Admin@' + Math.random().toString(36).substr(2, 6);

            await set(ref(database, `institutions/${institutionId}`), {
                name: formData.name,
                location: formData.location,
                adminId: adminId,
                createdAt: Date.now(),
                createdBy: user.id
            });

            await set(ref(database, `users/${adminId}`), {
                email: formData.adminEmail,
                password: tempPassword,
                role: 'admin',
                name: formData.adminName,
                institutionId: institutionId,
                mustChangePassword: true,
                createdAt: Date.now()
            });

            setNewCredentials({
                institutionName: formData.name,
                institutionId: institutionId,
                name: formData.adminName,
                email: formData.adminEmail,
                password: tempPassword
            });

            setShowModal(false);
            setShowCredentialsModal(true);
            setFormData({ name: '', location: '', adminName: '', adminEmail: '' });
        } catch (error) {
            console.error('Error creating institution:', error);
            alert('Failed to create institution: ' + error.message);
        }

        setLoading(false);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const institutionsList = Object.entries(institutions).map(([id, inst]) => {
        const admin = users[inst.adminId];
        return {
            id,
            name: inst.name,
            location: inst.location,
            adminEmail: admin?.email || 'N/A',
            adminName: admin?.name || 'N/A'
        };
    });

    const [showAdminCredentialsModal, setShowAdminCredentialsModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    const viewAdminCredentials = (institutionId, adminId) => {
        const admin = users[adminId];
        const institution = institutions[institutionId];
        if (admin && institution) {
            setSelectedAdmin({
                ...admin,
                adminId,
                institutionId,
                institutionName: institution.name
            });
            setShowAdminCredentialsModal(true);
        }
    };

    const columns = [
        { header: 'Institution Name', accessor: 'name' },
        { header: 'Location', accessor: 'location' },
        { header: 'Admin Name', accessor: 'adminName' },
        { header: 'Admin Email', accessor: 'adminEmail' },
        {
            header: 'Institution ID',
            render: (row) => (
                <code style={{
                    background: '#f4f4f4',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                }}>
                    {row.id}
                </code>
            )
        },
        {
            header: 'Actions',
            render: (row) => (
                <button
                    onClick={() => viewAdminCredentials(row.id, institutions[row.id]?.adminId)}
                    className="btn btn-info"
                    style={{ padding: '6px 12px', fontSize: '13px' }}
                >
                    View Credentials
                </button>
            )
        }
    ];

    return (
        <div className="app-container">
            <div className="dashboard">
                <Header title="Super Admin Dashboard" user={user} onLogout={onLogout} />

                <div className="dashboard-content">
                    <StatCard
                        title="Total Institutions"
                        value={Object.keys(institutions).length}
                        color="primary"
                    />
                    <StatCard
                        title="Total Admins"
                        value={Object.values(users).filter(u => u.role === 'admin').length}
                        color="success"
                    />
                    <StatCard
                        title="Total Users"
                        value={Object.keys(users).length}
                        color="info"
                    />
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Manage Institutions</h3>
                        <button onClick={() => setShowModal(true)} className="btn btn-primary">
                            + Create New Institution
                        </button>
                    </div>

                    {institutionsList.length > 0 ? (
                        <Table columns={columns} data={institutionsList} />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                            <p>No institutions created yet.</p>
                        </div>
                    )}
                </div>

                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title="Create New Institution"
                >
                    <div className="form-group">
                        <label>Institution Name *</label>
                        <input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., ABC Institute of Technology"
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
                        <label>Admin Name *</label>
                        <input
                            value={formData.adminName}
                            onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                            placeholder="Full name of admin"
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

                    <div className="message message-info">
                        A temporary password will be generated. Admin must change it on first login.
                    </div>

                    <div className="modal-footer">
                        <button
                            onClick={() => setShowModal(false)}
                            className="btn btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={createInstitution}
                            className="btn btn-success"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Institution'}
                        </button>
                    </div>
                </Modal>

                {newCredentials && (
                    <Modal
                        isOpen={showCredentialsModal}
                        onClose={() => setShowCredentialsModal(false)}
                        title="Institution & Admin Created Successfully"
                        size="large"
                    >
                        <div style={{
                            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                            color: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            marginBottom: '20px',
                            textAlign: 'center'
                        }}>
                            <h3 style={{ marginBottom: '10px', fontSize: '20px' }}>Success!</h3>
                            <p>Institution and Admin account created</p>
                        </div>

                        <div style={{
                            background: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '10px',
                            marginBottom: '15px'
                        }}>
                            <h4 style={{ color: '#667eea', marginBottom: '15px' }}>Institution Details</h4>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Name:</strong> {newCredentials.institutionName}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <strong>Institution ID:</strong>
                                <code style={{
                                    background: 'white',
                                    padding: '5px 10px',
                                    borderRadius: '5px',
                                    flex: 1
                                }}>
                                    {newCredentials.institutionId}
                                </code>
                                <button
                                    onClick={() => copyToClipboard(newCredentials.institutionId)}
                                    className="btn btn-info"
                                    style={{ padding: '5px 15px', fontSize: '12px' }}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div style={{
                            background: '#fff3cd',
                            border: '2px solid #ffc107',
                            padding: '20px',
                            borderRadius: '10px'
                        }}>
                            <h4 style={{ color: '#856404', marginBottom: '15px' }}>
                                Admin Login Credentials
                            </h4>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                                    Name:
                                </label>
                                <div style={{
                                    background: 'white',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '1px solid #ddd'
                                }}>
                                    {newCredentials.name}
                                </div>
                            </div>

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

                            <div className="message message-warning" style={{ marginTop: '15px' }}>
                                <strong>Important:</strong>
                                <ul style={{ marginTop: '10px', paddingLeft: '20px', fontSize: '14px' }}>
                                    <li>Save these credentials securely</li>
                                    <li>Share them with the admin</li>
                                    <li>Admin must change password on first login</li>
                                    <li>Admin will need the Institution ID to login</li>
                                </ul>
                            </div>
                        </div>

                        <div className="modal-footer" style={{ marginTop: '20px' }}>
                            <button
                                onClick={() => {
                                    const text = `Institution: ${newCredentials.institutionName}\n` +
                                        `Institution ID: ${newCredentials.institutionId}\n\n` +
                                        `Admin Credentials:\n` +
                                        `Name: ${newCredentials.name}\n` +
                                        `Email: ${newCredentials.email}\n` +
                                        `Password: ${newCredentials.password}\n\n` +
                                        `Note: Admin must change password on first login`;
                                    copyToClipboard(text);
                                }}
                                className="btn btn-info"
                            >
                                Copy All Details
                            </button>
                            <button
                                onClick={() => setShowCredentialsModal(false)}
                                className="btn btn-primary"
                            >
                                Done
                            </button>
                        </div>
                    </Modal>
                )}

                {/* Admin Credentials Modal */}
                {selectedAdmin && (
                    <Modal
                        isOpen={showAdminCredentialsModal}
                        onClose={() => {
                            setShowAdminCredentialsModal(false);
                            setSelectedAdmin(null);
                        }}
                        title="Admin Credentials"
                        size="large"
                    >
                        <div style={{
                            background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                            color: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            marginBottom: '20px',
                            textAlign: 'center'
                        }}>
                            <h3 style={{ marginBottom: '10px', fontSize: '20px' }}>ADMIN</h3>
                            <p style={{ fontSize: '18px' }}>{selectedAdmin.name}</p>
                        </div>

                        <div style={{
                            background: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '10px',
                            marginBottom: '15px'
                        }}>
                            <h4 style={{ color: '#667eea', marginBottom: '15px' }}>Admin Details</h4>

                            <div style={{ marginBottom: '10px' }}>
                                <strong>Name:</strong> {selectedAdmin.name}
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <strong>Role:</strong> Admin
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <strong>Institution:</strong> {selectedAdmin.institutionName}
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <strong>Institution ID:</strong>
                                <code style={{
                                    marginLeft: '10px',
                                    background: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '12px'
                                }}>
                                    {selectedAdmin.institutionId}
                                </code>
                            </div>
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
                                    <span>{selectedAdmin.email}</span>
                                    <button
                                        onClick={() => copyToClipboard(selectedAdmin.email)}
                                        className="btn btn-secondary"
                                        style={{ padding: '5px 15px', fontSize: '12px' }}
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                                    Password:
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
                                        {selectedAdmin.password}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(selectedAdmin.password)}
                                        className="btn btn-secondary"
                                        style={{ padding: '5px 15px', fontSize: '12px' }}
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <div className="message message-info" style={{ marginTop: '15px' }}>
                                <strong>Note:</strong>
                                <ul style={{ marginTop: '10px', paddingLeft: '20px', fontSize: '14px' }}>
                                    <li>Admin must select their institution during login</li>
                                    <li>If password was changed, it shows the current password</li>
                                    <li>Keep credentials secure</li>
                                </ul>
                            </div>
                        </div>

                        <div className="modal-footer" style={{ marginTop: '20px' }}>
                            <button
                                onClick={() => {
                                    const text = `Admin Login Credentials\n\n` +
                                        `Institution: ${selectedAdmin.institutionName}\n` +
                                        `Institution ID: ${selectedAdmin.institutionId}\n\n` +
                                        `Name: ${selectedAdmin.name}\n` +
                                        `Email: ${selectedAdmin.email}\n` +
                                        `Password: ${selectedAdmin.password}`;
                                    copyToClipboard(text);
                                }}
                                className="btn btn-info"
                            >
                                Copy All Details
                            </button>
                            <button
                                onClick={() => {
                                    setShowAdminCredentialsModal(false);
                                    setSelectedAdmin(null);
                                }}
                                className="btn btn-primary"
                            >
                                Close
                            </button>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
};

export default SuperAdminDashboard;