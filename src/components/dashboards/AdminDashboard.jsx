// // ============================================
// // src/components/dashboards/AdminDashboard.jsx - UPDATED WITH VIEW CREDENTIALS
// // ============================================
// import React, { useState, useEffect } from 'react';
// import { ref, onValue } from 'firebase/database';
// import { database } from '../../config/firebase';
// import Header from '../common/Header';
// import StatCard from '../common/StatCard';
// import Tabs from '../common/Tabs';
// import Table from '../common/Table';
// import EventCard from '../common/EventCard';
// import Modal from '../common/Modal';
// import CreateUserModal from '../modals/CreateUserModal';
// import CreateRoomModal from '../modals/CreateRoomModal';
// import ViewFeedbackModal from '../modals/ViewFeedbackModal';
// import { updateEventStatus } from '../../services/eventService';
// import { formatDate } from '../../utils/helpers';
// import { EVENT_STATUS } from '../../utils/constants';

// const AdminDashboard = ({ user, onLogout }) => {
//     const [activeTab, setActiveTab] = useState('overview');
//     const [users, setUsers] = useState({});
//     const [events, setEvents] = useState({});
//     const [rooms, setRooms] = useState({});
//     const [institutions, setInstitutions] = useState({});
//     const [showUserModal, setShowUserModal] = useState(false);
//     const [showRoomModal, setShowRoomModal] = useState(false);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//     const [showCredentialsModal, setShowCredentialsModal] = useState(false);
//     const [selectedUser, setSelectedUser] = useState(null);

//     useEffect(() => {
//         const usersRef = ref(database, 'users');
//         const eventsRef = ref(database, 'events');
//         const roomsRef = ref(database, 'rooms');
//         const institutionsRef = ref(database, 'institutions');

//         const unsubUsers = onValue(usersRef, (snapshot) => {
//             setUsers(snapshot.val() || {});
//         });

//         const unsubEvents = onValue(eventsRef, (snapshot) => {
//             setEvents(snapshot.val() || {});
//         });

//         const unsubRooms = onValue(roomsRef, (snapshot) => {
//             setRooms(snapshot.val() || {});
//         });

//         const unsubInstitutions = onValue(institutionsRef, (snapshot) => {
//             setInstitutions(snapshot.val() || {});
//         });

//         return () => {
//             unsubUsers();
//             unsubEvents();
//             unsubRooms();
//             unsubInstitutions();
//         };
//     }, []);

//     const institutionUsers = Object.entries(users).filter(
//         ([id, u]) => u.institutionId === user.institutionId
//     );

//     const institutionEvents = Object.entries(events).filter(
//         ([id, e]) => e.institutionId === user.institutionId
//     );

//     const institutionRooms = Object.entries(rooms).filter(
//         ([id, r]) => r.institutionId === user.institutionId
//     );

//     const pendingEvents = institutionEvents.filter(
//         ([id, e]) => e.status === EVENT_STATUS.PENDING_ADMIN
//     );

//     const approveEvent = async (eventId) => {
//         await updateEventStatus(eventId, EVENT_STATUS.APPROVED, user.id);
//     };

//     const rejectEvent = async (eventId) => {
//         const reason = prompt('Reason for rejection:');
//         if (reason) {
//             await updateEventStatus(eventId, EVENT_STATUS.REJECTED_BY_ADMIN, user.id, reason);
//         }
//     };

//     const viewFeedback = (event) => {
//         setSelectedEvent(event);
//         setShowFeedbackModal(true);
//     };

//     const viewUserCredentials = (userId, userData) => {
//         setSelectedUser({ id: userId, ...userData });
//         setShowCredentialsModal(true);
//     };

//     const copyToClipboard = (text) => {
//         navigator.clipboard.writeText(text);
//         alert('Copied to clipboard!');
//     };

//     const getRoleColor = (role) => {
//         const colors = {
//             student: '#667eea',
//             faculty: '#28a745',
//             hod: '#ffc107',
//             principal: '#dc3545',
//             admin: '#17a2b8'
//         };
//         return colors[role] || '#667eea';
//     };

//     const userColumns = [
//         { header: 'Name', accessor: 'name' },
//         { header: 'Email', accessor: 'email' },
//         {
//             header: 'Role',
//             render: (row) => <span className="badge badge-primary">{row.role}</span>
//         },
//         { header: 'Department', accessor: 'department' },
//         { header: 'USN', accessor: 'usn' },
//         {
//             header: 'Actions',
//             render: (row) => (
//                 <button
//                     onClick={() => viewUserCredentials(row.id, row)}
//                     className="btn btn-info"
//                     style={{ padding: '6px 12px', fontSize: '13px' }}
//                 >
//                     View Credentials
//                 </button>
//             )
//         }
//     ];

//     const roomColumns = [
//         { header: 'Room Name', accessor: 'name' },
//         { header: 'Capacity', accessor: 'capacity' },
//         {
//             header: 'Location',
//             render: (row) => `${row.latitude}, ${row.longitude}`
//         }
//     ];

//     const tabs = [
//         { id: 'overview', label: 'Overview' },
//         { id: 'users', label: 'Users' },
//         { id: 'events', label: 'Events' },
//         { id: 'rooms', label: 'Rooms' },
//         { id: 'approvals', label: `Approvals (${pendingEvents.length})` }
//     ];

//     return (
//         <div className="app-container">
//             <div className="dashboard">
//                 <Header title="Admin Dashboard" user={user} onLogout={onLogout} />

//                 <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

//                 {activeTab === 'overview' && (
//                     <div className="dashboard-content">
//                         <StatCard
//                             title="Total Users"
//                             value={institutionUsers.length}
//                             color="primary"
//                         />
//                         <StatCard
//                             title="Total Events"
//                             value={institutionEvents.length}
//                             color="success"
//                         />
//                         <StatCard
//                             title="Pending Approvals"
//                             value={pendingEvents.length}
//                             color="warning"
//                         />
//                         <StatCard
//                             title="Meeting Rooms"
//                             value={institutionRooms.length}
//                             color="info"
//                         />
//                     </div>
//                 )}

//                 {activeTab === 'users' && (
//                     <div className="card">
//                         <div className="card-header">
//                             <h3 className="card-title">User Management</h3>
//                             <button onClick={() => setShowUserModal(true)} className="btn btn-primary">
//                                 + Add User
//                             </button>
//                         </div>
//                         <Table
//                             columns={userColumns}
//                             data={institutionUsers.map(([id, u]) => ({ id, ...u }))}
//                         />
//                     </div>
//                 )}

//                 {activeTab === 'rooms' && (
//                     <div className="card">
//                         <div className="card-header">
//                             <h3 className="card-title">Room Management</h3>
//                             <button onClick={() => setShowRoomModal(true)} className="btn btn-primary">
//                                 + Add Room
//                             </button>
//                         </div>
//                         <Table
//                             columns={roomColumns}
//                             data={institutionRooms.map(([id, r]) => ({ id, ...r }))}
//                         />
//                     </div>
//                 )}

//                 {activeTab === 'events' && (
//                     <div className="card">
//                         <h3>All Events</h3>
//                         <div className="event-list">
//                             {institutionEvents.map(([id, event]) => (
//                                 <EventCard
//                                     key={id}
//                                     event={event}
//                                     actions={
//                                         <button
//                                             onClick={() => viewFeedback({ id, ...event })}
//                                             className="btn btn-info"
//                                         >
//                                             View Feedback
//                                         </button>
//                                     }
//                                 />
//                             ))}
//                             {institutionEvents.length === 0 && (
//                                 <p style={{ textAlign: 'center', color: '#999' }}>No events yet</p>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {activeTab === 'approvals' && (
//                     <div className="card">
//                         <h3>Pending Event Approvals</h3>
//                         <div className="event-list">
//                             {pendingEvents.map(([id, event]) => (
//                                 <EventCard
//                                     key={id}
//                                     event={event}
//                                     showStatus={false}
//                                     actions={
//                                         <>
//                                             <button onClick={() => approveEvent(id)} className="btn btn-success">
//                                                 ✓ Approve
//                                             </button>
//                                             <button onClick={() => rejectEvent(id)} className="btn btn-danger">
//                                                 ✗ Reject
//                                             </button>
//                                         </>
//                                     }
//                                 />
//                             ))}
//                             {pendingEvents.length === 0 && (
//                                 <p style={{ textAlign: 'center', color: '#999' }}>No pending approvals</p>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 <CreateUserModal
//                     isOpen={showUserModal}
//                     onClose={() => setShowUserModal(false)}
//                     onSuccess={() => setShowUserModal(false)}
//                     institutionId={user.institutionId}
//                 />

//                 <CreateRoomModal
//                     isOpen={showRoomModal}
//                     onClose={() => setShowRoomModal(false)}
//                     onSuccess={() => setShowRoomModal(false)}
//                     institutionId={user.institutionId}
//                 />

//                 {selectedEvent && (
//                     <ViewFeedbackModal
//                         isOpen={showFeedbackModal}
//                         onClose={() => {
//                             setShowFeedbackModal(false);
//                             setSelectedEvent(null);
//                         }}
//                         eventId={selectedEvent.id}
//                         eventTitle={selectedEvent.title}
//                     />
//                 )}

//                 {/* User Credentials Modal */}
//                 {selectedUser && (
//                     <Modal
//                         isOpen={showCredentialsModal}
//                         onClose={() => {
//                             setShowCredentialsModal(false);
//                             setSelectedUser(null);
//                         }}
//                         title="User Credentials"
//                         size="large"
//                     >
//                         <div style={{
//                             background: `linear-gradient(135deg, ${getRoleColor(selectedUser.role)} 0%, ${getRoleColor(selectedUser.role)}dd 100%)`,
//                             color: 'white',
//                             padding: '20px',
//                             borderRadius: '10px',
//                             marginBottom: '20px',
//                             textAlign: 'center'
//                         }}>
//                             <h3 style={{ marginBottom: '10px', fontSize: '20px' }}>
//                                 {selectedUser.role.toUpperCase()}
//                             </h3>
//                             <p style={{ fontSize: '18px' }}>{selectedUser.name}</p>
//                         </div>

//                         <div style={{
//                             background: '#f8f9fa',
//                             padding: '20px',
//                             borderRadius: '10px',
//                             marginBottom: '15px'
//                         }}>
//                             <h4 style={{ color: '#667eea', marginBottom: '15px' }}>User Details</h4>

//                             <div style={{ marginBottom: '10px' }}>
//                                 <strong>Name:</strong> {selectedUser.name}
//                             </div>

//                             <div style={{ marginBottom: '10px' }}>
//                                 <strong>Role:</strong> {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
//                             </div>

//                             <div style={{ marginBottom: '10px' }}>
//                                 <strong>Department:</strong> {selectedUser.department || 'N/A'}
//                             </div>

//                             {selectedUser.usn && (
//                                 <div style={{ marginBottom: '10px' }}>
//                                     <strong>USN:</strong> {selectedUser.usn}
//                                 </div>
//                             )}

//                             {selectedUser.wallet !== undefined && (
//                                 <div style={{ marginBottom: '10px' }}>
//                                     <strong>Wallet Balance:</strong> ₹{selectedUser.wallet}
//                                 </div>
//                             )}
//                         </div>

//                         <div style={{
//                             background: '#fff3cd',
//                             border: '2px solid #ffc107',
//                             padding: '20px',
//                             borderRadius: '10px'
//                         }}>
//                             <h4 style={{ color: '#856404', marginBottom: '15px' }}>
//                                 Login Credentials
//                             </h4>

//                             <div style={{ marginBottom: '15px' }}>
//                                 <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
//                                     Email:
//                                 </label>
//                                 <div style={{
//                                     background: 'white',
//                                     padding: '10px',
//                                     borderRadius: '5px',
//                                     border: '1px solid #ddd',
//                                     display: 'flex',
//                                     justifyContent: 'space-between',
//                                     alignItems: 'center'
//                                 }}>
//                                     <span>{selectedUser.email}</span>
//                                     <button
//                                         onClick={() => copyToClipboard(selectedUser.email)}
//                                         className="btn btn-secondary"
//                                         style={{ padding: '5px 15px', fontSize: '12px' }}
//                                     >
//                                         Copy
//                                     </button>
//                                 </div>
//                             </div>

//                             <div style={{ marginBottom: '15px' }}>
//                                 <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
//                                     Password:
//                                 </label>
//                                 <div style={{
//                                     background: 'white',
//                                     padding: '10px',
//                                     borderRadius: '5px',
//                                     border: '1px solid #ddd',
//                                     display: 'flex',
//                                     justifyContent: 'space-between',
//                                     alignItems: 'center'
//                                 }}>
//                                     <code style={{ fontSize: '16px', fontWeight: 'bold' }}>
//                                         {selectedUser.password}
//                                     </code>
//                                     <button
//                                         onClick={() => copyToClipboard(selectedUser.password)}
//                                         className="btn btn-secondary"
//                                         style={{ padding: '5px 15px', fontSize: '12px' }}
//                                     >
//                                         Copy
//                                     </button>
//                                 </div>
//                             </div>

//                             <div style={{ marginBottom: '15px' }}>
//                                 <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
//                                     Institution:
//                                 </label>
//                                 <div style={{
//                                     background: 'white',
//                                     padding: '10px',
//                                     borderRadius: '5px',
//                                     border: '1px solid #ddd'
//                                 }}>
//                                     {institutions[user.institutionId]?.name || 'Current Institution'}
//                                 </div>
//                             </div>

//                             <div className="message message-info" style={{ marginTop: '15px' }}>
//                                 <strong>Note:</strong>
//                                 <ul style={{ marginTop: '10px', paddingLeft: '20px', fontSize: '14px' }}>
//                                     <li>User must select their institution during login</li>
//                                     <li>If password was changed, it shows the current password</li>
//                                     <li>Keep credentials secure</li>
//                                 </ul>
//                             </div>
//                         </div>

//                         <div className="modal-footer" style={{ marginTop: '20px' }}>
//                             <button
//                                 onClick={() => {
//                                     const text = `Login Credentials for ${selectedUser.name}\n\n` +
//                                         `Role: ${selectedUser.role.toUpperCase()}\n` +
//                                         `Email: ${selectedUser.email}\n` +
//                                         `Password: ${selectedUser.password}\n` +
//                                         `Institution: ${institutions[user.institutionId]?.name || 'Current Institution'}\n` +
//                                         (selectedUser.usn ? `USN: ${selectedUser.usn}\n` : '') +
//                                         (selectedUser.wallet ? `Wallet: ₹${selectedUser.wallet}\n` : '');
//                                     copyToClipboard(text);
//                                 }}
//                                 className="btn btn-info"
//                             >
//                                 Copy All Details
//                             </button>
//                             <button
//                                 onClick={() => {
//                                     setShowCredentialsModal(false);
//                                     setSelectedUser(null);
//                                 }}
//                                 className="btn btn-primary"
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </Modal>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AdminDashboard;






import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../config/firebase';
import Header from '../common/Header';
import StatCard from '../common/StatCard';
import Tabs from '../common/Tabs';
import Table from '../common/Table';
import EventCard from '../common/EventCard';
import Modal from '../common/Modal';
import CreateUserModal from '../modals/CreateUserModal';
import CreateRoomModal from '../modals/CreateRoomModal';
import ViewFeedbackModal from '../modals/ViewFeedbackModal';
import ViewRegistrationsModal from '../modals/ViewRegistrationsModal';
import ViewAttendanceModal from '../modals/Viewattendancemodal';

const AdminDashboard = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('allevents');
    const [events, setEvents] = useState({});
    const [users, setUsers] = useState({});
    const [rooms, setRooms] = useState({});
    const [institutions, setInstitutions] = useState({});
    const [attendance, setAttendance] = useState({});
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);

    useEffect(() => {
        const eventsRef = ref(database, 'events');
        const usersRef = ref(database, 'users');
        const roomsRef = ref(database, 'rooms');
        const institutionsRef = ref(database, 'institutions');
        const attendanceRef = ref(database, 'attendance');

        const unsubEvents = onValue(eventsRef, (snapshot) => {
            setEvents(snapshot.val() || {});
        });

        const unsubUsers = onValue(usersRef, (snapshot) => {
            setUsers(snapshot.val() || {});
        });

        const unsubRooms = onValue(roomsRef, (snapshot) => {
            setRooms(snapshot.val() || {});
        });

        const unsubInstitutions = onValue(institutionsRef, (snapshot) => {
            setInstitutions(snapshot.val() || {});
        });

        const unsubAttendance = onValue(attendanceRef, (snapshot) => {
            setAttendance(snapshot.val() || {});
        });

        return () => {
            unsubEvents();
            unsubUsers();
            unsubRooms();
            unsubInstitutions();
            unsubAttendance();
        };
    }, []);

    // Filter by institution
    const institutionEvents = Object.entries(events).filter(
        ([id, e]) => e.institutionId === user.institutionId
    );
    const institutionUsers = Object.entries(users).filter(
        ([id, u]) => u.institutionId === user.institutionId
    );
    const institutionRooms = Object.entries(rooms).filter(
        ([id, r]) => r.institutionId === user.institutionId
    );

    const allEvents = institutionEvents;
    const allUsers = institutionUsers;
    const allRooms = institutionRooms;
    const approvedEvents = allEvents.filter(([id, e]) => e.status === 'approved');
    const pendingEvents = allEvents.filter(([id, e]) => e.status.includes('pending'));

    const getRegistrationCount = (eventId, event) => {
        if (!event.registrations) return 0;
        return Object.keys(event.registrations).length;
    };

    const viewUserCredentials = (userId, userData) => {
        setSelectedUser({ id: userId, ...userData });
        setShowCredentialsModal(true);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const getRoleColor = (role) => {
        const colors = {
            student: '#667eea',
            faculty: '#28a745',
            hod: '#ffc107',
            principal: '#dc3545',
            admin: '#17a2b8'
        };
        return colors[role] || '#667eea';
    };

    const getAttendanceCount = (eventId) => {
        if (!attendance[eventId]) return 0;
        return Object.keys(attendance[eventId]).length;
    };

    const getTotalRegistrations = () => {
        return allEvents.reduce((total, [id, event]) => {
            return total + getRegistrationCount(id, event);
        }, 0);
    };

    const getTotalAttendance = () => {
        return allEvents.reduce((total, [id]) => {
            return total + getAttendanceCount(id);
        }, 0);
    };

    const getTotalRevenue = () => {
        return allEvents.reduce((total, [id, event]) => {
            if (!event.registrations || !event.isPaid) return total;
            return total + Object.values(event.registrations).reduce((sum, reg) => sum + (reg.amountPaid || 0), 0);
        }, 0);
    };

    const getInstitutionStats = () => {
        const institutionMap = {};
        allEvents.forEach(([id, event]) => {
            const instId = event.institutionId;
            if (!institutionMap[instId]) {
                institutionMap[instId] = {
                    totalEvents: 0,
                    registrations: 0,
                    attendance: 0,
                    revenue: 0
                };
            }
            institutionMap[instId].totalEvents++;
            institutionMap[instId].registrations += getRegistrationCount(id, event);
            institutionMap[instId].attendance += getAttendanceCount(id);
            if (event.registrations && event.isPaid) {
                institutionMap[instId].revenue += Object.values(event.registrations).reduce((sum, reg) => sum + (reg.amountPaid || 0), 0);
            }
        });
        return institutionMap;
    };

    const viewRegistrations = (event) => {
        setSelectedEvent(event);
        setShowRegistrationsModal(true);
    };

    const viewAttendance = (event) => {
        setSelectedEvent(event);
        setShowAttendanceModal(true);
    };

    const viewFeedback = (event) => {
        setSelectedEvent(event);
        setShowFeedbackModal(true);
    };

    const userColumns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        {
            header: 'Role',
            render: (row) => <span className="badge badge-primary">{row.role}</span>
        },
        { header: 'Department', accessor: 'department' },
        { header: 'USN', accessor: 'usn' },
        {
            header: 'Actions',
            render: (row) => (
                <button
                    onClick={() => viewUserCredentials(row.id, row)}
                    className="btn btn-info"
                    style={{ padding: '6px 12px', fontSize: '13px' }}
                >
                    View Credentials
                </button>
            )
        }
    ];

    const roomColumns = [
        { header: 'Room Name', accessor: 'name' },
        { header: 'Capacity', accessor: 'capacity' },
        {
            header: 'Radius (m)',
            render: (row) => row.radius || 100
        },
        {
            header: 'Location',
            render: (row) => `${row.latitude}, ${row.longitude}`
        }
    ];

    const tabs = [
        { id: 'allevents', label: `All Events (${allEvents.length})` },
        { id: 'approved', label: `Approved (${approvedEvents.length})` },
        { id: 'pending', label: `Pending (${pendingEvents.length})` },
        { id: 'users', label: `Users (${allUsers.length})` },
        { id: 'rooms', label: `Rooms (${allRooms.length})` },
        { id: 'analytics', label: 'System Analytics' }
    ];

    return (
        <div className="app-container">
            <div className="dashboard">
                <Header title="Admin Dashboard" user={user} onLogout={onLogout} />

                <div className="dashboard-content">
                    <StatCard
                        title="Total Events"
                        value={allEvents.length}
                        icon="📅"
                        color="primary"
                    />
                    <StatCard
                        title="Total Registrations"
                        value={getTotalRegistrations()}
                        icon="👥"
                        color="info"
                    />
                    <StatCard
                        title="Total Attendance"
                        value={getTotalAttendance()}
                        icon="📋"
                        color="success"
                    />
                    <StatCard
                        title="Total Revenue"
                        value={`₹${getTotalRevenue()}`}
                        icon="💰"
                        color="warning"
                    />
                </div>

                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                {activeTab === 'allevents' && (
                    <div className="card">
                        <h3>All Events - {institutions[user.institutionId]?.name || 'Your Institution'}</h3>
                        <div className="message message-info" style={{ marginBottom: '20px' }}>
                            📊 Institution: {getTotalRegistrations()} registrations | {getTotalAttendance()} attendance | ₹{getTotalRevenue()} revenue
                        </div>
                        <div className="event-list">
                            {allEvents.map(([id, event]) => {
                                const regCount = getRegistrationCount(id, event);
                                const attCount = getAttendanceCount(id);

                                return (
                                    <EventCard
                                        key={id}
                                        event={event}
                                        actions={
                                            <>
                                                <button
                                                    onClick={() => viewRegistrations({ id, ...event })}
                                                    className="btn btn-info"
                                                >
                                                    👥 Registrations ({regCount})
                                                </button>
                                                <button
                                                    onClick={() => viewAttendance({ id, ...event })}
                                                    className="btn btn-success"
                                                >
                                                    📋 Attendance ({attCount})
                                                </button>
                                                <button
                                                    onClick={() => viewFeedback({ id, ...event })}
                                                    className="btn btn-warning"
                                                >
                                                    ⭐ Feedback
                                                </button>
                                            </>
                                        }
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'approved' && (
                    <div className="card">
                        <h3>Approved Events</h3>
                        <div className="event-list">
                            {approvedEvents.map(([id, event]) => {
                                const regCount = getRegistrationCount(id, event);
                                const attCount = getAttendanceCount(id);

                                return (
                                    <EventCard
                                        key={id}
                                        event={event}
                                        showStatus={false}
                                        actions={
                                            <>
                                                <button
                                                    onClick={() => viewRegistrations({ id, ...event })}
                                                    className="btn btn-info"
                                                >
                                                    👥 Registrations ({regCount})
                                                </button>
                                                <button
                                                    onClick={() => viewAttendance({ id, ...event })}
                                                    className="btn btn-success"
                                                >
                                                    📋 Attendance ({attCount})
                                                </button>
                                                <button
                                                    onClick={() => viewFeedback({ id, ...event })}
                                                    className="btn btn-warning"
                                                >
                                                    ⭐ Feedback
                                                </button>
                                            </>
                                        }
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'pending' && (
                    <div className="card">
                        <h3>Pending Events</h3>
                        <div className="event-list">
                            {pendingEvents.map(([id, event]) => {
                                const regCount = getRegistrationCount(id, event);

                                return (
                                    <EventCard
                                        key={id}
                                        event={event}
                                        actions={
                                            regCount > 0 && (
                                                <button
                                                    onClick={() => viewRegistrations({ id, ...event })}
                                                    className="btn btn-info"
                                                >
                                                    👥 Registrations ({regCount})
                                                </button>
                                            )
                                        }
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">User Management - {institutions[user.institutionId]?.name || 'Your Institution'}</h3>
                            <button onClick={() => setShowUserModal(true)} className="btn btn-primary">
                                + Add User
                            </button>
                        </div>
                        <Table
                            columns={userColumns}
                            data={allUsers.map(([id, u]) => ({ id, ...u }))}
                        />
                    </div>
                )}

                {activeTab === 'rooms' && (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Room Management - {institutions[user.institutionId]?.name || 'Your Institution'}</h3>
                            <button onClick={() => setShowRoomModal(true)} className="btn btn-primary">
                                + Add Room
                            </button>
                        </div>
                        <Table
                            columns={roomColumns}
                            data={allRooms.map(([id, r]) => ({ id, ...r }))}
                        />
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="card">
                        <h3>Analytics - {institutions[user.institutionId]?.name || 'Your Institution'}</h3>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '20px',
                            marginBottom: '30px'
                        }}>
                            <div className="stat-card stat-card-primary">
                                <div className="stat-icon">📅</div>
                                <div className="stat-content">
                                    <div className="stat-label">Total Events</div>
                                    <div className="stat-value">{allEvents.length}</div>
                                </div>
                            </div>

                            <div className="stat-card stat-card-success">
                                <div className="stat-icon">✓</div>
                                <div className="stat-content">
                                    <div className="stat-label">Approved</div>
                                    <div className="stat-value">{approvedEvents.length}</div>
                                </div>
                            </div>

                            <div className="stat-card stat-card-warning">
                                <div className="stat-icon">⏳</div>
                                <div className="stat-content">
                                    <div className="stat-label">Pending</div>
                                    <div className="stat-value">{pendingEvents.length}</div>
                                </div>
                            </div>

                            <div className="stat-card stat-card-info">
                                <div className="stat-icon">👥</div>
                                <div className="stat-content">
                                    <div className="stat-label">Registrations</div>
                                    <div className="stat-value">{getTotalRegistrations()}</div>
                                </div>
                            </div>

                            <div className="stat-card stat-card-success">
                                <div className="stat-icon">📋</div>
                                <div className="stat-content">
                                    <div className="stat-label">Attendance</div>
                                    <div className="stat-value">{getTotalAttendance()}</div>
                                </div>
                            </div>

                            <div className="stat-card stat-card-warning">
                                <div className="stat-icon">💰</div>
                                <div className="stat-content">
                                    <div className="stat-label">Revenue</div>
                                    <div className="stat-value">₹{getTotalRevenue()}</div>
                                </div>
                            </div>

                            <div className="stat-card stat-card-primary">
                                <div className="stat-icon">📊</div>
                                <div className="stat-content">
                                    <div className="stat-label">Avg Attendance</div>
                                    <div className="stat-value">
                                        {getTotalRegistrations() > 0
                                            ? Math.round((getTotalAttendance() / getTotalRegistrations()) * 100)
                                            : 0}%
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card stat-card-info">
                                <div className="stat-icon">👥</div>
                                <div className="stat-content">
                                    <div className="stat-label">Total Users</div>
                                    <div className="stat-value">{allUsers.length}</div>
                                </div>
                            </div>

                            <div className="stat-card stat-card-primary">
                                <div className="stat-icon">🚪</div>
                                <div className="stat-content">
                                    <div className="stat-label">Meeting Rooms</div>
                                    <div className="stat-value">{allRooms.length}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            background: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            marginBottom: '20px'
                        }}>
                            <h4 style={{ marginBottom: '15px' }}>Event Type Distribution</h4>
                            <div style={{ display: 'grid', gap: '10px' }}>
                                {['Seminar', 'Workshop', 'Hackathon', 'Competition', 'Cultural', 'Sports'].map(type => {
                                    const count = allEvents.filter(([id, e]) => e.eventType === type).length;
                                    const percentage = allEvents.length > 0 ? Math.round((count / allEvents.length) * 100) : 0;
                                    return (
                                        <div key={type} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '10px',
                                            background: 'white',
                                            borderRadius: '6px'
                                        }}>
                                            <span style={{ fontWeight: '600' }}>{type}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{
                                                    width: '100px',
                                                    height: '8px',
                                                    background: '#e0e0e0',
                                                    borderRadius: '4px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <div style={{
                                                        width: `${percentage}%`,
                                                        height: '100%',
                                                        background: '#667eea',
                                                        transition: 'width 0.3s'
                                                    }}></div>
                                                </div>
                                                <span style={{
                                                    background: '#667eea',
                                                    color: 'white',
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    minWidth: '45px',
                                                    textAlign: 'center'
                                                }}>{count}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{
                            background: '#e3f2fd',
                            padding: '20px',
                            borderRadius: '8px'
                        }}>
                            <h4 style={{ marginBottom: '15px', color: '#1976d2' }}>Top Performing Events</h4>
                            <div style={{ display: 'grid', gap: '10px' }}>
                                {approvedEvents
                                    .sort((a, b) => getRegistrationCount(b[0], b[1]) - getRegistrationCount(a[0], a[1]))
                                    .slice(0, 5)
                                    .map(([id, event]) => {
                                        const regCount = getRegistrationCount(id, event);
                                        const attCount = getAttendanceCount(id);
                                        const attRate = regCount > 0 ? Math.round((attCount / regCount) * 100) : 0;
                                        return (
                                            <div key={id} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '12px',
                                                background: 'white',
                                                borderRadius: '6px'
                                            }}>
                                                <div>
                                                    <div style={{ fontWeight: '600' }}>{event.title}</div>
                                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                                        {event.eventType} | {event.institutionId}
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '14px', fontWeight: '600' }}>
                                                        {regCount} registered
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                                        {attCount} attended ({attRate}%)
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                )}

                {selectedEvent && (
                    <>
                        <ViewFeedbackModal
                            isOpen={showFeedbackModal}
                            onClose={() => {
                                setShowFeedbackModal(false);
                                setSelectedEvent(null);
                            }}
                            eventId={selectedEvent.id}
                            eventTitle={selectedEvent.title}
                        />

                        <ViewRegistrationsModal
                            isOpen={showRegistrationsModal}
                            onClose={() => {
                                setShowRegistrationsModal(false);
                                setSelectedEvent(null);
                            }}
                            event={selectedEvent}
                            users={users}
                        />

                        <ViewAttendanceModal
                            isOpen={showAttendanceModal}
                            onClose={() => {
                                setShowAttendanceModal(false);
                                setSelectedEvent(null);
                            }}
                            eventId={selectedEvent.id}
                            eventTitle={selectedEvent.title}
                            attendance={attendance[selectedEvent.id] || {}}
                            users={users}
                        />
                    </>
                )}

                <CreateUserModal
                    isOpen={showUserModal}
                    onClose={() => setShowUserModal(false)}
                    onSuccess={() => setShowUserModal(false)}
                    institutionId={user.institutionId}
                />

                <CreateRoomModal
                    isOpen={showRoomModal}
                    onClose={() => setShowRoomModal(false)}
                    onSuccess={() => setShowRoomModal(false)}
                    institutionId={user.institutionId}
                />

                {selectedUser && (
                    <Modal
                        isOpen={showCredentialsModal}
                        onClose={() => {
                            setShowCredentialsModal(false);
                            setSelectedUser(null);
                        }}
                        title="User Credentials"
                        size="large"
                    >
                        <div style={{
                            background: `linear-gradient(135deg, ${getRoleColor(selectedUser.role)} 0%, ${getRoleColor(selectedUser.role)}dd 100%)`,
                            color: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            marginBottom: '20px',
                            textAlign: 'center'
                        }}>
                            <h3 style={{ marginBottom: '10px', fontSize: '20px' }}>
                                {selectedUser.role.toUpperCase()}
                            </h3>
                            <p style={{ fontSize: '18px' }}>{selectedUser.name}</p>
                        </div>

                        <div style={{
                            background: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '10px',
                            marginBottom: '15px'
                        }}>
                            <h4 style={{ color: '#667eea', marginBottom: '15px' }}>User Details</h4>

                            <div style={{ marginBottom: '10px' }}>
                                <strong>Name:</strong> {selectedUser.name}
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <strong>Role:</strong> {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <strong>Department:</strong> {selectedUser.department || 'N/A'}
                            </div>

                            {selectedUser.usn && (
                                <div style={{ marginBottom: '10px' }}>
                                    <strong>USN:</strong> {selectedUser.usn}
                                </div>
                            )}

                            {selectedUser.wallet !== undefined && (
                                <div style={{ marginBottom: '10px' }}>
                                    <strong>Wallet Balance:</strong> ₹{selectedUser.wallet}
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
                                    <span>{selectedUser.email}</span>
                                    <button
                                        onClick={() => copyToClipboard(selectedUser.email)}
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
                                        {selectedUser.password}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(selectedUser.password)}
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
                                    {institutions[selectedUser.institutionId]?.name || selectedUser.institutionId}
                                </div>
                            </div>

                            <div className="message message-info" style={{ marginTop: '15px' }}>
                                <strong>Note:</strong>
                                <ul style={{ marginTop: '10px', paddingLeft: '20px', fontSize: '14px' }}>
                                    <li>User must select their institution during login</li>
                                    <li>If password was changed, it shows the current password</li>
                                    <li>Keep credentials secure</li>
                                </ul>
                            </div>
                        </div>

                        <div className="modal-footer" style={{ marginTop: '20px' }}>
                            <button
                                onClick={() => {
                                    const text = `Login Credentials for ${selectedUser.name}\n\n` +
                                        `Role: ${selectedUser.role.toUpperCase()}\n` +
                                        `Email: ${selectedUser.email}\n` +
                                        `Password: ${selectedUser.password}\n` +
                                        `Institution: ${institutions[selectedUser.institutionId]?.name || selectedUser.institutionId}\n` +
                                        (selectedUser.usn ? `USN: ${selectedUser.usn}\n` : '') +
                                        (selectedUser.wallet !== undefined ? `Wallet: ₹${selectedUser.wallet}\n` : '');
                                    copyToClipboard(text);
                                }}
                                className="btn btn-info"
                            >
                                Copy All Details
                            </button>
                            <button
                                onClick={() => {
                                    setShowCredentialsModal(false);
                                    setSelectedUser(null);
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

export default AdminDashboard;