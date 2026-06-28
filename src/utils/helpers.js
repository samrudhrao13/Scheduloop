// export const generateId = () => {
//     return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
// };

// export const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371e3; // Earth's radius in meters
//     const φ1 = (lat1 * Math.PI) / 180;
//     const φ2 = (lat2 * Math.PI) / 180;
//     const Δφ = ((lat2 - lat1) * Math.PI) / 180;
//     const Δλ = ((lon2 - lon1) * Math.PI) / 180;

//     const a =
//         Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//         Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c; // Distance in meters
// };

// export const formatDate = (timestamp) => {
//     return new Date(timestamp).toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//     });
// };

// export const formatTime = (time) => {
//     return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-IN', {
//         hour: '2-digit',
//         minute: '2-digit'
//     });
// };

// export const isEventActive = (event) => {
//     const now = new Date();
//     const startDate = new Date(event.startDate);
//     const endDate = new Date(event.endDate);
//     return now >= startDate && now <= endDate;
// };

// export const isEventUpcoming = (event) => {
//     const now = new Date();
//     const startDate = new Date(event.startDate);
//     return startDate > now;
// };

// export const canSubmitFeedback = (eventEndTime) => {
//     const now = Date.now();
//     const feedbackDeadline = eventEndTime + (48 * 60 * 60 * 1000); // 48 hours
//     return now <= feedbackDeadline;
// };

// export const getStatusBadgeClass = (status) => {
//     if (status === 'approved') return 'badge-approved';
//     if (status.includes('rejected')) return 'badge-rejected';
//     return 'badge-pending';
// };

// export const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
// };

// export const getRoomAvailability = (rooms, events, selectedDate, selectedTime) => {
//     const bookedRooms = events
//         .filter(e => e.startDate === selectedDate && e.startTime === selectedTime)
//         .map(e => e.roomId);

//     return Object.entries(rooms)
//         .filter(([id]) => !bookedRooms.includes(id))
//         .map(([id, room]) => ({ id, ...room }));
// };






export const generateId = () => {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
};

export const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatDateTime = (dateStr, timeStr) => {
    return new Date(`${dateStr}T${timeStr}`);
};

// Check if event is currently happening (between start and end time on event date)
export const isEventActive = (event) => {
    const now = new Date();
    const eventStartDateTime = new Date(`${event.startDate}T${event.startTime}`);
    const eventEndDateTime = new Date(`${event.endDate}T${event.endTime}`);
    return now >= eventStartDateTime && now <= eventEndDateTime;
};

// Check if event hasn't started yet
export const isEventUpcoming = (event) => {
    const now = new Date();
    const eventStartDateTime = new Date(`${event.startDate}T${event.startTime}`);
    return eventStartDateTime > now;
};

// Check if event has ended
export const isEventPast = (event) => {
    const now = new Date();
    const eventEndDateTime = new Date(`${event.endDate}T${event.endTime}`);
    return now > eventEndDateTime;
};

// Check if registration is allowed (from creation date until event start time)
export const canRegisterForEvent = (event) => {
    const now = new Date();
    const eventStartDateTime = new Date(`${event.startDate}T${event.startTime}`);
    const eventCreatedAt = new Date(event.createdAt);

    // Can register if:
    // 1. Current time is after event creation
    // 2. Current time is before event start time
    return now >= eventCreatedAt && now < eventStartDateTime;
};

// Check if attendance marking is allowed (on event date, before event start time)
export const canMarkAttendance = (event) => {
    const now = new Date();
    const eventStartDateTime = new Date(`${event.startDate}T${event.startTime}`);
    const eventStartDate = new Date(event.startDate);

    // Set time to start of day for date comparison
    const todayStartOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventStartOfDay = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth(), eventStartDate.getDate());

    // Can mark attendance if:
    // 1. Today is the event date
    // 2. Current time is before event start time
    return todayStartOfDay.getTime() === eventStartOfDay.getTime() && now < eventStartDateTime;
};

// Get time remaining until event starts
export const getTimeUntilEvent = (event) => {
    const now = new Date();
    const eventStartDateTime = new Date(`${event.startDate}T${event.startTime}`);
    const diff = eventStartDateTime - now;

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
};

// Get registration deadline message
export const getRegistrationDeadline = (event) => {
    const eventStartDateTime = new Date(`${event.startDate}T${event.startTime}`);
    return formatDate(event.startDate) + ' at ' + event.startTime;
};

export const canSubmitFeedback = (eventEndTime) => {
    const now = Date.now();
    const feedbackDeadline = eventEndTime + (48 * 60 * 60 * 1000); // 48 hours
    return now <= feedbackDeadline;
};

export const getStatusBadgeClass = (status) => {
    if (status === 'approved') return 'badge-approved';
    if (status.includes('rejected')) return 'badge-rejected';
    return 'badge-pending';
};

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const getRoomAvailability = (rooms, events, selectedDate, selectedTime) => {
    const bookedRooms = events
        .filter(e => e.startDate === selectedDate && e.startTime === selectedTime)
        .map(e => e.roomId);

    return Object.entries(rooms)
        .filter(([id]) => !bookedRooms.includes(id))
        .map(([id, room]) => ({ id, ...room }));
};