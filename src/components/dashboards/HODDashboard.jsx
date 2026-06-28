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

// const HODDashboard = ({ user, onLogout }) => {
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
//         ([id, e]) => e.status === EVENT_STATUS.PENDING_HOD
//     );

//     const myEvents = institutionEvents.filter(
//         ([id, e]) => e.createdBy === user.id
//     );

//     const approveEvent = async (eventId) => {
//         await updateEventStatus(eventId, EVENT_STATUS.PENDING_PRINCIPAL, user.id);
//     };

//     const rejectEvent = async (eventId) => {
//         const reason = prompt('Reason for rejection:');
//         if (reason) {
//             await updateEventStatus(eventId, EVENT_STATUS.REJECTED_BY_HOD, user.id, reason);
//         }
//     };

//     const viewFeedback = (event) => {
//         setSelectedEvent(event);
//         setShowFeedbackModal(true);
//     };

//     const tabs = [
//         { id: 'approvals', label: `Approvals (${pendingEvents.length})` },
//         { id: 'myevents', label: 'My Events' },
//         { id: 'department', label: 'Department Events' }
//     ];

//     const departmentEvents = institutionEvents.filter(
//         ([id, e]) => {
//             const creator = e.createdBy;
//             // You could filter by department if you have that data
//             return true; // For now, show all
//         }
//     );

//     return (
//         <div className="app-container">
//             <div className="dashboard">
//                 <Header title="HOD Dashboard" user={user} onLogout={onLogout} />

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
//                         title="Department Events"
//                         value={departmentEvents.length}
//                         icon="🎯"
//                         color="success"
//                     />
//                 </div>

//                 <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

//                 {activeTab === 'approvals' && (
//                     <div className="card">
//                         <h3>Pending Faculty Event Approvals</h3>
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

//                 {activeTab === 'department' && (
//                     <div className="card">
//                         <h3>Department Events</h3>
//                         <div className="event-list">
//                             {departmentEvents.map(([id, event]) => (
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

// export default HODDashboard;











import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../config/firebase';
import Header from '../common/Header';
import StatCard from '../common/StatCard';
import Tabs from '../common/Tabs';
import EventCard from '../common/EventCard';
import CreateEventModal from '../modals/CreateEventModal';
import ViewFeedbackModal from '../modals/ViewFeedbackModal';
import ViewRegistrationsModal from '../modals/ViewRegistrationsModal';
import ViewAttendanceModal from '../modals/Viewattendancemodal';
import ConfirmDialog from '../common/ConfirmDialog';
import { updateEventStatus, deleteEvent } from '../../services/eventService';
import { EVENT_STATUS } from '../../utils/constants';

const HODDashboard = ({ user, onLogout }) => {
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
        ([id, e]) => e.status === EVENT_STATUS.PENDING_HOD
    );

    const myEvents = institutionEvents.filter(
        ([id, e]) => e.createdBy === user.id
    );

    const approveEvent = async (eventId) => {
        await updateEventStatus(eventId, EVENT_STATUS.PENDING_PRINCIPAL, user.id);
    };

    const rejectEvent = async (eventId) => {
        const reason = prompt('Reason for rejection:');
        if (reason) {
            await updateEventStatus(eventId, EVENT_STATUS.REJECTED_BY_HOD, user.id, reason);
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
        { id: 'myevents', label: 'My Events' },
        { id: 'department', label: 'Department Events' }
    ];

    const departmentEvents = institutionEvents.filter(
        ([id, e]) => e.status === 'approved'
    );

    return (
        <div className="app-container">
            <div className="dashboard">
                <Header title="HOD Dashboard" user={user} onLogout={onLogout} />

                <div className="dashboard-content">
                    <StatCard
                        title="Pending Approvals"
                        value={pendingEvents.length}
                        icon="⏳"
                        color="warning"
                    />
                    <StatCard
                        title="My Events"
                        value={myEvents.length}
                        icon="📅"
                        color="primary"
                    />
                    <StatCard
                        title="Department Events"
                        value={departmentEvents.length}
                        icon="🎯"
                        color="success"
                    />
                </div>

                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                {activeTab === 'approvals' && (
                    <div className="card">
                        <h3>Pending Faculty Event Approvals</h3>
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
                                                )}
                                                <button
                                                    onClick={() => handleDeleteEvent(id, event.title, event.createdBy)}
                                                    className="btn btn-danger"
                                                    style={{ marginTop: '5px' }}
                                                >
                                                    🗑️ Delete
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

                {activeTab === 'department' && (
                    <div className="card">
                        <h3>Department Events</h3>
                        <div className="event-list">
                            {departmentEvents.map(([id, event]) => {
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
                                            </>
                                        }
                                    />
                                );
                            })}
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

export default HODDashboard;