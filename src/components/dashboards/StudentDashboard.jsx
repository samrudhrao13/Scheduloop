// import React, { useState, useEffect } from 'react';
// import { ref, onValue } from 'firebase/database';
// import { database } from '../../config/firebase';
// import Header from '../common/Header';
// import Tabs from '../common/Tabs';
// import EventCard from '../common/EventCard';
// import FeedbackModal from '../modals/FeedbackModal';
// import { registerForEvent } from '../../services/eventService';
// import { markAttendance } from '../../services/attendanceService';
// import { useGeolocation } from '../../hooks/useGeolocation';
// import { isEventActive, isEventUpcoming, canSubmitFeedback } from '../../utils/helpers';

// const StudentDashboard = ({ user, onLogout }) => {
//     const [activeTab, setActiveTab] = useState('upcoming');
//     const [events, setEvents] = useState({});
//     const [rooms, setRooms] = useState({});
//     const [attendance, setAttendance] = useState({});
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//     const { location, error, loading, getCurrentLocation } = useGeolocation();

//     useEffect(() => {
//         const eventsRef = ref(database, 'events');
//         const roomsRef = ref(database, 'rooms');
//         const attendanceRef = ref(database, 'attendance');

//         const unsubEvents = onValue(eventsRef, (snapshot) => {
//             setEvents(snapshot.val() || {});
//         });

//         const unsubRooms = onValue(roomsRef, (snapshot) => {
//             setRooms(snapshot.val() || {});
//         });

//         const unsubAttendance = onValue(attendanceRef, (snapshot) => {
//             setAttendance(snapshot.val() || {});
//         });

//         return () => {
//             unsubEvents();
//             unsubRooms();
//             unsubAttendance();
//         };
//     }, []);

//     const approvedEvents = Object.entries(events).filter(
//         ([id, e]) => e.institutionId === user.institutionId && e.status === 'approved'
//     );

//     const upcomingEvents = approvedEvents.filter(([id, e]) => isEventUpcoming(e));
//     const activeEvents = approvedEvents.filter(([id, e]) => isEventActive(e));
//     const pastEvents = approvedEvents.filter(([id, e]) => !isEventUpcoming(e) && !isEventActive(e));

//     const myAttendance = Object.entries(attendance)
//         .filter(([eventId, attendees]) => attendees[user.id])
//         .map(([eventId]) => eventId);

//     const handleRegister = async (eventId, event) => {
//         if (event.isPaid && user.wallet < event.fee) {
//             alert('Insufficient wallet balance!');
//             return;
//         }

//         const result = await registerForEvent(eventId, user.id, user.wallet, event.fee || 0);

//         if (result.success) {
//             alert('Successfully registered for the event!');
//         } else {
//             alert(result.error);
//         }
//     };

//     const handleMarkAttendance = async (eventId, event) => {
//         getCurrentLocation();

//         if (!location) {
//             alert('Please allow location access to mark attendance');
//             return;
//         }

//         const roomEntry = Object.entries(rooms).find(([id, r]) => r.name === event.roomName);

//         if (!roomEntry) {
//             alert('Room location not found');
//             return;
//         }

//         const [roomId, room] = roomEntry;
//         const roomLocation = {
//             latitude: parseFloat(room.latitude),
//             longitude: parseFloat(room.longitude)
//         };

//         const result = await markAttendance(eventId, user.id, location, roomLocation);

//         if (result.success) {
//             alert(`Attendance marked successfully! Distance: ${result.distance}m`);
//         } else {
//             alert(result.error);
//         }
//     };

//     const handleSubmitFeedback = (event) => {
//         setSelectedEvent(event);
//         setShowFeedbackModal(true);
//     };

//     const tabs = [
//         { id: 'upcoming', label: `Upcoming (${upcomingEvents.length})` },
//         { id: 'active', label: `Active (${activeEvents.length})` },
//         { id: 'past', label: `Past (${pastEvents.length})` },
//         { id: 'myattendance', label: 'My Attendance' }
//     ];

//     return (
//         <div className="app-container">
//             <div className="dashboard">
//                 <Header title="Student Dashboard" user={user} onLogout={onLogout} />

//                 <div className="wallet-display">
//                     <h3>💳 Wallet Balance</h3>
//                     <div className="wallet-amount">₹{user.wallet || 0}</div>
//                     <p className="wallet-info">Use your wallet to register for paid events</p>
//                 </div>

//                 <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

//                 {activeTab === 'upcoming' && (
//                     <div className="card">
//                         <h3>Upcoming Events</h3>
//                         <div className="event-list">
//                             {upcomingEvents.map(([id, event]) => (
//                                 <EventCard
//                                     key={id}
//                                     event={event}
//                                     showStatus={false}
//                                     actions={
//                                         <button onClick={() => handleRegister(id, event)} className="btn btn-primary">
//                                             📝 Register
//                                         </button>
//                                     }
//                                 />
//                             ))}
//                             {upcomingEvents.length === 0 && (
//                                 <div className="empty-state">
//                                     <div className="empty-state-icon">📅</div>
//                                     <h3>No Upcoming Events</h3>
//                                     <p>Check back later for new events</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {activeTab === 'active' && (
//                     <div className="card">
//                         <h3>Active Events (Happening Now)</h3>
//                         <div className="event-list">
//                             {activeEvents.map(([id, event]) => (
//                                 <EventCard
//                                     key={id}
//                                     event={event}
//                                     showStatus={false}
//                                     actions={
//                                         <button
//                                             onClick={() => handleMarkAttendance(id, event)}
//                                             className="btn btn-success"
//                                             disabled={myAttendance.includes(id)}
//                                         >
//                                             {myAttendance.includes(id) ? '✓ Attended' : '📍 Mark Attendance'}
//                                         </button>
//                                     }
//                                 />
//                             ))}
//                             {activeEvents.length === 0 && (
//                                 <div className="empty-state">
//                                     <div className="empty-state-icon">⏰</div>
//                                     <h3>No Active Events</h3>
//                                     <p>No events are currently happening</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {activeTab === 'past' && (
//                     <div className="card">
//                         <h3>Past Events</h3>
//                         <div className="event-list">
//                             {pastEvents.map(([id, event]) => (
//                                 <EventCard
//                                     key={id}
//                                     event={event}
//                                     showStatus={false}
//                                     actions={
//                                         myAttendance.includes(id) && (
//                                             <button
//                                                 onClick={() => handleSubmitFeedback({ id, ...event })}
//                                                 className="btn btn-warning"
//                                             >
//                                                 ⭐ Submit Feedback
//                                             </button>
//                                         )
//                                     }
//                                 />
//                             ))}
//                             {pastEvents.length === 0 && (
//                                 <p style={{ textAlign: 'center', color: '#999' }}>No past events</p>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {activeTab === 'myattendance' && (
//                     <div className="card">
//                         <h3>My Attendance History</h3>
//                         <div className="event-list">
//                             {myAttendance.map(eventId => {
//                                 const event = events[eventId];
//                                 if (!event) return null;
//                                 return (
//                                     <EventCard
//                                         key={eventId}
//                                         event={event}
//                                         showStatus={false}
//                                     />
//                                 );
//                             })}
//                             {myAttendance.length === 0 && (
//                                 <div className="empty-state">
//                                     <div className="empty-state-icon">📋</div>
//                                     <h3>No Attendance Records</h3>
//                                     <p>Attend events to see your history here</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {selectedEvent && (
//                     <FeedbackModal
//                         isOpen={showFeedbackModal}
//                         onClose={() => {
//                             setShowFeedbackModal(false);
//                             setSelectedEvent(null);
//                         }}
//                         onSuccess={() => {
//                             setShowFeedbackModal(false);
//                             setSelectedEvent(null);
//                             alert('Feedback submitted successfully!');
//                         }}
//                         eventId={selectedEvent.id}
//                         userId={user.id}
//                         eventTitle={selectedEvent.title}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default StudentDashboard;








// import React, { useState, useEffect } from 'react';
// import { ref, onValue } from 'firebase/database';
// import { database } from '../../config/firebase';
// import Header from '../common/Header';
// import Tabs from '../common/Tabs';
// import EventCard from '../common/EventCard';
// import FeedbackModal from '../modals/FeedbackModal';
// import { registerForEvent } from '../../services/eventService';
// import { markAttendance } from '../../services/attendanceService';
// import { useGeolocation } from '../../hooks/useGeolocation';
// import {
//     isEventActive,
//     isEventUpcoming,
//     isEventPast,
//     canRegisterForEvent,
//     canMarkAttendance,
//     canSubmitFeedback,
//     getTimeUntilEvent,
//     getRegistrationDeadline
// } from '../../utils/helpers';

// const StudentDashboard = ({ user, onLogout }) => {
//     const [activeTab, setActiveTab] = useState('upcoming');
//     const [events, setEvents] = useState({});
//     const [rooms, setRooms] = useState({});
//     const [attendance, setAttendance] = useState({});
//     const [registrations, setRegistrations] = useState({});
//     const [currentUser, setCurrentUser] = useState(user);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//     const { location, error, loading, getCurrentLocation } = useGeolocation();

//     useEffect(() => {
//         const eventsRef = ref(database, 'events');
//         const roomsRef = ref(database, 'rooms');
//         const attendanceRef = ref(database, 'attendance');
//         const userRef = ref(database, `users/${user.id}`);

//         // Listen to user data changes for real-time wallet updates
//         const unsubUser = onValue(userRef, (snapshot) => {
//             if (snapshot.exists()) {
//                 const userData = snapshot.val();
//                 setCurrentUser({ ...user, wallet: userData.wallet });

//                 // Update localStorage to sync wallet balance
//                 const savedUser = JSON.parse(localStorage.getItem('erp_user') || '{}');
//                 savedUser.wallet = userData.wallet;
//                 localStorage.setItem('erp_user', JSON.stringify(savedUser));
//             }
//         });

//         const unsubEvents = onValue(eventsRef, (snapshot) => {
//             const eventsData = snapshot.val() || {};
//             setEvents(eventsData);

//             // Extract registrations for current user from all events
//             const userRegs = {};
//             Object.entries(eventsData).forEach(([eventId, event]) => {
//                 if (event.registrations && event.registrations[user.id]) {
//                     userRegs[eventId] = event.registrations[user.id];
//                 }
//             });
//             setRegistrations(userRegs);
//         });

//         const unsubRooms = onValue(roomsRef, (snapshot) => {
//             setRooms(snapshot.val() || {});
//         });

//         const unsubAttendance = onValue(attendanceRef, (snapshot) => {
//             setAttendance(snapshot.val() || {});
//         });

//         return () => {
//             unsubUser();
//             unsubEvents();
//             unsubRooms();
//             unsubAttendance();
//         };
//     }, [user.id]);

//     const approvedEvents = Object.entries(events).filter(
//         ([id, e]) => e.institutionId === user.institutionId && e.status === 'approved'
//     );

//     const upcomingEvents = approvedEvents.filter(([id, e]) => isEventUpcoming(e));
//     const activeEvents = approvedEvents.filter(([id, e]) => isEventActive(e));
//     const pastEvents = approvedEvents.filter(([id, e]) => isEventPast(e));

//     const myAttendance = Object.entries(attendance)
//         .filter(([eventId, attendees]) => attendees[user.id])
//         .map(([eventId]) => eventId);

//     const handleRegister = async (eventId, event) => {
//         // Check if registration is still allowed
//         if (!canRegisterForEvent(event)) {
//             alert('Registration period has ended. Registration is only allowed before the event starts.');
//             return;
//         }

//         // Check if already registered
//         if (registrations[eventId]) {
//             alert('You are already registered for this event!');
//             return;
//         }

//         // Check wallet balance for paid events
//         if (event.isPaid && currentUser.wallet < event.fee) {
//             alert(`Insufficient wallet balance!\n\nRequired: ₹${event.fee}\nAvailable: ₹${currentUser.wallet}\nShortfall: ₹${event.fee - currentUser.wallet}`);
//             return;
//         }

//         // Show confirmation for paid events
//         if (event.isPaid && event.fee > 0) {
//             const confirmMsg = `Register for "${event.title}"?\n\nEvent Fee: ₹${event.fee}\nCurrent Balance: ₹${currentUser.wallet}\nBalance After: ₹${currentUser.wallet - event.fee}\n\nProceed with payment?`;
//             if (!confirm(confirmMsg)) {
//                 return;
//             }
//         }

//         const result = await registerForEvent(eventId, user.id, currentUser.wallet, event.fee || 0);

//         if (result.success) {
//             if (event.isPaid && event.fee > 0) {
//                 alert(`Registration Successful! ✓\n\nAmount Paid: ₹${event.fee}\nRemaining Balance: ₹${currentUser.wallet - event.fee}\n\nYou are now registered for "${event.title}"`);
//             } else {
//                 alert(`Successfully registered for "${event.title}"!`);
//             }
//         } else {
//             alert('Registration failed: ' + result.error);
//         }
//     };

//     const handleMarkAttendance = async (eventId, event) => {
//         // Check if already marked attendance
//         if (myAttendance.includes(eventId)) {
//             alert('You have already marked attendance for this event!');
//             return;
//         }

//         // Check if user is registered
//         if (!registrations[eventId]) {
//             alert('You must register for this event before marking attendance!');
//             return;
//         }

//         // Check if attendance marking is allowed (on event date, before start time)
//         if (!canMarkAttendance(event)) {
//             const now = new Date();
//             const eventStartDateTime = new Date(`${event.startDate}T${event.startTime}`);
//             const eventDate = new Date(event.startDate);
//             const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//             const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

//             if (today.getTime() !== eventDay.getTime()) {
//                 alert('Attendance can only be marked on the event date!');
//             } else if (now >= eventStartDateTime) {
//                 alert('Attendance marking period has ended. You must mark attendance before the event starts!');
//             } else {
//                 alert('Attendance marking is only allowed on the event date, before the event starts.');
//             }
//             return;
//         }

//         getCurrentLocation();

//         if (!location) {
//             alert('Please allow location access to mark attendance');
//             return;
//         }

//         const roomEntry = Object.entries(rooms).find(([id, r]) => r.name === event.roomName);

//         if (!roomEntry) {
//             alert('Room location not found');
//             return;
//         }

//         const [roomId, room] = roomEntry;
//         const roomLocation = {
//             latitude: parseFloat(room.latitude),
//             longitude: parseFloat(room.longitude)
//         };

//         const result = await markAttendance(eventId, user.id, location, roomLocation);

//         if (result.success) {
//             alert(`Attendance marked successfully! ✓\n\nDistance from venue: ${result.distance}m`);
//         } else {
//             alert(result.error);
//         }
//     };

//     const handleSubmitFeedback = (event) => {
//         setSelectedEvent(event);
//         setShowFeedbackModal(true);
//     };

//     const isRegistered = (eventId) => {
//         return !!registrations[eventId];
//     };

//     const tabs = [
//         { id: 'upcoming', label: `Upcoming (${upcomingEvents.length})` },
//         { id: 'attendance', label: `Mark Attendance` },
//         { id: 'past', label: `Past (${pastEvents.length})` },
//         { id: 'myregistrations', label: 'My Registrations' }
//     ];

//     return (
//         <div className="app-container">
//             <div className="dashboard">
//                 <Header title="Student Dashboard" user={currentUser} onLogout={onLogout} />

//                 <div className="wallet-display">
//                     <h3>💳 Wallet Balance</h3>
//                     <div className="wallet-amount">₹{currentUser.wallet || 0}</div>
//                     <p className="wallet-info">
//                         {currentUser.wallet > 0
//                             ? 'Use your wallet to register for paid events'
//                             : 'Wallet balance is low. Contact admin to add funds.'}
//                     </p>
//                 </div>

//                 <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

//                 {activeTab === 'upcoming' && (
//                     <div className="card">
//                         <h3>Upcoming Events - Register Now</h3>
//                         <div className="message message-info" style={{ marginBottom: '20px' }}>
//                             📝 You can register for events from creation date until the event starts.
//                             {currentUser.wallet > 0 && ` Your wallet balance: ₹${currentUser.wallet}`}
//                         </div>
//                         <div className="event-list">
//                             {upcomingEvents.map(([id, event]) => {
//                                 const canRegister = canRegisterForEvent(event);
//                                 const registered = isRegistered(id);
//                                 const timeUntil = getTimeUntilEvent(event);
//                                 const canAfford = !event.isPaid || currentUser.wallet >= (event.fee || 0);

//                                 return (
//                                     <EventCard
//                                         key={id}
//                                         event={event}
//                                         showStatus={false}
//                                         actions={
//                                             <div>
//                                                 {timeUntil && (
//                                                     <div style={{
//                                                         padding: '8px 12px',
//                                                         background: '#e3f2fd',
//                                                         borderRadius: '6px',
//                                                         marginBottom: '10px',
//                                                         fontSize: '13px',
//                                                         color: '#1976d2'
//                                                     }}>
//                                                         ⏰ Starts in: {timeUntil}
//                                                     </div>
//                                                 )}

//                                                 {event.isPaid && event.fee > 0 && (
//                                                     <div style={{
//                                                         padding: '8px 12px',
//                                                         background: canAfford ? '#fff3cd' : '#f8d7da',
//                                                         borderRadius: '6px',
//                                                         marginBottom: '10px',
//                                                         fontSize: '13px',
//                                                         color: canAfford ? '#856404' : '#721c24',
//                                                         fontWeight: '600'
//                                                     }}>
//                                                         💰 Event Fee: ₹{event.fee}
//                                                         {!canAfford && ` | Insufficient Balance (Need: ₹${event.fee - currentUser.wallet} more)`}
//                                                     </div>
//                                                 )}

//                                                 {registered ? (
//                                                     <div>
//                                                         <div style={{
//                                                             padding: '10px 15px',
//                                                             background: '#d4edda',
//                                                             color: '#155724',
//                                                             borderRadius: '6px',
//                                                             fontWeight: '600',
//                                                             textAlign: 'center'
//                                                         }}>
//                                                             ✓ Registered
//                                                             {registrations[id]?.amountPaid > 0 &&
//                                                                 ` | Paid: ₹${registrations[id].amountPaid}`
//                                                             }
//                                                         </div>
//                                                     </div>
//                                                 ) : canRegister ? (
//                                                     <div>
//                                                         <button
//                                                             onClick={() => handleRegister(id, event)}
//                                                             className="btn btn-primary"
//                                                             disabled={event.isPaid && !canAfford}
//                                                             style={{
//                                                                 opacity: (event.isPaid && !canAfford) ? 0.6 : 1,
//                                                                 cursor: (event.isPaid && !canAfford) ? 'not-allowed' : 'pointer'
//                                                             }}
//                                                         >
//                                                             {event.isPaid && event.fee > 0
//                                                                 ? `💳 Pay ₹${event.fee} & Register`
//                                                                 : '📝 Register Now (Free)'}
//                                                         </button>
//                                                         {canRegister && !registered && (
//                                                             <div style={{
//                                                                 fontSize: '12px',
//                                                                 color: '#666',
//                                                                 marginTop: '8px',
//                                                                 textAlign: 'center'
//                                                             }}>
//                                                                 Registration closes: {getRegistrationDeadline(event)}
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 ) : (
//                                                     <div style={{
//                                                         padding: '10px 15px',
//                                                         background: '#f8d7da',
//                                                         color: '#721c24',
//                                                         borderRadius: '6px',
//                                                         fontSize: '13px',
//                                                         textAlign: 'center'
//                                                     }}>
//                                                         ⚠️ Registration Closed
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         }
//                                     />
//                                 );
//                             })}
//                             {upcomingEvents.length === 0 && (
//                                 <div className="empty-state">
//                                     <div className="empty-state-icon">📅</div>
//                                     <h3>No Upcoming Events</h3>
//                                     <p>Check back later for new events</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {activeTab === 'attendance' && (
//                     <div className="card">
//                         <h3>Mark Attendance Today</h3>
//                         <div className="message message-warning" style={{ marginBottom: '20px' }}>
//                             📍 Attendance can only be marked on the event date, before the event starts. You must be registered to mark attendance.
//                         </div>
//                         <div className="event-list">
//                             {approvedEvents
//                                 .filter(([id, event]) => {
//                                     // Show events happening today where user is registered
//                                     const now = new Date();
//                                     const eventDate = new Date(event.startDate);
//                                     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//                                     const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

//                                     return today.getTime() === eventDay.getTime() && isRegistered(id);
//                                 })
//                                 .map(([id, event]) => {
//                                     const canMark = canMarkAttendance(event);
//                                     const hasAttended = myAttendance.includes(id);
//                                     const registered = isRegistered(id);

//                                     return (
//                                         <EventCard
//                                             key={id}
//                                             event={event}
//                                             showStatus={false}
//                                             actions={
//                                                 <div>
//                                                     {hasAttended ? (
//                                                         <div style={{
//                                                             padding: '10px 15px',
//                                                             background: '#d4edda',
//                                                             color: '#155724',
//                                                             borderRadius: '6px',
//                                                             fontWeight: '600',
//                                                             textAlign: 'center'
//                                                         }}>
//                                                             ✓ Attendance Marked
//                                                         </div>
//                                                     ) : !registered ? (
//                                                         <div style={{
//                                                             padding: '10px 15px',
//                                                             background: '#fff3cd',
//                                                             color: '#856404',
//                                                             borderRadius: '6px',
//                                                             fontSize: '13px',
//                                                             textAlign: 'center'
//                                                         }}>
//                                                             ⚠️ Not Registered
//                                                         </div>
//                                                     ) : canMark ? (
//                                                         <button
//                                                             onClick={() => handleMarkAttendance(id, event)}
//                                                             className="btn btn-success"
//                                                         >
//                                                             📍 Mark Attendance Now
//                                                         </button>
//                                                     ) : (
//                                                         <div style={{
//                                                             padding: '10px 15px',
//                                                             background: '#f8d7da',
//                                                             color: '#721c24',
//                                                             borderRadius: '6px',
//                                                             fontSize: '13px',
//                                                             textAlign: 'center'
//                                                         }}>
//                                                             ⚠️ Attendance Period Ended
//                                                         </div>
//                                                     )}
//                                                     <div style={{
//                                                         fontSize: '12px',
//                                                         color: '#666',
//                                                         marginTop: '8px',
//                                                         textAlign: 'center'
//                                                     }}>
//                                                         Event starts: {event.startTime}
//                                                     </div>
//                                                 </div>
//                                             }
//                                         />
//                                     );
//                                 })}
//                             {approvedEvents.filter(([id, event]) => {
//                                 const now = new Date();
//                                 const eventDate = new Date(event.startDate);
//                                 const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//                                 const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
//                                 return today.getTime() === eventDay.getTime() && isRegistered(id);
//                             }).length === 0 && (
//                                     <div className="empty-state">
//                                         <div className="empty-state-icon">📍</div>
//                                         <h3>No Events Today</h3>
//                                         <p>No registered events scheduled for today</p>
//                                     </div>
//                                 )}
//                         </div>
//                     </div>
//                 )}

//                 {activeTab === 'past' && (
//                     <div className="card">
//                         <h3>Past Events</h3>
//                         <div className="event-list">
//                             {pastEvents.map(([id, event]) => (
//                                 <EventCard
//                                     key={id}
//                                     event={event}
//                                     showStatus={false}
//                                     actions={
//                                         myAttendance.includes(id) && (
//                                             <button
//                                                 onClick={() => handleSubmitFeedback({ id, ...event })}
//                                                 className="btn btn-warning"
//                                             >
//                                                 ⭐ Submit Feedback
//                                             </button>
//                                         )
//                                     }
//                                 />
//                             ))}
//                             {pastEvents.length === 0 && (
//                                 <p style={{ textAlign: 'center', color: '#999' }}>No past events</p>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {activeTab === 'myregistrations' && (
//                     <div className="card">
//                         <h3>My Event Registrations</h3>
//                         <div className="message message-info" style={{ marginBottom: '20px' }}>
//                             📊 Total Registrations: {Object.keys(registrations).length} |
//                             Total Amount Spent: ₹{Object.values(registrations).reduce((sum, reg) => sum + (reg.amountPaid || 0), 0)}
//                         </div>
//                         <div className="event-list">
//                             {Object.entries(registrations).map(([eventId, registration]) => {
//                                 const event = events[eventId];
//                                 if (!event) return null;

//                                 const hasAttended = myAttendance.includes(eventId);
//                                 const isPast = isEventPast(event);
//                                 const canAttend = canMarkAttendance(event);

//                                 return (
//                                     <EventCard
//                                         key={eventId}
//                                         event={event}
//                                         showStatus={false}
//                                         actions={
//                                             <div>
//                                                 <div style={{
//                                                     padding: '8px 12px',
//                                                     background: '#e3f2fd',
//                                                     borderRadius: '6px',
//                                                     marginBottom: '10px',
//                                                     fontSize: '13px',
//                                                     color: '#1976d2'
//                                                 }}>
//                                                     📝 Registered: {new Date(registration.registeredAt).toLocaleDateString('en-IN')}
//                                                     {registration.amountPaid > 0 &&
//                                                         ` | 💰 Paid: ₹${registration.amountPaid}`
//                                                     }
//                                                 </div>
//                                                 {hasAttended && (
//                                                     <div style={{
//                                                         padding: '8px 12px',
//                                                         background: '#d4edda',
//                                                         color: '#155724',
//                                                         borderRadius: '6px',
//                                                         fontSize: '13px',
//                                                         marginBottom: '10px',
//                                                         fontWeight: '600'
//                                                     }}>
//                                                         ✓ Attendance Marked
//                                                     </div>
//                                                 )}
//                                                 {!hasAttended && !isPast && canAttend && (
//                                                     <button
//                                                         onClick={() => handleMarkAttendance(eventId, event)}
//                                                         className="btn btn-success"
//                                                     >
//                                                         📍 Mark Attendance Now
//                                                     </button>
//                                                 )}
//                                             </div>
//                                         }
//                                     />
//                                 );
//                             })}
//                             {Object.keys(registrations).length === 0 && (
//                                 <div className="empty-state">
//                                     <div className="empty-state-icon">📋</div>
//                                     <h3>No Registrations Yet</h3>
//                                     <p>Register for upcoming events to see them here</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {selectedEvent && (
//                     <FeedbackModal
//                         isOpen={showFeedbackModal}
//                         onClose={() => {
//                             setShowFeedbackModal(false);
//                             setSelectedEvent(null);
//                         }}
//                         onSuccess={() => {
//                             setShowFeedbackModal(false);
//                             setSelectedEvent(null);
//                             alert('Feedback submitted successfully!');
//                         }}
//                         eventId={selectedEvent.id}
//                         userId={user.id}
//                         eventTitle={selectedEvent.title}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default StudentDashboard;









// Updated StudentDashboard.jsx with radius-based attendance

import React, { useState, useEffect } from 'react';
import { ref, onValue, get } from 'firebase/database';
import { database } from '../../config/firebase';
import Header from '../common/Header';
import StatCard from '../common/StatCard';
import Tabs from '../common/Tabs';
import EventCard from '../common/EventCard';
import FeedbackModal from '../modals/FeedbackModal';
import { markAttendance } from '../../services/attendanceService';
import { registerForEvent } from '../../services/eventService';
import {
    isEventActive,
    isEventUpcoming,
    isEventPast,
    canRegisterForEvent,
    canMarkAttendance,
    canSubmitFeedback,
    formatDate
} from '../../utils/helpers';
import { useGeolocation } from '../../hooks/useGeolocation';

const StudentDashboard = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('available');
    const [events, setEvents] = useState({});
    const [attendance, setAttendance] = useState({});
    const [rooms, setRooms] = useState({});
    const [feedback, setFeedback] = useState({});
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [markingAttendance, setMarkingAttendance] = useState({});
    const [registering, setRegistering] = useState({});

    const { location, error: locationError, loading: locationLoading, getCurrentLocation } = useGeolocation();

    useEffect(() => {
        const eventsRef = ref(database, 'events');
        const attendanceRef = ref(database, 'attendance');
        const roomsRef = ref(database, 'rooms');
        const feedbackRef = ref(database, 'feedback');

        const unsubEvents = onValue(eventsRef, (snapshot) => {
            setEvents(snapshot.val() || {});
        });

        const unsubAttendance = onValue(attendanceRef, (snapshot) => {
            setAttendance(snapshot.val() || {});
        });

        const unsubRooms = onValue(roomsRef, (snapshot) => {
            setRooms(snapshot.val() || {});
        });

        const unsubFeedback = onValue(feedbackRef, (snapshot) => {
            setFeedback(snapshot.val() || {});
        });

        return () => {
            unsubEvents();
            unsubAttendance();
            unsubRooms();
            unsubFeedback();
        };
    }, [user.institutionId]);

    // Filter events for this institution
    const institutionEvents = Object.entries(events).filter(
        ([id, e]) => e.institutionId === user.institutionId && e.status === 'approved'
    );

    // Available events for registration
    const availableEvents = institutionEvents.filter(([id, e]) =>
        canRegisterForEvent(e) && !e.registrations?.[user.id]
    );

    // My registered events
    const myRegisteredEvents = institutionEvents.filter(([id, e]) =>
        e.registrations?.[user.id]
    );

    // Events I attended
    const myAttendedEvents = institutionEvents.filter(([id, e]) =>
        attendance[id]?.[user.id]
    );

    // Past events where I can give feedback
    const feedbackPendingEvents = myAttendedEvents.filter(([id, e]) => {
        const eventEndTime = new Date(`${e.endDate}T${e.endTime}`).getTime();
        return isEventPast(e) &&
            !feedback[id]?.[user.id] &&
            canSubmitFeedback(eventEndTime);
    });

    const handleRegister = async (eventId, event) => {
        if (!event.registrations?.[user.id]) {
            const confirmMsg = event.isPaid
                ? `Register for "${event.title}"?\n\nFee: ₹${event.fee}\nYour wallet balance: ₹${user.wallet || 0}`
                : `Register for "${event.title}"?`;

            if (window.confirm(confirmMsg)) {
                setRegistering({ ...registering, [eventId]: true });

                const result = await registerForEvent(
                    eventId,
                    user.id,
                    user.wallet || 0,
                    event.isPaid ? event.fee : 0
                );

                setRegistering({ ...registering, [eventId]: false });

                if (result.success) {
                    alert(`Successfully registered for ${event.title}!${event.isPaid ? ` ₹${event.fee} deducted from wallet.` : ''}`);
                    // Reload user data to update wallet
                    window.location.reload();
                } else {
                    alert('Registration failed: ' + result.error);
                }
            }
        }
    };

    const handleMarkAttendance = async (eventId, event) => {
        // Check if already marked
        if (attendance[eventId]?.[user.id]) {
            const existingAttendance = attendance[eventId][user.id];
            alert(`You have already marked attendance for this event.\n\nStatus: ${existingAttendance.status?.toUpperCase()}\nDistance: ${existingAttendance.distance}m\nMarked at: ${new Date(existingAttendance.timestamp).toLocaleString('en-IN')}`);
            return;
        }

        // Check if can mark attendance
        if (!canMarkAttendance(event)) {
            alert('Attendance can only be marked on the event date, before the event starts.');
            return;
        }

        // Check if registered
        if (!event.registrations?.[user.id]) {
            alert('You must register for this event before marking attendance.');
            return;
        }

        setMarkingAttendance({ ...markingAttendance, [eventId]: true });

        // Get current location
        getCurrentLocation();

        // Wait for location
        if (!location) {
            alert('Getting your location... Please try again in a moment.');
            setMarkingAttendance({ ...markingAttendance, [eventId]: false });
            return;
        }

        if (locationError) {
            alert('Location error: ' + locationError + '\n\nPlease enable location services and try again.');
            setMarkingAttendance({ ...markingAttendance, [eventId]: false });
            return;
        }

        // Get room data
        const room = rooms[event.roomId];
        if (!room) {
            alert('Room information not found. Please contact admin.');
            setMarkingAttendance({ ...markingAttendance, [eventId]: false });
            return;
        }

        const roomLocation = {
            latitude: parseFloat(room.latitude),
            longitude: parseFloat(room.longitude)
        };

        const roomRadius = parseFloat(room.radius) || 100;

        // Mark attendance with radius check
        const result = await markAttendance(
            eventId,
            user.id,
            location,
            roomLocation,
            roomRadius
        );

        setMarkingAttendance({ ...markingAttendance, [eventId]: false });

        if (result.marked) {
            // Attendance was marked, but check status
            if (result.status === 'absent') {
                // Student is OUTSIDE the allowed radius - marked as ABSENT
                alert(
                    `⚠️ MARKED AS ABSENT\n\n` +
                    `You are OUTSIDE the allowed radius!\n\n` +
                    `📍 Your distance from venue: ${result.distance}m\n` +
                    `📏 Maximum allowed radius: ${roomRadius}m\n` +
                    `❌ Difference: ${result.distance - roomRadius}m too far\n\n` +
                    `You have been marked as ABSENT for this event.\n\n` +
                    `⚠️ This attendance record will show as ABSENT in all reports.\n` +
                    `Please be within ${roomRadius}m of the event location to be marked present.`
                );
            } else {
                // Student is WITHIN radius - marked as PRESENT
                alert(
                    `✅ Attendance Marked Successfully!\n\n` +
                    `Status: PRESENT ✓\n\n` +
                    `📍 Distance from venue: ${result.distance}m\n` +
                    `📏 Allowed radius: ${roomRadius}m\n` +
                    `✓ You are ${roomRadius - result.distance}m within the allowed zone\n\n` +
                    `Room: ${event.roomName}\n` +
                    `Time: ${new Date().toLocaleTimeString('en-IN')}`
                );
            }
        } else {
            alert('Failed to mark attendance: ' + (result.error || 'Unknown error'));
        }
    };

    const openFeedbackModal = (eventId, event) => {
        setSelectedEvent({ id: eventId, ...event });
        setShowFeedbackModal(true);
    };

    const getAttendanceStatus = (eventId) => {
        const att = attendance[eventId]?.[user.id];
        if (!att) return null;
        return att.status;
    };

    const getAttendanceInfo = (eventId) => {
        const att = attendance[eventId]?.[user.id];
        if (!att) return null;
        return {
            status: att.status,
            distance: att.distance,
            timestamp: att.timestamp,
            roomRadius: att.roomRadius
        };
    };

    const tabs = [
        { id: 'available', label: `Available (${availableEvents.length})` },
        { id: 'registered', label: `Registered (${myRegisteredEvents.length})` },
        { id: 'attended', label: `Attended (${myAttendedEvents.length})` },
        { id: 'feedback', label: `Feedback Pending (${feedbackPendingEvents.length})` }
    ];

    return (
        <div className="app-container">
            <div className="dashboard">
                <Header title="Student Dashboard" user={user} onLogout={onLogout} />

                <div className="dashboard-content">
                    <StatCard
                        title="Wallet Balance"
                        value={`₹${user.wallet || 0}`}
                        icon="💰"
                        color="success"
                    />
                    <StatCard
                        title="Registered Events"
                        value={myRegisteredEvents.length}
                        icon="📝"
                        color="primary"
                    />
                    <StatCard
                        title="Events Attended"
                        value={myAttendedEvents.length}
                        icon="✓"
                        color="success"
                    />
                    <StatCard
                        title="Feedback Pending"
                        value={feedbackPendingEvents.length}
                        icon="💬"
                        color="warning"
                    />
                </div>

                <div className="card">
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                    {activeTab === 'available' && (
                        <div className="event-list">
                            {availableEvents.length > 0 ? (
                                availableEvents.map(([eventId, event]) => (
                                    <EventCard
                                        key={eventId}
                                        event={event}
                                        showStatus={false}
                                        actions={
                                            <button
                                                onClick={() => handleRegister(eventId, event)}
                                                className="btn btn-primary"
                                                disabled={registering[eventId]}
                                            >
                                                {registering[eventId] ? 'Registering...' :
                                                    event.isPaid ? `Register (₹${event.fee})` : 'Register'}
                                            </button>
                                        }
                                    />
                                ))
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-state-icon">🔍</div>
                                    <h3>No Events Available</h3>
                                    <p>Check back later for new events</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'registered' && (
                        <div className="event-list">
                            {myRegisteredEvents.length > 0 ? (
                                myRegisteredEvents.map(([eventId, event]) => {
                                    const attStatus = getAttendanceStatus(eventId);
                                    const attInfo = getAttendanceInfo(eventId);

                                    return (
                                        <EventCard
                                            key={eventId}
                                            event={event}
                                            showStatus={false}
                                            actions={
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    {attStatus ? (
                                                        <div style={{
                                                            padding: '12px',
                                                            borderRadius: '8px',
                                                            background: attStatus === 'present' ? '#d4edda' : '#f8d7da',
                                                            border: `2px solid ${attStatus === 'present' ? '#28a745' : '#dc3545'}`
                                                        }}>
                                                            <div style={{
                                                                fontWeight: 'bold',
                                                                fontSize: '16px',
                                                                color: attStatus === 'present' ? '#155724' : '#721c24',
                                                                marginBottom: '5px'
                                                            }}>
                                                                {attStatus === 'present' ? '✓ PRESENT' : '✗ ABSENT'}
                                                            </div>
                                                            <div style={{ fontSize: '12px', color: '#666' }}>
                                                                Distance: {attInfo.distance}m (Radius: {attInfo.roomRadius || 100}m)
                                                            </div>
                                                            <div style={{ fontSize: '11px', color: '#999' }}>
                                                                Marked: {new Date(attInfo.timestamp).toLocaleString('en-IN')}
                                                            </div>
                                                        </div>
                                                    ) : canMarkAttendance(event) ? (
                                                        <button
                                                            onClick={() => handleMarkAttendance(eventId, event)}
                                                            className="btn btn-success"
                                                            disabled={markingAttendance[eventId]}
                                                        >
                                                            {markingAttendance[eventId] ? 'Marking...' : '✓ Mark Attendance'}
                                                        </button>
                                                    ) : isEventPast(event) ? (
                                                        <div className="message message-warning">
                                                            Event has ended
                                                        </div>
                                                    ) : (
                                                        <div className="message message-info">
                                                            Attendance opens on {formatDate(event.startDate)}
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                        />
                                    );
                                })
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-state-icon">📝</div>
                                    <h3>No Registered Events</h3>
                                    <p>Register for events from the Available tab</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'attended' && (
                        <div className="event-list">
                            {myAttendedEvents.length > 0 ? (
                                myAttendedEvents.map(([eventId, event]) => {
                                    const attInfo = getAttendanceInfo(eventId);
                                    return (
                                        <EventCard
                                            key={eventId}
                                            event={event}
                                            showStatus={false}
                                            actions={
                                                <div style={{
                                                    padding: '10px',
                                                    background: attInfo.status === 'present' ? '#d4edda' : '#f8d7da',
                                                    borderRadius: '6px',
                                                    fontSize: '14px'
                                                }}>
                                                    <strong>Status: </strong>
                                                    <span style={{
                                                        color: attInfo.status === 'present' ? '#155724' : '#721c24',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {attInfo.status === 'present' ? 'PRESENT' : 'ABSENT'}
                                                    </span>
                                                    <div style={{ fontSize: '12px', marginTop: '5px', color: '#666' }}>
                                                        Distance: {attInfo.distance}m | Marked: {new Date(attInfo.timestamp).toLocaleString('en-IN')}
                                                    </div>
                                                </div>
                                            }
                                        />
                                    );
                                })
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-state-icon">✓</div>
                                    <h3>No Attended Events</h3>
                                    <p>Mark attendance for registered events</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'feedback' && (
                        <div className="event-list">
                            {feedbackPendingEvents.length > 0 ? (
                                feedbackPendingEvents.map(([eventId, event]) => (
                                    <EventCard
                                        key={eventId}
                                        event={event}
                                        showStatus={false}
                                        actions={
                                            <button
                                                onClick={() => openFeedbackModal(eventId, event)}
                                                className="btn btn-warning"
                                            >
                                                💬 Submit Feedback
                                            </button>
                                        }
                                    />
                                ))
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-state-icon">✓</div>
                                    <h3>No Pending Feedback</h3>
                                    <p>You've submitted feedback for all attended events</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showFeedbackModal && selectedEvent && (
                <FeedbackModal
                    isOpen={showFeedbackModal}
                    onClose={() => {
                        setShowFeedbackModal(false);
                        setSelectedEvent(null);
                    }}
                    onSuccess={() => {
                        setShowFeedbackModal(false);
                        setSelectedEvent(null);
                    }}
                    eventId={selectedEvent.id}
                    userId={user.id}
                    eventTitle={selectedEvent.title}
                />
            )}
        </div>
    );
};

export default StudentDashboard;