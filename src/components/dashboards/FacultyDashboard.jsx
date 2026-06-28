// import React, { useState, useEffect } from 'react';
// import { ref, onValue } from 'firebase/database';
// import { database } from '../../config/firebase';
// import Header from '../common/Header';
// import StatCard from '../common/StatCard';
// import Tabs from '../common/Tabs';
// import EventCard from '../common/EventCard';
// import CreateEventModal from '../modals/CreateEventModal';
// import ViewFeedbackModal from '../modals/ViewFeedbackModal';

// const FacultyDashboard = ({ user, onLogout }) => {
//     const [activeTab, setActiveTab] = useState('myevents');
//     const [events, setEvents] = useState({});
//     const [attendance, setAttendance] = useState({});
//     const [showEventModal, setShowEventModal] = useState(false);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [showFeedbackModal, setShowFeedbackModal] = useState(false);

//     useEffect(() => {
//         const eventsRef = ref(database, 'events');
//         const attendanceRef = ref(database, 'attendance');

//         const unsubEvents = onValue(eventsRef, (snapshot) => {
//             setEvents(snapshot.val() || {});
//         });

//         const unsubAttendance = onValue(attendanceRef, (snapshot) => {
//             setAttendance(snapshot.val() || {});
//         });

//         return () => {
//             unsubEvents();
//             unsubAttendance();
//         };
//     }, []);

//     const myEvents = Object.entries(events).filter(
//         ([id, e]) => e.createdBy === user.id
//     );

//     const pendingEvents = myEvents.filter(
//         ([id, e]) => e.status.includes('pending')
//     );

//     const approvedEvents = myEvents.filter(
//         ([id, e]) => e.status === 'approved'
//     );

//     const viewFeedback = (event) => {
//         setSelectedEvent(event);
//         setShowFeedbackModal(true);
//     };

//     const viewAttendance = (eventId) => {
//         const eventAttendance = attendance[eventId] || {};
//         const attendeeCount = Object.keys(eventAttendance).length;
//         alert(`Total Attendees: ${attendeeCount}`);
//     };

//     const tabs = [
//         { id: 'myevents', label: 'My Events' },
//         { id: 'pending', label: `Pending (${pendingEvents.length})` },
//         { id: 'approved', label: `Approved (${approvedEvents.length})` }
//     ];

//     return (
//         <div className="app-container">
//             <div className="dashboard">
//                 <Header title="Faculty Dashboard" user={user} onLogout={onLogout} />

//                 <div className="dashboard-content">
//                     <StatCard
//                         title="Total Events"
//                         value={myEvents.length}
//                         icon="📅"
//                         color="primary"
//                     />
//                     <StatCard
//                         title="Pending Approval"
//                         value={pendingEvents.length}
//                         icon="⏳"
//                         color="warning"
//                     />
//                     <StatCard
//                         title="Approved Events"
//                         value={approvedEvents.length}
//                         icon="✓"
//                         color="success"
//                     />
//                 </div>

//                 <div className="card">
//                     <div className="card-header">
//                         <h3 className="card-title">Quick Actions</h3>
//                     </div>
//                     <button onClick={() => setShowEventModal(true)} className="btn btn-primary btn-lg">
//                         + Create New Event
//                     </button>
//                 </div>

//                 <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

//                 {activeTab === 'myevents' && (
//                     <div className="card">
//                         <h3>All My Events</h3>
//                         <div className="event-list">
//                             {myEvents.map(([id, event]) => (
//                                 <EventCard
//                                     key={id}
//                                     event={event}
//                                     actions={
//                                         <>
//                                             {event.status === 'approved' && (
//                                                 <>
//                                                     <button onClick={() => viewAttendance(id)} className="btn btn-info">
//                                                         View Attendance
//                                                     </button>
//                                                     <button onClick={() => viewFeedback({ id, ...event })} className="btn btn-warning">
//                                                         View Feedback
//                                                     </button>
//                                                 </>
//                                             )}
//                                         </>
//                                     }
//                                 />
//                             ))}
//                             {myEvents.length === 0 && (
//                                 <div className="empty-state">
//                                     <div className="empty-state-icon">📅</div>
//                                     <h3>No Events Yet</h3>
//                                     <p>Create your first event to get started</p>
//                                     <button onClick={() => setShowEventModal(true)} className="btn btn-primary mt-20">
//                                         Create Event
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {activeTab === 'pending' && (
//                     <div className="card">
//                         <h3>Pending Approval</h3>
//                         <div className="event-list">
//                             {pendingEvents.map(([id, event]) => (
//                                 <EventCard key={id} event={event} />
//                             ))}
//                             {pendingEvents.length === 0 && (
//                                 <p style={{ textAlign: 'center', color: '#999' }}>No pending events</p>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {activeTab === 'approved' && (
//                     <div className="card">
//                         <h3>Approved Events</h3>
//                         <div className="event-list">
//                             {approvedEvents.map(([id, event]) => (
//                                 <EventCard
//                                     key={id}
//                                     event={event}
//                                     actions={
//                                         <>
//                                             <button onClick={() => viewAttendance(id)} className="btn btn-info">
//                                                 View Attendance
//                                             </button>
//                                             <button onClick={() => viewFeedback({ id, ...event })} className="btn btn-warning">
//                                                 View Feedback
//                                             </button>
//                                         </>
//                                     }
//                                 />
//                             ))}
//                             {approvedEvents.length === 0 && (
//                                 <p style={{ textAlign: 'center', color: '#999' }}>No approved events</p>
//                             )}
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

// export default FacultyDashboard;









// import React, { useState, useEffect } from 'react';
// import { ref, onValue, get } from 'firebase/database';
// import { database } from '../../config/firebase';
// import Header from '../common/Header';
// import StatCard from '../common/StatCard';
// import Tabs from '../common/Tabs';
// import EventCard from '../common/EventCard';
// import CreateEventModal from '../modals/CreateEventModal';
// import ViewFeedbackModal from '../modals/ViewFeedbackModal';
// import ViewRegistrationsModal from '../modals/ViewRegistrationsModal';
// import ViewAttendanceModal from '../modals/ViewAttendanceModal';
// import ConfirmDialog from '../common/ConfirmDialog';
// import { deleteEvent } from '../../services/eventService';

// const FacultyDashboard = ({ user, onLogout }) => {
//     const [activeTab, setActiveTab] = useState('myevents');
//     const [events, setEvents] = useState({});
//     const [users, setUsers] = useState({});
//     const [attendance, setAttendance] = useState({});
//     const [showEventModal, setShowEventModal] = useState(false);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//     const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
//     const [showAttendanceModal, setShowAttendanceModal] = useState(false);
//     const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//     const [eventToDelete, setEventToDelete] = useState(null);

//     useEffect(() => {
//         const eventsRef = ref(database, 'events');
//         const attendanceRef = ref(database, 'attendance');
//         const usersRef = ref(database, 'users');

//         const unsubEvents = onValue(eventsRef, (snapshot) => {
//             setEvents(snapshot.val() || {});
//         });

//         const unsubAttendance = onValue(attendanceRef, (snapshot) => {
//             setAttendance(snapshot.val() || {});
//         });

//         const unsubUsers = onValue(usersRef, (snapshot) => {
//             setUsers(snapshot.val() || {});
//         });

//         return () => {
//             unsubEvents();
//             unsubAttendance();
//             unsubUsers();
//         };
//     }, []);

//     const myEvents = Object.entries(events).filter(
//         ([id, e]) => e.createdBy === user.id
//     );

//     const pendingEvents = myEvents.filter(
//         ([id, e]) => e.status.includes('pending')
//     );

//     const approvedEvents = myEvents.filter(
//         ([id, e]) => e.status === 'approved'
//     );

//     const getRegistrationCount = (eventId, event) => {
//         if (!event.registrations) return 0;
//         return Object.keys(event.registrations).length;
//     };

//     const getAttendanceCount = (eventId) => {
//         if (!attendance[eventId]) return 0;
//         return Object.keys(attendance[eventId]).length;
//     };

//     const viewRegistrations = (event) => {
//         setSelectedEvent(event);
//         setShowRegistrationsModal(true);
//     };

//     const viewAttendance = (event) => {
//         setSelectedEvent(event);
//         setShowAttendanceModal(true);
//     };

//     const viewFeedback = (event) => {
//         setSelectedEvent(event);
//         setShowFeedbackModal(true);
//     };

//     const handleDeleteEvent = (eventId, eventTitle) => {
//         setEventToDelete({ id: eventId, title: eventTitle });
//         setShowDeleteDialog(true);
//     };

//     const confirmDelete = async () => {
//         if (!eventToDelete) return;

//         const result = await deleteEvent(eventToDelete.id);

//         if (result.success) {
//             alert(`Event "${eventToDelete.title}" deleted successfully!`);
//             setEventToDelete(null);
//         } else {
//             alert('Failed to delete event: ' + result.error);
//         }
//     };

//     const tabs = [
//         { id: 'myevents', label: 'My Events' },
//         { id: 'pending', label: `Pending (${pendingEvents.length})` },
//         { id: 'approved', label: `Approved (${approvedEvents.length})` }
//     ];

//     return (
//         <div className="app-container">
//             <div className="dashboard">
//                 <Header title="Faculty Dashboard" user={user} onLogout={onLogout} />

//                 <div className="dashboard-content">
//                     <StatCard
//                         title="Total Events"
//                         value={myEvents.length}
//                         icon="📅"
//                         color="primary"
//                     />
//                     <StatCard
//                         title="Pending Approval"
//                         value={pendingEvents.length}
//                         icon="⏳"
//                         color="warning"
//                     />
//                     <StatCard
//                         title="Approved Events"
//                         value={approvedEvents.length}
//                         icon="✓"
//                         color="success"
//                     />
//                 </div>

//                 <div className="card">
//                     <div className="card-header">
//                         <h3 className="card-title">Quick Actions</h3>
//                     </div>
//                     <button onClick={() => setShowEventModal(true)} className="btn btn-primary btn-lg">
//                         + Create New Event
//                     </button>
//                 </div>

//                 <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

//                 {activeTab === 'myevents' && (
//                     <div className="card">
//                         <h3>All My Events</h3>
//                         <div className="event-list">
//                             {myEvents.map(([id, event]) => {
//                                 const regCount = getRegistrationCount(id, event);
//                                 const attCount = getAttendanceCount(id);

//                                 return (
//                                     <EventCard
//                                         key={id}
//                                         event={event}
//                                         actions={
//                                             <>
//                                                 {event.status === 'approved' && (
//                                                     <>
//                                                         <button 
//                                                             onClick={() => viewRegistrations({ id, ...event })} 
//                                                             className="btn btn-info"
//                                                         >
//                                                             👥 View Registrations ({regCount})
//                                                         </button>
//                                                         <button 
//                                                             onClick={() => viewAttendance({ id, ...event })} 
//                                                             className="btn btn-success"
//                                                         >
//                                                             📋 View Attendance ({attCount})
//                                                         </button>
//                                                         <button 
//                                                             onClick={() => viewFeedback({ id, ...event })} 
//                                                             className="btn btn-warning"
//                                                         >
//                                                             ⭐ View Feedback
//                                                         </button>
//                                                     </>
//                                                 )}
//                                                 <button
//                                                     onClick={() => handleDeleteEvent(id, event.title)}
//                                                     className="btn btn-danger"
//                                                     style={{ marginTop: '5px' }}
//                                                 >
//                                                     🗑️ Delete Event
//                                                 </button>
//                                             </>
//                                         }
//                                     />
//                                 );
//                             })}
//                             {myEvents.length === 0 && (
//                                 <div className="empty-state">
//                                     <div className="empty-state-icon">📅</div>
//                                     <h3>No Events Yet</h3>
//                                     <p>Create your first event to get started</p>
//                                     <button onClick={() => setShowEventModal(true)} className="btn btn-primary mt-20">
//                                         Create Event
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {activeTab === 'pending' && (
//                     <div className="card">
//                         <h3>Pending Approval</h3>
//                         <div className="event-list">
//                             {pendingEvents.map(([id, event]) => (
//                                 <EventCard 
//                                     key={id} 
//                                     event={event}
//                                     actions={
//                                         <button
//                                             onClick={() => handleDeleteEvent(id, event.title)}
//                                             className="btn btn-danger"
//                                         >
//                                             🗑️ Delete Event
//                                         </button>
//                                     }
//                                 />
//                             ))}
//                             {pendingEvents.length === 0 && (
//                                 <p style={{ textAlign: 'center', color: '#999' }}>No pending events</p>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {activeTab === 'approved' && (
//                     <div className="card">
//                         <h3>Approved Events</h3>
//                         <div className="event-list">
//                             {approvedEvents.map(([id, event]) => {
//                                 const regCount = getRegistrationCount(id, event);
//                                 const attCount = getAttendanceCount(id);

//                                 return (
//                                     <EventCard
//                                         key={id}
//                                         event={event}
//                                         actions={
//                                             <>
//                                                 <button 
//                                                     onClick={() => viewRegistrations({ id, ...event })} 
//                                                     className="btn btn-info"
//                                                 >
//                                                     👥 View Registrations ({regCount})
//                                                 </button>
//                                                 <button 
//                                                     onClick={() => viewAttendance({ id, ...event })} 
//                                                     className="btn btn-success"
//                                                 >
//                                                     📋 View Attendance ({attCount})
//                                                 </button>
//                                                 <button 
//                                                     onClick={() => viewFeedback({ id, ...event })} 
//                                                     className="btn btn-warning"
//                                                 >
//                                                     ⭐ View Feedback
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handleDeleteEvent(id, event.title)}
//                                                     className="btn btn-danger"
//                                                     style={{ marginTop: '5px' }}
//                                                 >
//                                                     🗑️ Delete Event
//                                                 </button>
//                                             </>
//                                         }
//                                     />
//                                 );
//                             })}
//                             {approvedEvents.length === 0 && (
//                                 <p style={{ textAlign: 'center', color: '#999' }}>No approved events</p>
//                             )}
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
//                     <>
//                         <ViewFeedbackModal
//                             isOpen={showFeedbackModal}
//                             onClose={() => {
//                                 setShowFeedbackModal(false);
//                                 setSelectedEvent(null);
//                             }}
//                             eventId={selectedEvent.id}
//                             eventTitle={selectedEvent.title}
//                         />

//                         <ViewRegistrationsModal
//                             isOpen={showRegistrationsModal}
//                             onClose={() => {
//                                 setShowRegistrationsModal(false);
//                                 setSelectedEvent(null);
//                             }}
//                             event={selectedEvent}
//                             users={users}
//                         />

//                         <ViewAttendanceModal
//                             isOpen={showAttendanceModal}
//                             onClose={() => {
//                                 setShowAttendanceModal(false);
//                                 setSelectedEvent(null);
//                             }}
//                             eventId={selectedEvent.id}
//                             eventTitle={selectedEvent.title}
//                             attendance={attendance[selectedEvent.id] || {}}
//                             users={users}
//                         />
//                     </>
//                 )}

//                 <ConfirmDialog
//                     isOpen={showDeleteDialog}
//                     onClose={() => {
//                         setShowDeleteDialog(false);
//                         setEventToDelete(null);
//                     }}
//                     onConfirm={confirmDelete}
//                     title="Delete Event"
//                     message={`Are you sure you want to delete "${eventToDelete?.title}"? This action cannot be undone.`}
//                     confirmText="Delete"
//                     cancelText="Cancel"
//                 />
//             </div>
//         </div>
//     );
// };

// export default FacultyDashboard;











// import React, { useState, useEffect } from 'react';
// import { ref, onValue, get } from 'firebase/database';
// import { database } from '../../config/firebase';
// import Header from '../common/Header';
// import StatCard from '../common/StatCard';
// import Tabs from '../common/Tabs';
// import EventCard from '../common/EventCard';
// import CreateEventModal from '../modals/CreateEventModal';
// import ViewFeedbackModal from '../modals/ViewFeedbackModal';
// import ViewRegistrationsModal from '../modals/ViewRegistrationsModal';
// import ViewAttendanceModal from '../modals/Viewattendancemodal';
// import ConfirmDialog from '../common/ConfirmDialog';
// import EventReportGenerator from '../common/EventReportGenerator';
// import { deleteEvent } from '../../services/eventService';
// import { isEventPast, isEventActive, isEventUpcoming } from '../../utils/helpers';

// const FacultyDashboard = ({ user, onLogout }) => {
//     const [activeTab, setActiveTab] = useState('myevents');
//     const [events, setEvents] = useState({});
//     const [users, setUsers] = useState({});
//     const [rooms, setRooms] = useState({});
//     const [institutions, setInstitutions] = useState({});
//     const [attendance, setAttendance] = useState({});
//     const [showEventModal, setShowEventModal] = useState(false);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//     const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
//     const [showAttendanceModal, setShowAttendanceModal] = useState(false);
//     const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//     const [eventToDelete, setEventToDelete] = useState(null);

//     useEffect(() => {
//         const eventsRef = ref(database, 'events');
//         const attendanceRef = ref(database, 'attendance');
//         const usersRef = ref(database, 'users');
//         const roomsRef = ref(database, 'rooms');
//         const institutionsRef = ref(database, 'institutions');

//         const unsubEvents = onValue(eventsRef, (snapshot) => {
//             setEvents(snapshot.val() || {});
//         });

//         const unsubAttendance = onValue(attendanceRef, (snapshot) => {
//             setAttendance(snapshot.val() || {});
//         });

//         const unsubUsers = onValue(usersRef, (snapshot) => {
//             setUsers(snapshot.val() || {});
//         });

//         const unsubRooms = onValue(roomsRef, (snapshot) => {
//             setRooms(snapshot.val() || {});
//         });

//         const unsubInstitutions = onValue(institutionsRef, (snapshot) => {
//             setInstitutions(snapshot.val() || {});
//         });

//         return () => {
//             unsubEvents();
//             unsubAttendance();
//             unsubUsers();
//             unsubRooms();
//             unsubInstitutions();
//         };
//     }, []);

//     const myEvents = Object.entries(events).filter(
//         ([id, e]) => e.createdBy === user.id && e.institutionId === user.institutionId
//     );

//     const pendingEvents = myEvents.filter(
//         ([id, e]) => e.status.includes('pending')
//     );

//     const approvedEvents = myEvents.filter(
//         ([id, e]) => e.status === 'approved'
//     );

//     const activeEvents = myEvents.filter(
//         ([id, e]) => e.status === 'approved' && isEventActive(e)
//     );

//     const upcomingEvents = myEvents.filter(
//         ([id, e]) => e.status === 'approved' && isEventUpcoming(e)
//     );

//     const completedEvents = myEvents.filter(
//         ([id, e]) => e.status === 'approved' && isEventPast(e)
//     );

//     const institutionData = institutions[user.institutionId];

//     const getRegistrationCount = (eventId, event) => {
//         if (!event.registrations) return 0;
//         return Object.keys(event.registrations).length;
//     };

//     const getAttendanceCount = (eventId) => {
//         if (!attendance[eventId]) return 0;
//         return Object.keys(attendance[eventId]).length;
//     };

//     const getPresentCount = (eventId) => {
//         if (!attendance[eventId]) return 0;
//         return Object.values(attendance[eventId]).filter(att => att.status === 'present').length;
//     };

//     const getAbsentCount = (eventId) => {
//         if (!attendance[eventId]) return 0;
//         return Object.values(attendance[eventId]).filter(att => att.status === 'absent').length;
//     };

//     const viewRegistrations = (event) => {
//         setSelectedEvent(event);
//         setShowRegistrationsModal(true);
//     };

//     const viewAttendance = (eventId, event) => {
//         setSelectedEvent({
//             id: eventId,
//             ...event
//         });
//         setShowAttendanceModal(true);
//     };

//     const viewFeedback = (eventId, event) => {
//         setSelectedEvent({
//             id: eventId,
//             ...event
//         });
//         setShowFeedbackModal(true);
//     };

//     const confirmDelete = (eventId, event) => {
//         setEventToDelete({ id: eventId, ...event });
//         setShowDeleteDialog(true);
//     };

//     const handleDelete = async () => {
//         if (eventToDelete) {
//             const result = await deleteEvent(eventToDelete.id);
//             if (result.success) {
//                 alert('Event deleted successfully!');
//             } else {
//                 alert('Failed to delete event: ' + result.error);
//             }
//             setEventToDelete(null);
//         }
//     };

//     const tabs = [
//         { id: 'myevents', label: `All Events (${myEvents.length})` },
//         { id: 'active', label: `Active (${activeEvents.length})` },
//         { id: 'upcoming', label: `Upcoming (${upcomingEvents.length})` },
//         { id: 'completed', label: `Completed (${completedEvents.length})` },
//         { id: 'pending', label: `Pending (${pendingEvents.length})` }
//     ];

//     const renderEventActions = (eventId, event) => {
//         const regCount = getRegistrationCount(eventId, event);
//         const attCount = getAttendanceCount(eventId);
//         const presentCount = getPresentCount(eventId);
//         const absentCount = getAbsentCount(eventId);

//         return (
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//                 {/* Event statistics */}
//                 <div style={{
//                     display: 'grid',
//                     gridTemplateColumns: 'repeat(2, 1fr)',
//                     gap: '10px',
//                     padding: '10px',
//                     background: '#f8f9fa',
//                     borderRadius: '8px',
//                     fontSize: '13px'
//                 }}>
//                     <div>
//                         <strong>Registrations:</strong> {regCount}
//                     </div>
//                     <div>
//                         <strong>Attendance:</strong> {attCount}
//                     </div>
//                     {attCount > 0 && (
//                         <>
//                             <div style={{ color: '#28a745' }}>
//                                 <strong>Present:</strong> {presentCount}
//                             </div>
//                             <div style={{ color: '#dc3545' }}>
//                                 <strong>Absent:</strong> {absentCount}
//                             </div>
//                         </>
//                     )}
//                 </div>

//                 {/* Action buttons */}
//                 <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
//                     {regCount > 0 && (
//                         <button
//                             onClick={() => viewRegistrations(event)}
//                             className="btn btn-info"
//                         >
//                             👥 View Registrations ({regCount})
//                         </button>
//                     )}

//                     {attCount > 0 && (
//                         <button
//                             onClick={() => viewAttendance(eventId, event)}
//                             className="btn btn-success"
//                         >
//                             📊 View Attendance ({presentCount}/{attCount})
//                         </button>
//                     )}

//                     {event.status === 'approved' && isEventPast(event) && (
//                         <>
//                             <button
//                                 onClick={() => viewFeedback(eventId, event)}
//                                 className="btn btn-secondary"
//                             >
//                                 💬 View Feedback
//                             </button>

//                             <EventReportGenerator
//                                 event={event}
//                                 institutionName={institutionData?.name || 'Institution'}
//                                 attendance={attendance[eventId] || {}}
//                                 registrations={event.registrations || {}}
//                                 feedback={null}
//                                 users={users}
//                                 roomData={rooms[event.roomId] || {}}
//                             />
//                         </>
//                     )}

//                     {event.status.includes('pending') && (
//                         <button
//                             onClick={() => confirmDelete(eventId, event)}
//                             className="btn btn-danger"
//                         >
//                             🗑️ Delete Event
//                         </button>
//                     )}
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className="app-container">
//             <div className="dashboard">
//                 <Header title="Faculty Dashboard" user={user} onLogout={onLogout} />

//                 <div className="dashboard-content">
//                     <StatCard
//                         title="Total Events"
//                         value={myEvents.length}
//                         icon="📅"
//                         color="primary"
//                     />
//                     <StatCard
//                         title="Active Now"
//                         value={activeEvents.length}
//                         icon="🔴"
//                         color="danger"
//                     />
//                     <StatCard
//                         title="Upcoming"
//                         value={upcomingEvents.length}
//                         icon="⏰"
//                         color="warning"
//                     />
//                     <StatCard
//                         title="Completed"
//                         value={completedEvents.length}
//                         icon="✓"
//                         color="success"
//                     />
//                 </div>

//                 <div className="card">
//                     <div className="card-header">
//                         <h3 className="card-title">Event Management</h3>
//                         <button onClick={() => setShowEventModal(true)} className="btn btn-primary">
//                             + Create New Event
//                         </button>
//                     </div>

//                     <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

//                     {activeTab === 'myevents' && (
//                         <div className="event-list">
//                             {myEvents.length > 0 ? (
//                                 myEvents.map(([eventId, event]) => (
//                                     <EventCard
//                                         key={eventId}
//                                         event={event}
//                                         showStatus={true}
//                                         actions={renderEventActions(eventId, event)}
//                                     />
//                                 ))
//                             ) : (
//                                 <div className="empty-state">
//                                     <div className="empty-state-icon">📅</div>
//                                     <h3>No Events Yet</h3>
//                                     <p>Create your first event to get started</p>
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {activeTab === 'active' && (
//                         <div className="event-list">
//                             {activeEvents.length > 0 ? (
//                                 activeEvents.map(([eventId, event]) => (
//                                     <EventCard
//                                         key={eventId}
//                                         event={event}
//                                         showStatus={true}
//                                         actions={renderEventActions(eventId, event)}
//                                     />
//                                 ))
//                             ) : (
//                                 <div className="empty-state">
//                                     <div className="empty-state-icon">🔴</div>
//                                     <h3>No Active Events</h3>
//                                     <p>No events are currently happening</p>
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {activeTab === 'upcoming' && (
//                         <div className="event-list">
//                             {upcomingEvents.length > 0 ? (
//                                 upcomingEvents.map(([eventId, event]) => (
//                                     <EventCard
//                                         key={eventId}
//                                         event={event}
//                                         showStatus={true}
//                                         actions={renderEventActions(eventId, event)}
//                                     />
//                                 ))
//                             ) : (
//                                 <div className="empty-state">
//                                     <div className="empty-state-icon">⏰</div>
//                                     <h3>No Upcoming Events</h3>
//                                     <p>All approved events have started or ended</p>
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {activeTab === 'completed' && (
//                         <div className="event-list">
//                             {completedEvents.length > 0 ? (
//                                 completedEvents.map(([eventId, event]) => (
//                                     <EventCard
//                                         key={eventId}
//                                         event={event}
//                                         showStatus={false}
//                                         actions={renderEventActions(eventId, event)}
//                                     />
//                                 ))
//                             ) : (
//                                 <div className="empty-state">
//                                     <div className="empty-state-icon">✓</div>
//                                     <h3>No Completed Events</h3>
//                                     <p>Your completed events will appear here</p>
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {activeTab === 'pending' && (
//                         <div className="event-list">
//                             {pendingEvents.length > 0 ? (
//                                 pendingEvents.map(([eventId, event]) => (
//                                     <EventCard
//                                         key={eventId}
//                                         event={event}
//                                         showStatus={true}
//                                         actions={renderEventActions(eventId, event)}
//                                     />
//                                 ))
//                             ) : (
//                                 <div className="empty-state">
//                                     <div className="empty-state-icon">⏳</div>
//                                     <h3>No Pending Events</h3>
//                                     <p>All your events have been processed</p>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {showEventModal && (
//                 <CreateEventModal
//                     isOpen={showEventModal}
//                     onClose={() => setShowEventModal(false)}
//                     onSuccess={() => setShowEventModal(false)}
//                     institutionId={user.institutionId}
//                     creatorId={user.id}
//                 />
//             )}

//             {showFeedbackModal && selectedEvent && (
//                 <ViewFeedbackModal
//                     isOpen={showFeedbackModal}
//                     onClose={() => {
//                         setShowFeedbackModal(false);
//                         setSelectedEvent(null);
//                     }}
//                     eventId={selectedEvent.id}
//                     eventTitle={selectedEvent.title}
//                 />
//             )}

//             {showRegistrationsModal && selectedEvent && (
//                 <ViewRegistrationsModal
//                     isOpen={showRegistrationsModal}
//                     onClose={() => {
//                         setShowRegistrationsModal(false);
//                         setSelectedEvent(null);
//                     }}
//                     event={selectedEvent}
//                     users={users}
//                 />
//             )}

//             {showAttendanceModal && selectedEvent && (
//                 <ViewAttendanceModal
//                     isOpen={showAttendanceModal}
//                     onClose={() => {
//                         setShowAttendanceModal(false);
//                         setSelectedEvent(null);
//                     }}
//                     eventId={selectedEvent.id}
//                     eventTitle={selectedEvent.title}
//                     attendance={attendance[selectedEvent.id] || {}}
//                     users={users}
//                     roomRadius={rooms[selectedEvent.roomId]?.radius || 100}
//                 />
//             )}

//             {showDeleteDialog && eventToDelete && (
//                 <ConfirmDialog
//                     isOpen={showDeleteDialog}
//                     onClose={() => {
//                         setShowDeleteDialog(false);
//                         setEventToDelete(null);
//                     }}
//                     onConfirm={handleDelete}
//                     title="Delete Event"
//                     message={`Are you sure you want to delete "${eventToDelete.title}"? This action cannot be undone.`}
//                     confirmText="Delete"
//                     cancelText="Cancel"
//                 />
//             )}
//         </div>
//     );
// };

// export default FacultyDashboard;













import React, { useState, useEffect } from 'react';
import { ref, onValue, get } from 'firebase/database';
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
import EventReportGeneratorAI from '../common/Eventreportgenerator';
import { deleteEvent } from '../../services/eventService';
import { isEventPast, isEventActive, isEventUpcoming } from '../../utils/helpers';

const FacultyDashboard = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('myevents');
    const [events, setEvents] = useState({});
    const [users, setUsers] = useState({});
    const [rooms, setRooms] = useState({});
    const [institutions, setInstitutions] = useState({});
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
        const attendanceRef = ref(database, 'attendance');
        const usersRef = ref(database, 'users');
        const roomsRef = ref(database, 'rooms');
        const institutionsRef = ref(database, 'institutions');

        const unsubEvents = onValue(eventsRef, (snapshot) => {
            setEvents(snapshot.val() || {});
        });

        const unsubAttendance = onValue(attendanceRef, (snapshot) => {
            setAttendance(snapshot.val() || {});
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

        return () => {
            unsubEvents();
            unsubAttendance();
            unsubUsers();
            unsubRooms();
            unsubInstitutions();
        };
    }, []);

    const myEvents = Object.entries(events).filter(
        ([id, e]) => e.createdBy === user.id && e.institutionId === user.institutionId
    );

    const pendingEvents = myEvents.filter(
        ([id, e]) => e.status.includes('pending')
    );

    const approvedEvents = myEvents.filter(
        ([id, e]) => e.status === 'approved'
    );

    const activeEvents = myEvents.filter(
        ([id, e]) => e.status === 'approved' && isEventActive(e)
    );

    const upcomingEvents = myEvents.filter(
        ([id, e]) => e.status === 'approved' && isEventUpcoming(e)
    );

    const completedEvents = myEvents.filter(
        ([id, e]) => e.status === 'approved' && isEventPast(e)
    );

    const institutionData = institutions[user.institutionId];

    const getRegistrationCount = (eventId, event) => {
        if (!event.registrations) return 0;
        return Object.keys(event.registrations).length;
    };

    const getAttendanceCount = (eventId) => {
        if (!attendance[eventId]) return 0;
        return Object.keys(attendance[eventId]).length;
    };

    const getPresentCount = (eventId) => {
        if (!attendance[eventId]) return 0;
        return Object.values(attendance[eventId]).filter(att => att.status === 'present').length;
    };

    const getAbsentCount = (eventId) => {
        if (!attendance[eventId]) return 0;
        return Object.values(attendance[eventId]).filter(att => att.status === 'absent').length;
    };

    const viewRegistrations = (event) => {
        setSelectedEvent(event);
        setShowRegistrationsModal(true);
    };

    const viewAttendance = (eventId, event) => {
        setSelectedEvent({
            id: eventId,
            ...event
        });
        setShowAttendanceModal(true);
    };

    const viewFeedback = (eventId, event) => {
        setSelectedEvent({
            id: eventId,
            ...event
        });
        setShowFeedbackModal(true);
    };

    const confirmDelete = (eventId, event) => {
        setEventToDelete({ id: eventId, ...event });
        setShowDeleteDialog(true);
    };

    const handleDelete = async () => {
        if (eventToDelete) {
            const result = await deleteEvent(eventToDelete.id);
            if (result.success) {
                alert('Event deleted successfully!');
            } else {
                alert('Failed to delete event: ' + result.error);
            }
            setEventToDelete(null);
        }
    };

    const tabs = [
        { id: 'myevents', label: `All Events (${myEvents.length})` },
        { id: 'active', label: `Active (${activeEvents.length})` },
        { id: 'upcoming', label: `Upcoming (${upcomingEvents.length})` },
        { id: 'completed', label: `Completed (${completedEvents.length})` },
        { id: 'pending', label: `Pending (${pendingEvents.length})` }
    ];

    const renderEventActions = (eventId, event) => {
        const regCount = getRegistrationCount(eventId, event);
        const attCount = getAttendanceCount(eventId);
        const presentCount = getPresentCount(eventId);
        const absentCount = getAbsentCount(eventId);

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Event statistics */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '10px',
                    padding: '10px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    fontSize: '13px'
                }}>
                    <div>
                        <strong>Registrations:</strong> {regCount}
                    </div>
                    <div>
                        <strong>Attendance:</strong> {attCount}
                    </div>
                    {attCount > 0 && (
                        <>
                            <div style={{ color: '#28a745' }}>
                                <strong>Present:</strong> {presentCount}
                            </div>
                            <div style={{ color: '#dc3545' }}>
                                <strong>Absent:</strong> {absentCount}
                            </div>
                        </>
                    )}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {regCount > 0 && (
                        <button
                            onClick={() => viewRegistrations(event)}
                            className="btn btn-info"
                        >
                            👥 View Registrations ({regCount})
                        </button>
                    )}

                    {attCount > 0 && (
                        <button
                            onClick={() => viewAttendance(eventId, event)}
                            className="btn btn-success"
                        >
                            📊 View Attendance ({presentCount}/{attCount})
                        </button>
                    )}

                    {event.status === 'approved' && isEventPast(event) && (
                        <>
                            <button
                                onClick={() => viewFeedback(eventId, event)}
                                className="btn btn-secondary"
                            >
                                💬 View Feedback
                            </button>

                            <EventReportGeneratorAI
                                event={{
                                    ...event,
                                    id: eventId
                                }}
                                institutionName={institutionData?.name || 'Institution'}
                                attendance={attendance[eventId] || {}}
                                registrations={event.registrations || {}}
                                feedback={null}
                                users={users}
                                roomData={rooms[event.roomId] || {}}
                                userRole="faculty"
                            />
                        </>
                    )}

                    {event.status.includes('pending') && (
                        <button
                            onClick={() => confirmDelete(eventId, event)}
                            className="btn btn-danger"
                        >
                            🗑️ Delete Event
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="app-container">
            <div className="dashboard">
                <Header title="Faculty Dashboard" user={user} onLogout={onLogout} />

                <div className="dashboard-content">
                    <StatCard
                        title="Total Events"
                        value={myEvents.length}
                        icon="📅"
                        color="primary"
                    />
                    <StatCard
                        title="Active Now"
                        value={activeEvents.length}
                        icon="🔴"
                        color="danger"
                    />
                    <StatCard
                        title="Upcoming"
                        value={upcomingEvents.length}
                        icon="⏰"
                        color="warning"
                    />
                    <StatCard
                        title="Completed"
                        value={completedEvents.length}
                        icon="✓"
                        color="success"
                    />
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Event Management</h3>
                        <button onClick={() => setShowEventModal(true)} className="btn btn-primary">
                            + Create New Event
                        </button>
                    </div>

                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                    {activeTab === 'myevents' && (
                        <div className="event-list">
                            {myEvents.length > 0 ? (
                                myEvents.map(([eventId, event]) => (
                                    <EventCard
                                        key={eventId}
                                        event={event}
                                        showStatus={true}
                                        actions={renderEventActions(eventId, event)}
                                    />
                                ))
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-state-icon">📅</div>
                                    <h3>No Events Yet</h3>
                                    <p>Create your first event to get started</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'active' && (
                        <div className="event-list">
                            {activeEvents.length > 0 ? (
                                activeEvents.map(([eventId, event]) => (
                                    <EventCard
                                        key={eventId}
                                        event={event}
                                        showStatus={true}
                                        actions={renderEventActions(eventId, event)}
                                    />
                                ))
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-state-icon">🔴</div>
                                    <h3>No Active Events</h3>
                                    <p>No events are currently happening</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'upcoming' && (
                        <div className="event-list">
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map(([eventId, event]) => (
                                    <EventCard
                                        key={eventId}
                                        event={event}
                                        showStatus={true}
                                        actions={renderEventActions(eventId, event)}
                                    />
                                ))
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-state-icon">⏰</div>
                                    <h3>No Upcoming Events</h3>
                                    <p>All approved events have started or ended</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'completed' && (
                        <div className="event-list">
                            {completedEvents.length > 0 ? (
                                completedEvents.map(([eventId, event]) => (
                                    <EventCard
                                        key={eventId}
                                        event={event}
                                        showStatus={false}
                                        actions={renderEventActions(eventId, event)}
                                    />
                                ))
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-state-icon">✓</div>
                                    <h3>No Completed Events</h3>
                                    <p>Your completed events will appear here</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'pending' && (
                        <div className="event-list">
                            {pendingEvents.length > 0 ? (
                                pendingEvents.map(([eventId, event]) => (
                                    <EventCard
                                        key={eventId}
                                        event={event}
                                        showStatus={true}
                                        actions={renderEventActions(eventId, event)}
                                    />
                                ))
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-state-icon">⏳</div>
                                    <h3>No Pending Events</h3>
                                    <p>All your events have been processed</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showEventModal && (
                <CreateEventModal
                    isOpen={showEventModal}
                    onClose={() => setShowEventModal(false)}
                    onSuccess={() => setShowEventModal(false)}
                    institutionId={user.institutionId}
                    creatorId={user.id}
                />
            )}

            {showFeedbackModal && selectedEvent && (
                <ViewFeedbackModal
                    isOpen={showFeedbackModal}
                    onClose={() => {
                        setShowFeedbackModal(false);
                        setSelectedEvent(null);
                    }}
                    eventId={selectedEvent.id}
                    eventTitle={selectedEvent.title}
                />
            )}

            {showRegistrationsModal && selectedEvent && (
                <ViewRegistrationsModal
                    isOpen={showRegistrationsModal}
                    onClose={() => {
                        setShowRegistrationsModal(false);
                        setSelectedEvent(null);
                    }}
                    event={selectedEvent}
                    users={users}
                />
            )}

            {showAttendanceModal && selectedEvent && (
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
                    roomRadius={rooms[selectedEvent.roomId]?.radius || 100}
                />
            )}

            {showDeleteDialog && eventToDelete && (
                <ConfirmDialog
                    isOpen={showDeleteDialog}
                    onClose={() => {
                        setShowDeleteDialog(false);
                        setEventToDelete(null);
                    }}
                    onConfirm={handleDelete}
                    title="Delete Event"
                    message={`Are you sure you want to delete "${eventToDelete.title}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            )}
        </div>
    );
};

export default FacultyDashboard;