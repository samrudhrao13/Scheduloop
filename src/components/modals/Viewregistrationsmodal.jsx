import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { formatDate } from '../../utils/helpers';

const ViewRegistrationsModal = ({ isOpen, onClose, event, users }) => {
    const [registrationsList, setRegistrationsList] = useState([]);

    useEffect(() => {
        if (isOpen && event && event.registrations) {
            // Convert registrations object to array with user details
            const regList = Object.entries(event.registrations).map(([userId, regData]) => {
                const userData = users[userId] || {};
                return {
                    userId,
                    ...regData,
                    userName: userData.name || 'Unknown User',
                    userEmail: userData.email || 'N/A',
                    userUSN: userData.usn || 'N/A',
                    userDepartment: userData.department || 'N/A'
                };
            });

            // Sort by registration date (newest first)
            regList.sort((a, b) => b.registeredAt - a.registeredAt);

            setRegistrationsList(regList);
        }
    }, [isOpen, event, users]);

    const exportToCSV = () => {
        if (registrationsList.length === 0) return;

        const headers = ['S.No', 'Name', 'USN', 'Email', 'Department', 'Registered Date', 'Amount Paid'];
        const rows = registrationsList.map((reg, index) => [
            index + 1,
            reg.userName,
            reg.userUSN,
            reg.userEmail,
            reg.userDepartment,
            new Date(reg.registeredAt).toLocaleDateString('en-IN'),
            reg.amountPaid || 0
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${event.title}_Registrations_${Date.now()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const totalRevenue = registrationsList.reduce((sum, reg) => sum + (reg.amountPaid || 0), 0);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Event Registrations" size="large">
            <h3 style={{ color: '#667eea', marginBottom: '15px' }}>{event?.title}</h3>

            <div style={{
                background: '#f8f9fa',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px'
            }}>
                <div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Total Registrations</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                        {registrationsList.length}
                    </div>
                </div>
                {event?.isPaid && (
                    <div>
                        <div style={{ fontSize: '14px', color: '#666' }}>Total Revenue</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                            ₹{totalRevenue}
                        </div>
                    </div>
                )}
                <div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Event Fee</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
                        {event?.isPaid ? `₹${event.fee}` : 'Free'}
                    </div>
                </div>
            </div>

            {registrationsList.length > 0 ? (
                <>
                    <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4>Registered Students</h4>
                        <button onClick={exportToCSV} className="btn btn-primary" style={{ padding: '8px 16px' }}>
                            📥 Export to CSV
                        </button>
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Name</th>
                                    <th>USN</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th>Registered Date</th>
                                    <th>Amount Paid</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrationsList.map((reg, index) => (
                                    <tr key={reg.userId}>
                                        <td>{index + 1}</td>
                                        <td style={{ fontWeight: '600' }}>{reg.userName}</td>
                                        <td>{reg.userUSN}</td>
                                        <td>{reg.userEmail}</td>
                                        <td>{reg.userDepartment}</td>
                                        <td>{new Date(reg.registeredAt).toLocaleDateString('en-IN')}</td>
                                        <td style={{ fontWeight: '600', color: reg.amountPaid > 0 ? '#28a745' : '#666' }}>
                                            {reg.amountPaid > 0 ? `₹${reg.amountPaid}` : 'Free'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="empty-state">
                    <div className="empty-state-icon">👥</div>
                    <h3>No Registrations Yet</h3>
                    <p>Students haven't registered for this event yet</p>
                </div>
            )}

            <div className="modal-footer">
                <button onClick={onClose} className="btn btn-secondary">
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default ViewRegistrationsModal;