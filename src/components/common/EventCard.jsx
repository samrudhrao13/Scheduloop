// import React from 'react';
// import { formatDate, formatTime, getStatusBadgeClass } from '../../utils/helpers';

// const EventCard = ({ event, actions, showStatus = true }) => {
//     return (
//         <div className="event-item">
//             <h4>{event.title}</h4>

//             <div className="event-meta">
//                 <div className="event-meta-item">
//                     <strong>Type:</strong> {event.type}
//                 </div>
//                 <div className="event-meta-item">
//                     <strong>Room:</strong> {event.roomName}
//                 </div>
//                 <div className="event-meta-item">
//                     <strong>Date:</strong> {formatDate(event.startDate)}
//                 </div>
//                 <div className="event-meta-item">
//                     <strong>Time:</strong> {event.startTime} - {event.endTime}
//                 </div>
//             </div>

//             {event.description && (
//                 <p><strong>Description:</strong> {event.description}</p>
//             )}

//             {event.guestNames && (
//                 <p><strong>Guests:</strong> {event.guestNames}</p>
//             )}

//             {event.isPaid && (
//                 <p><strong>Fee:</strong> ₹{event.fee}</p>
//             )}

//             {showStatus && (
//                 <div style={{ marginTop: '10px' }}>
//                     <span className={`badge badge-${getStatusBadgeClass(event.status)}`}>
//                         {event.status.replace(/_/g, ' ').toUpperCase()}
//                     </span>
//                 </div>
//             )}

//             {event.rejectionReason && (
//                 <div className="message message-error" style={{ marginTop: '10px' }}>
//                     <strong>Rejection Reason:</strong> {event.rejectionReason}
//                 </div>
//             )}

//             {actions && (
//                 <div className="event-actions">
//                     {actions}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default EventCard;







import React, { useState, useEffect } from 'react';
import { formatDate, formatTime, getStatusBadgeClass } from '../../utils/helpers';

const EventCard = ({ event, actions, showStatus = true }) => {
    const [imageData, setImageData] = useState(null);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        // Load image from localStorage when event has imagePath
        if (event.imagePath) {
            try {
                const storedImage = localStorage.getItem(`event_image_${event.imagePath}`);
                if (storedImage) {
                    setImageData(storedImage);
                    setImageError(false);
                } else {
                    setImageError(true);
                }
            } catch (error) {
                console.error('Error loading image from localStorage:', error);
                setImageError(true);
            }
        }
    }, [event.imagePath]);

    return (
        <div className="event-item">
            {event.imagePath && imageData && !imageError && (
                <div style={{
                    width: '100%',
                    height: '200px',
                    marginBottom: '15px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <img
                        src={imageData}
                        alt={event.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                        onError={() => {
                            setImageError(true);
                        }}
                    />
                </div>
            )}

            {event.imagePath && imageError && (
                <div style={{
                    width: '100%',
                    height: '200px',
                    marginBottom: '15px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px'
                }}>
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '10px' }}>📷</div>
                        <div>Image not available</div>
                    </div>
                </div>
            )}

            <h4>{event.title}</h4>

            <div className="event-meta">
                <div className="event-meta-item">
                    <strong>Type:</strong> {event.type}
                </div>
                <div className="event-meta-item">
                    <strong>Room:</strong> {event.roomName}
                </div>
                <div className="event-meta-item">
                    <strong>Date:</strong> {formatDate(event.startDate)}
                </div>
                <div className="event-meta-item">
                    <strong>Time:</strong> {event.startTime} - {event.endTime}
                </div>
            </div>

            {event.description && (
                <p><strong>Description:</strong> {event.description}</p>
            )}

            {event.guestNames && (
                <p><strong>Guests:</strong> {event.guestNames}</p>
            )}

            {event.isPaid && (
                <p><strong>Fee:</strong> ₹{event.fee}</p>
            )}

            {showStatus && (
                <div style={{ marginTop: '10px' }}>
                    <span className={`badge badge-${getStatusBadgeClass(event.status)}`}>
                        {event.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                </div>
            )}

            {event.rejectionReason && (
                <div className="message message-error" style={{ marginTop: '10px' }}>
                    <strong>Rejection Reason:</strong> {event.rejectionReason}
                </div>
            )}

            {actions && (
                <div className="event-actions">
                    {actions}
                </div>
            )}
        </div>
    );
};

export default EventCard;