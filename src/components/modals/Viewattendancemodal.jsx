// import React, { useState, useEffect } from 'react';
// import Modal from '../common/Modal';

// const ViewAttendanceModal = ({ isOpen, onClose, eventId, eventTitle, attendance, users }) => {
//     const [attendanceList, setAttendanceList] = useState([]);

//     useEffect(() => {
//         if (isOpen && attendance) {
//             // Convert attendance object to array with user details
//             const attList = Object.entries(attendance).map(([userId, attData]) => {
//                 const userData = users[userId] || {};
//                 return {
//                     userId,
//                     ...attData,
//                     userName: userData.name || 'Unknown User',
//                     userEmail: userData.email || 'N/A',
//                     userUSN: userData.usn || 'N/A',
//                     userDepartment: userData.department || 'N/A'
//                 };
//             });

//             // Sort by attendance timestamp (oldest first)
//             attList.sort((a, b) => a.timestamp - b.timestamp);

//             setAttendanceList(attList);
//         }
//     }, [isOpen, attendance, users]);

//     const exportToCSV = () => {
//         if (attendanceList.length === 0) return;

//         const headers = ['S.No', 'Name', 'USN', 'Email', 'Department', 'Marked At', 'Distance (m)'];
//         const rows = attendanceList.map((att, index) => [
//             index + 1,
//             att.userName,
//             att.userUSN,
//             att.userEmail,
//             att.userDepartment,
//             new Date(att.timestamp).toLocaleString('en-IN'),
//             att.distance || 'N/A'
//         ]);

//         const csvContent = [
//             headers.join(','),
//             ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
//         ].join('\n');

//         const blob = new Blob([csvContent], { type: 'text/csv' });
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `${eventTitle}_Attendance_${Date.now()}.csv`;
//         a.click();
//         window.URL.revokeObjectURL(url);
//     };

//     const getAttendancePercentage = () => {
//         // This would require knowing total registrations
//         // For now, just return the count
//         return attendanceList.length;
//     };

//     return (
//         <Modal isOpen={isOpen} onClose={onClose} title="Event Attendance" size="large">
//             <h3 style={{ color: '#667eea', marginBottom: '15px' }}>{eventTitle}</h3>

//             <div style={{
//                 background: '#f8f9fa',
//                 padding: '15px',
//                 borderRadius: '8px',
//                 marginBottom: '20px',
//                 display: 'grid',
//                 gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//                 gap: '15px'
//             }}>
//                 <div>
//                     <div style={{ fontSize: '14px', color: '#666' }}>Total Attendance</div>
//                     <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
//                         {attendanceList.length}
//                     </div>
//                 </div>
//                 <div>
//                     <div style={{ fontSize: '14px', color: '#666' }}>Average Distance</div>
//                     <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
//                         {attendanceList.length > 0
//                             ? Math.round(
//                                 attendanceList.reduce((sum, att) => sum + (att.distance || 0), 0) /
//                                 attendanceList.length
//                             )
//                             : 0}m
//                     </div>
//                 </div>
//             </div>

//             {attendanceList.length > 0 ? (
//                 <>
//                     <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                         <h4>Students Present</h4>
//                         <button onClick={exportToCSV} className="btn btn-success" style={{ padding: '8px 16px' }}>
//                             📥 Export to CSV
//                         </button>
//                     </div>

//                     <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
//                         <table className="table">
//                             <thead>
//                                 <tr>
//                                     <th>S.No</th>
//                                     <th>Name</th>
//                                     <th>USN</th>
//                                     <th>Email</th>
//                                     <th>Department</th>
//                                     <th>Marked At</th>
//                                     <th>Distance (m)</th>
//                                     <th>Status</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {attendanceList.map((att, index) => (
//                                     <tr key={att.userId}>
//                                         <td>{index + 1}</td>
//                                         <td style={{ fontWeight: '600' }}>{att.userName}</td>
//                                         <td>{att.userUSN}</td>
//                                         <td>{att.userEmail}</td>
//                                         <td>{att.userDepartment}</td>
//                                         <td>{new Date(att.timestamp).toLocaleString('en-IN')}</td>
//                                         <td style={{
//                                             fontWeight: '600',
//                                             color: att.distance <= 50 ? '#28a745' : att.distance <= 100 ? '#ffc107' : '#dc3545'
//                                         }}>
//                                             {att.distance || 'N/A'}
//                                         </td>
//                                         <td>
//                                             <span style={{
//                                                 display: 'inline-block',
//                                                 padding: '4px 12px',
//                                                 borderRadius: '12px',
//                                                 fontSize: '12px',
//                                                 fontWeight: '600',
//                                                 background: '#d4edda',
//                                                 color: '#155724'
//                                             }}>
//                                                 ✓ Present
//                                             </span>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     <div style={{
//                         marginTop: '15px',
//                         padding: '10px',
//                         background: '#e3f2fd',
//                         borderRadius: '6px',
//                         fontSize: '13px',
//                         color: '#1976d2'
//                     }}>
//                         <strong>Distance Color Code:</strong>
//                         <span style={{ marginLeft: '15px' }}>
//                             <span style={{ color: '#28a745' }}>● 0-50m: Excellent</span>
//                             <span style={{ marginLeft: '15px', color: '#ffc107' }}>● 51-100m: Good</span>
//                             <span style={{ marginLeft: '15px', color: '#dc3545' }}>● 100m+: Far</span>
//                         </span>
//                     </div>
//                 </>
//             ) : (
//                 <div className="empty-state">
//                     <div className="empty-state-icon">📋</div>
//                     <h3>No Attendance Marked</h3>
//                     <p>No students have marked attendance for this event yet</p>
//                 </div>
//             )}

//             <div className="modal-footer">
//                 <button onClick={onClose} className="btn btn-secondary">
//                     Close
//                 </button>
//             </div>
//         </Modal>
//     );
// };

// export default ViewAttendanceModal; 















import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { getAttendanceStats } from '../../services/attendanceService';

const ViewAttendanceModal = ({ isOpen, onClose, eventId, eventTitle, attendance, users, roomRadius }) => {
    const [attendanceList, setAttendanceList] = useState([]);
    const [stats, setStats] = useState({});

    useEffect(() => {
        if (isOpen && attendance) {
            // Convert attendance object to array with user details
            const attList = Object.entries(attendance).map(([userId, attData]) => {
                const userData = users[userId] || {};
                return {
                    userId,
                    ...attData,
                    userName: userData.name || 'Unknown User',
                    userEmail: userData.email || 'N/A',
                    userUSN: userData.usn || 'N/A',
                    userDepartment: userData.department || 'N/A'
                };
            });

            // Sort by attendance timestamp (oldest first)
            attList.sort((a, b) => a.timestamp - b.timestamp);

            setAttendanceList(attList);
            setStats(getAttendanceStats(attendance));
        }
    }, [isOpen, attendance, users]);

    const exportToCSV = () => {
        if (attendanceList.length === 0) return;

        const headers = ['S.No', 'Name', 'USN', 'Email', 'Department', 'Marked At', 'Distance (m)', 'Room Radius (m)', 'Status'];
        const rows = attendanceList.map((att, index) => [
            index + 1,
            att.userName,
            att.userUSN,
            att.userEmail,
            att.userDepartment,
            new Date(att.timestamp).toLocaleString('en-IN'),
            att.distance || 'N/A',
            att.roomRadius || roomRadius || 'N/A',
            att.status === 'present' ? 'Present' : 'Absent'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${eventTitle}_Attendance_${Date.now()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const getStatusColor = (status) => {
        return status === 'present' ? '#28a745' : '#dc3545';
    };

    const getDistanceColor = (distance, radius) => {
        const effectiveRadius = radius || roomRadius || 100;
        if (distance <= effectiveRadius * 0.5) return '#28a745';
        if (distance <= effectiveRadius) return '#ffc107';
        return '#dc3545';
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Event Attendance" size="large">
            <h3 style={{ color: '#667eea', marginBottom: '15px' }}>{eventTitle}</h3>

            <div style={{
                background: '#f8f9fa',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '15px'
            }}>
                <div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Total Marked</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                        {stats.total || 0}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Present</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                        {stats.present || 0} ({stats.presentPercentage || 0}%)
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Absent</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                        {stats.absent || 0} ({stats.absentPercentage || 0}%)
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Room Radius</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                        {roomRadius || 100}m
                    </div>
                </div>
            </div>

            {attendanceList.length > 0 ? (
                <>
                    <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4>Attendance Records</h4>
                        <button onClick={exportToCSV} className="btn btn-success" style={{ padding: '8px 16px' }}>
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
                                    <th>Marked At</th>
                                    <th>Distance (m)</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceList.map((att, index) => (
                                    <tr key={att.userId} style={{
                                        background: att.status === 'absent' ? '#ffe6e6' : 'transparent'
                                    }}>
                                        <td>{index + 1}</td>
                                        <td style={{ fontWeight: '600' }}>{att.userName}</td>
                                        <td>{att.userUSN}</td>
                                        <td>{att.userEmail}</td>
                                        <td>{att.userDepartment}</td>
                                        <td>{new Date(att.timestamp).toLocaleString('en-IN')}</td>
                                        <td style={{
                                            fontWeight: '600',
                                            color: getDistanceColor(att.distance, att.roomRadius)
                                        }}>
                                            {att.distance || 'N/A'}m
                                        </td>
                                        <td>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                background: att.status === 'present' ? '#d4edda' : '#f8d7da',
                                                color: att.status === 'present' ? '#155724' : '#721c24'
                                            }}>
                                                {att.status === 'present' ? '✓ Present' : '✗ Absent'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{
                        marginTop: '15px',
                        padding: '12px',
                        background: '#e3f2fd',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#1976d2'
                    }}>
                        <strong>Legend:</strong>
                        <div style={{ marginTop: '8px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            <span>
                                <span style={{ color: '#28a745' }}>● Green:</span> Within 50% of radius
                            </span>
                            <span>
                                <span style={{ color: '#ffc107' }}>● Yellow:</span> Within radius
                            </span>
                            <span>
                                <span style={{ color: '#dc3545' }}>● Red:</span> Outside radius (Marked Absent)
                            </span>
                        </div>
                    </div>
                </>
            ) : (
                <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <h3>No Attendance Marked</h3>
                    <p>No students have marked attendance for this event yet</p>
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

export default ViewAttendanceModal;