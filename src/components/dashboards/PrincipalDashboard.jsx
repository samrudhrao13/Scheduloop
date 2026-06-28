// import React, { useState, useEffect } from 'react';
// import { ref, onValue } from 'firebase/database';
// import { database } from '../../config/firebase';
// import Header from '../common/Header';
// import StatCard from '../common/StatCard';
// import Tabs from '../common/Tabs';
// import EventCard from '../common/EventCard';
// import CreateEventModal from '../modals/CreateEventModal';
// import ViewFeedbackModal from '../modals/ViewFeedbackModal';
// import { updateEventStatus } from '../../services/eventService';
// import { EVENT_STATUS } from '../../utils/constants';

// const PrincipalDashboard = ({ user, onLogout }) => {
//     const [activeTab, setActiveTab] = useState('approvals');
//     const [events, setEvents] = useState({});
//     const [showEventModal, setShowEventModal] = useState(false);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [showFeedbackModal, setShowFeedbackModal] = useState(false);

//     useEffect(() => {
//         const eventsRef = ref(database, 'events');
//         const unsubEvents = onValue(eventsRef, (snapshot) => {
//             setEvents(snapshot.val() || {});
//         });
//         return () => unsubEvents();
//     }, []);

//     const institutionEvents = Object.entries(events).filter(
//         ([id, e]) => e.institutionId === user.institutionId
//     );

//     const pendingEvents = institutionEvents.filter(
//         ([id, e]) => e.status === EVENT_STATUS.PENDING_PRINCIPAL
//     );

//     const myEvents = institutionEvents.filter(
//         ([id, e]) => e.createdBy === user.id
//     );

//     const approveEvent = async (eventId) => {
//         await updateEventStatus(eventId, EVENT_STATUS.PENDING_ADMIN, user.id);
//     };

//     const rejectEvent = async (eventId) => {
//         const reason = prompt('Reason for rejection:');
//         if (reason) {
//             await updateEventStatus(eventId, EVENT_STATUS.REJECTED_BY_PRINCIPAL, user.id, reason);
//         }
//     };

//     const viewFeedback = (event) => {
//         setSelectedEvent(event);
//         setShowFeedbackModal(true);
//     };

//     const tabs = [
//         { id: 'approvals', label: `Approvals (${pendingEvents.length})` },
//         { id: 'myevents', label: 'My Events' },
//         { id: 'allevents', label: 'All Events' }
//     ];

//     return (
//         <div className="app-container">
//             <div className="dashboard">
//                 <Header title="Principal Dashboard" user={user} onLogout={onLogout} />

//                 <div className="dashboard-content">
//                     <StatCard
//                         title="Pending Approvals"
//                         value={pendingEvents.length}
//                         icon="⏳"
//                         color="warning"
//                     />
//                     <StatCard
//                         title="My Events"
//                         value={myEvents.length}
//                         icon="📅"
//                         color="primary"
//                     />
//                     <StatCard
//                         title="Total Events"
//                         value={institutionEvents.length}
//                         icon="🎯"
//                         color="success"
//                     />
//                 </div>

//                 <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

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

//                 {activeTab === 'myevents' && (
//                     <div className="card">
//                         <div className="card-header">
//                             <h3 className="card-title">My Events</h3>
//                             <button onClick={() => setShowEventModal(true)} className="btn btn-primary">
//                                 + Create Event
//                             </button>
//                         </div>
//                         <div className="event-list">
//                             {myEvents.map(([id, event]) => (
//                                 <EventCard
//                                     key={id}
//                                     event={event}
//                                     actions={
//                                         <button onClick={() => viewFeedback({ id, ...event })} className="btn btn-info">
//                                             View Feedback
//                                         </button>
//                                     }
//                                 />
//                             ))}
//                             {myEvents.length === 0 && (
//                                 <p style={{ textAlign: 'center', color: '#999' }}>No events created yet</p>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {activeTab === 'allevents' && (
//                     <div className="card">
//                         <h3>All Institution Events</h3>
//                         <div className="event-list">
//                             {institutionEvents.map(([id, event]) => (
//                                 <EventCard key={id} event={event} />
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 <CreateEventModal
//                     isOpen={showEventModal}
//                     onClose={() => setShowEventModal(false)}
//                     onSuccess={() => setShowEventModal(false)}
//                     institutionId={user.institutionId}
//                     creatorId={user.id}
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
//             </div>
//         </div>
//     );
// };

// export default PrincipalDashboard;






import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../config/firebase';
import Header from '../common/Header';
import StatCard from '../common/StatCard';
import Tabs from '../common/Tabs';
import EventCard from '../common/EventCard';
import CreateEventModal from '../modals/CreateEventModal';
import ViewFeedbackModal from '../modals/ViewFeedbackModal';
import ViewRegistrationsModal from '../modals/Viewregistrationsmodal';
import ViewAttendanceModal from '../modals/Viewattendancemodal';
import ConfirmDialog from '../common/ConfirmDialog';
import { updateEventStatus, deleteEvent } from '../../services/eventService';
import { EVENT_STATUS } from '../../utils/constants';

const PrincipalDashboard = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('approvals');
    const [events, setEvents] = useState({});
    const [users, setUsers] = useState({});
    const [attendance, setAttendance] = useState({});
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);

    useEffect(() => {
        const eventsRef = ref(database, 'events');
        const usersRef = ref(database, 'users');
        const attendanceRef = ref(database, 'attendance');

        const unsubEvents = onValue(eventsRef, (snapshot) => {
            setEvents(snapshot.val() || {});
        });

        const unsubUsers = onValue(usersRef, (snapshot) => {
            setUsers(snapshot.val() || {});
        });

        const unsubAttendance = onValue(attendanceRef, (snapshot) => {
            setAttendance(snapshot.val() || {});
        });

        return () => {
            unsubEvents();
            unsubUsers();
            unsubAttendance();
        };
    }, []);

    const institutionEvents = Object.entries(events).filter(
        ([id, e]) => e.institutionId === user.institutionId
    );

    const pendingEvents = institutionEvents.filter(
        ([id, e]) => e.status === EVENT_STATUS.PENDING_PRINCIPAL
    );

    const approvedEvents = institutionEvents.filter(
        ([id, e]) => e.status === EVENT_STATUS.APPROVED
    );

    const myEvents = institutionEvents.filter(
        ([id, e]) => e.createdBy === user.id
    );

    const approveEvent = async (eventId) => {
        await updateEventStatus(eventId, EVENT_STATUS.APPROVED, user.id);
    };

    const rejectEvent = async (eventId) => {
        const reason = prompt('Reason for rejection:');
        if (reason) {
            await updateEventStatus(eventId, EVENT_STATUS.REJECTED_BY_PRINCIPAL, user.id, reason);
        }
    };

    const getRegistrationCount = (eventId, event) => {
        if (!event.registrations) return 0;
        return Object.keys(event.registrations).length;
    };

    const getAttendanceCount = (eventId) => {
        if (!attendance[eventId]) return 0;
        return Object.keys(attendance[eventId]).length;
    };

    const getTotalRegistrations = () => {
        return approvedEvents.reduce((total, [id, event]) => {
            return total + getRegistrationCount(id, event);
        }, 0);
    };

    const getTotalAttendance = () => {
        return approvedEvents.reduce((total, [id]) => {
            return total + getAttendanceCount(id);
        }, 0);
    };

    const getTotalRevenue = () => {
        return approvedEvents.reduce((total, [id, event]) => {
            if (!event.registrations || !event.isPaid) return total;
            return total + Object.values(event.registrations).reduce((sum, reg) => sum + (reg.amountPaid || 0), 0);
        }, 0);
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

    const handleDeleteEvent = (eventId, eventTitle, createdBy) => {
        // Only allow deletion of own events
        if (createdBy !== user.id) {
            alert('You can only delete events you created!');
            return;
        }
        setEventToDelete({ id: eventId, title: eventTitle });
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (!eventToDelete) return;

        const result = await deleteEvent(eventToDelete.id);

        if (result.success) {
            alert(`Event "${eventToDelete.title}" deleted successfully!`);
            setEventToDelete(null);
        } else {
            alert('Failed to delete event: ' + result.error);
        }
    };

    const tabs = [
        { id: 'approvals', label: `Approvals (${pendingEvents.length})` },
        { id: 'approved', label: `Approved (${approvedEvents.length})` },
        { id: 'myevents', label: 'My Events' },
        { id: 'analytics', label: 'Analytics' }
    ];

    return (
        <div className="app-container">
            <div className="dashboard">
                <Header title="Principal Dashboard" user={user} onLogout={onLogout} />

                <div className="dashboard-content">
                    <StatCard
                        title="Pending Approvals"
                        value={pendingEvents.length}
                        icon="⏳"
                        color="warning"
                    />
                    <StatCard
                        title="Total Events"
                        value={institutionEvents.length}
                        icon="📅"
                        color="primary"
                    />
                    <StatCard
                        title="Approved Events"
                        value={approvedEvents.length}
                        icon="✓"
                        color="success"
                    />
                    <StatCard
                        title="Total Revenue"
                        value={`₹${getTotalRevenue()}`}
                        icon="💰"
                        color="success"
                    />
                </div>

                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                {activeTab === 'approvals' && (
                    <div className="card">
                        <h3>Pending HOD Approvals</h3>
                        <div className="event-list">
                            {pendingEvents.map(([id, event]) => {
                                const regCount = getRegistrationCount(id, event);

                                return (
                                    <EventCard
                                        key={id}
                                        event={event}
                                        showStatus={false}
                                        actions={
                                            <>
                                                <button onClick={() => approveEvent(id)} className="btn btn-success">
                                                    ✓ Approve
                                                </button>
                                                <button onClick={() => rejectEvent(id)} className="btn btn-danger">
                                                    ✗ Reject
                                                </button>
                                                {regCount > 0 && (
                                                    <button
                                                        onClick={() => viewRegistrations({ id, ...event })}
                                                        className="btn btn-info"
                                                    >
                                                        👥 Registrations ({regCount})
                                                    </button>
                                                )}
                                            </>
                                        }
                                    />
                                );
                            })}
                            {pendingEvents.length === 0 && (
                                <p style={{ textAlign: 'center', color: '#999' }}>No pending approvals</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'approved' && (
                    <div className="card">
                        <h3>All Approved Events</h3>
                        <div className="message message-info" style={{ marginBottom: '20px' }}>
                            📊 Total Registrations: {getTotalRegistrations()} | Total Attendance: {getTotalAttendance()} | Revenue: ₹{getTotalRevenue()}
                        </div>
                        <div className="event-list">
                            {approvedEvents.map(([id, event]) => {
                                const regCount = getRegistrationCount(id, event);
                                const attCount = getAttendanceCount(id);
                                const isOwnEvent = event.createdBy === user.id;

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
                                                    👥 View Registrations ({regCount})
                                                </button>
                                                <button
                                                    onClick={() => viewAttendance({ id, ...event })}
                                                    className="btn btn-success"
                                                >
                                                    📋 View Attendance ({attCount})
                                                </button>
                                                <button
                                                    onClick={() => viewFeedback({ id, ...event })}
                                                    className="btn btn-warning"
                                                >
                                                    ⭐ View Feedback
                                                </button>
                                                {isOwnEvent && (
                                                    <button
                                                        onClick={() => handleDeleteEvent(id, event.title, event.createdBy)}
                                                        className="btn btn-danger"
                                                        style={{ marginTop: '5px' }}
                                                    >
                                                        🗑️ Delete Event
                                                    </button>
                                                )}
                                            </>
                                        }
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'myevents' && (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">My Events</h3>
                            <button onClick={() => setShowEventModal(true)} className="btn btn-primary">
                                + Create Event
                            </button>
                        </div>
                        <div className="event-list">
                            {myEvents.map(([id, event]) => {
                                const regCount = getRegistrationCount(id, event);
                                const attCount = getAttendanceCount(id);

                                return (
                                    <EventCard
                                        key={id}
                                        event={event}
                                        actions={
                                            <>
                                                {event.status === 'approved' && (
                                                    <>
                                                        <button
                                                            onClick={() => viewRegistrations({ id, ...event })}
                                                            className="btn btn-info"
                                                        >
                                                            👥 View Registrations ({regCount})
                                                        </button>
                                                        <button
                                                            onClick={() => viewAttendance({ id, ...event })}
                                                            className="btn btn-success"
                                                        >
                                                            📋 View Attendance ({attCount})
                                                        </button>
                                                        <button
                                                            onClick={() => viewFeedback({ id, ...event })}
                                                            className="btn btn-warning"
                                                        >
                                                            ⭐ View Feedback
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteEvent(id, event.title, event.createdBy)}
                                                    className="btn btn-danger"
                                                    style={{ marginTop: '5px' }}
                                                >
                                                    🗑️ Delete Event
                                                </button>
                                            </>
                                        }
                                    />
                                );
                            })}
                            {myEvents.length === 0 && (
                                <p style={{ textAlign: 'center', color: '#999' }}>No events created yet</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="card">
                        <h3>Institution-Wide Analytics</h3>

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
                                    <div className="stat-value">{institutionEvents.length}</div>
                                </div>
                            </div>

                            <div className="stat-card stat-card-success">
                                <div className="stat-icon">✓</div>
                                <div className="stat-content">
                                    <div className="stat-label">Approved Events</div>
                                    <div className="stat-value">{approvedEvents.length}</div>
                                </div>
                            </div>

                            <div className="stat-card stat-card-info">
                                <div className="stat-icon">👥</div>
                                <div className="stat-content">
                                    <div className="stat-label">Total Registrations</div>
                                    <div className="stat-value">{getTotalRegistrations()}</div>
                                </div>
                            </div>

                            <div className="stat-card stat-card-success">
                                <div className="stat-icon">📋</div>
                                <div className="stat-content">
                                    <div className="stat-label">Total Attendance</div>
                                    <div className="stat-value">{getTotalAttendance()}</div>
                                </div>
                            </div>

                            <div className="stat-card stat-card-warning">
                                <div className="stat-icon">💰</div>
                                <div className="stat-content">
                                    <div className="stat-label">Total Revenue</div>
                                    <div className="stat-value">₹{getTotalRevenue()}</div>
                                </div>
                            </div>

                            <div className="stat-card stat-card-primary">
                                <div className="stat-icon">📊</div>
                                <div className="stat-content">
                                    <div className="stat-label">Avg Attendance Rate</div>
                                    <div className="stat-value">
                                        {getTotalRegistrations() > 0
                                            ? Math.round((getTotalAttendance() / getTotalRegistrations()) * 100)
                                            : 0}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            background: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            marginBottom: '20px'
                        }}>
                            <h4 style={{ marginBottom: '15px' }}>Event Type Breakdown</h4>
                            <div style={{ display: 'grid', gap: '10px' }}>
                                {['Seminar', 'Workshop', 'Hackathon', 'Competition', 'Cultural', 'Sports'].map(type => {
                                    const count = approvedEvents.filter(([id, e]) => e.eventType === type).length;
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
                                            <span style={{
                                                background: '#667eea',
                                                color: 'white',
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                fontSize: '14px',
                                                fontWeight: '600'
                                            }}>{count}</span>
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
                            <h4 style={{ marginBottom: '15px', color: '#1976d2' }}>Recent Activity</h4>
                            <div style={{ display: 'grid', gap: '10px' }}>
                                {approvedEvents.slice(0, 5).map(([id, event]) => {
                                    const regCount = getRegistrationCount(id, event);
                                    const attCount = getAttendanceCount(id);
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
                                                <div style={{ fontSize: '12px', color: '#666' }}>{event.eventType}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                    {regCount} registrations | {attCount} attended
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                <CreateEventModal
                    isOpen={showEventModal}
                    onClose={() => setShowEventModal(false)}
                    onSuccess={() => setShowEventModal(false)}
                    institutionId={user.institutionId}
                    creatorId={user.id}
                />

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

                <ConfirmDialog
                    isOpen={showDeleteDialog}
                    onClose={() => {
                        setShowDeleteDialog(false);
                        setEventToDelete(null);
                    }}
                    onConfirm={confirmDelete}
                    title="Delete Event"
                    message={`Are you sure you want to delete "${eventToDelete?.title}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            </div>
        </div>
    );
};

export default PrincipalDashboard;