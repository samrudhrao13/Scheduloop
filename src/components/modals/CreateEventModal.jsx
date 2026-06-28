// import React, { useState, useEffect } from 'react';
// import Modal from '../common/Modal';
// import { createEvent } from '../../services/eventService';
// import { getRoomsByInstitution, checkRoomAvailability } from '../../services/roomService';
// import { EVENT_TYPES } from '../../utils/constants';

// const CreateEventModal = ({ isOpen, onClose, onSuccess, institutionId, creatorId }) => {
//     const [formData, setFormData] = useState({
//         title: '',
//         type: 'Seminar',
//         roomId: '',
//         roomName: '',
//         startDate: '',
//         endDate: '',
//         startTime: '',
//         endTime: '',
//         description: '',
//         guestNames: '',
//         isPaid: false,
//         fee: 0
//     });
//     const [rooms, setRooms] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [roomWarning, setRoomWarning] = useState('');

//     useEffect(() => {
//         if (isOpen) {
//             loadRooms();
//         }
//     }, [isOpen, institutionId]);

//     const loadRooms = async () => {
//         const roomsData = await getRoomsByInstitution(institutionId);
//         setRooms(Object.entries(roomsData).map(([id, room]) => ({ id, ...room })));
//     };

//     const handleRoomChange = async (roomId) => {
//         const selectedRoom = rooms.find(r => r.id === roomId);
//         if (selectedRoom) {
//             setFormData({
//                 ...formData,
//                 roomId,
//                 roomName: selectedRoom.name
//             });

//             // Check availability if date and time are selected
//             if (formData.startDate && formData.startTime && formData.endTime) {
//                 const availability = await checkRoomAvailability(
//                     roomId,
//                     formData.startDate,
//                     formData.startTime,
//                     formData.endTime
//                 );

//                 if (!availability.available) {
//                     setRoomWarning('⚠️ This room has conflicting bookings at this time!');
//                 } else {
//                     setRoomWarning('');
//                 }
//             }
//         }
//     };

//     const handleSubmit = async () => {
//         if (!formData.title || !formData.roomId || !formData.startDate || !formData.endDate ||
//             !formData.startTime || !formData.endTime) {
//             setError('Please fill in all required fields');
//             return;
//         }

//         if (formData.isPaid && (!formData.fee || formData.fee <= 0)) {
//             setError('Please enter a valid fee amount');
//             return;
//         }

//         setLoading(true);
//         setError('');

//         const result = await createEvent(formData, creatorId, institutionId);

//         setLoading(false);

//         if (result.success) {
//             onSuccess();
//             onClose();
//             setFormData({
//                 title: '',
//                 type: 'Seminar',
//                 roomId: '',
//                 roomName: '',
//                 startDate: '',
//                 endDate: '',
//                 startTime: '',
//                 endTime: '',
//                 description: '',
//                 guestNames: '',
//                 isPaid: false,
//                 fee: 0
//             });
//             setRoomWarning('');
//         } else {
//             setError(result.error);
//         }
//     };

//     return (
//         <Modal isOpen={isOpen} onClose={onClose} title="Create New Event" size="large">
//             {error && <div className="message message-error">{error}</div>}
//             {roomWarning && <div className="message message-warning">{roomWarning}</div>}

//             <div className="form-group">
//                 <label>Event Title *</label>
//                 <input
//                     value={formData.title}
//                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                     placeholder="Enter event title"
//                 />
//             </div>

//             <div className="grid-2">
//                 <div className="form-group">
//                     <label>Event Type *</label>
//                     <select
//                         value={formData.type}
//                         onChange={(e) => setFormData({ ...formData, type: e.target.value })}
//                     >
//                         {EVENT_TYPES.map(type => (
//                             <option key={type} value={type}>{type}</option>
//                         ))}
//                     </select>
//                 </div>

//                 <div className="form-group">
//                     <label>Event Room *</label>
//                     <select
//                         value={formData.roomId}
//                         onChange={(e) => handleRoomChange(e.target.value)}
//                     >
//                         <option value="">Select Room</option>
//                         {rooms.map(room => (
//                             <option key={room.id} value={room.id}>
//                                 {room.name} (Capacity: {room.capacity})
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//             </div>

//             <div className="grid-2">
//                 <div className="form-group">
//                     <label>Start Date *</label>
//                     <input
//                         type="date"
//                         value={formData.startDate}
//                         onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
//                         min={new Date().toISOString().split('T')[0]}
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label>End Date *</label>
//                     <input
//                         type="date"
//                         value={formData.endDate}
//                         onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
//                         min={formData.startDate || new Date().toISOString().split('T')[0]}
//                     />
//                 </div>
//             </div>

//             <div className="grid-2">
//                 <div className="form-group">
//                     <label>Start Time *</label>
//                     <input
//                         type="time"
//                         value={formData.startTime}
//                         onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label>End Time *</label>
//                     <input
//                         type="time"
//                         value={formData.endTime}
//                         onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
//                     />
//                 </div>
//             </div>

//             <div className="form-group">
//                 <label>Description</label>
//                 <textarea
//                     value={formData.description}
//                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                     placeholder="Event description and details"
//                     rows="3"
//                 />
//             </div>

//             <div className="form-group">
//                 <label>Guest Names (Optional)</label>
//                 <input
//                     value={formData.guestNames}
//                     onChange={(e) => setFormData({ ...formData, guestNames: e.target.value })}
//                     placeholder="e.g., Dr. John Doe, Prof. Jane Smith"
//                 />
//             </div>

//             <div className="form-check">
//                 <input
//                     type="checkbox"
//                     id="isPaid"
//                     checked={formData.isPaid}
//                     onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
//                 />
//                 <label htmlFor="isPaid">This is a paid event</label>
//             </div>

//             {formData.isPaid && (
//                 <div className="form-group">
//                     <label>Event Fee (₹) *</label>
//                     <input
//                         type="number"
//                         value={formData.fee}
//                         onChange={(e) => setFormData({ ...formData, fee: parseFloat(e.target.value) || 0 })}
//                         placeholder="Enter fee amount"
//                         min="0"
//                     />
//                 </div>
//             )}

//             <div className="message message-info">
//                 Event will be sent for approval through the hierarchy: HOD → Principal → Admin
//             </div>

//             <div className="modal-footer">
//                 <button onClick={onClose} className="btn btn-secondary" disabled={loading}>
//                     Cancel
//                 </button>
//                 <button onClick={handleSubmit} className="btn btn-success" disabled={loading}>
//                     {loading ? 'Creating...' : 'Create Event'}
//                 </button>
//             </div>
//         </Modal>
//     );
// };

// export default CreateEventModal;






import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { createEvent } from '../../services/eventService';
import { getRoomsByInstitution, checkRoomAvailability } from '../../services/roomService';
import { EVENT_TYPES } from '../../utils/constants';

const CreateEventModal = ({ isOpen, onClose, onSuccess, institutionId, creatorId }) => {
    const [formData, setFormData] = useState({
        title: '',
        type: 'Seminar',
        roomId: '',
        roomName: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        description: '',
        guestNames: '',
        isPaid: false,
        fee: 0,
        imagePath: ''
    });
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [roomWarning, setRoomWarning] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (isOpen) {
            loadRooms();
        }
    }, [isOpen, institutionId]);

    const loadRooms = async () => {
        const roomsData = await getRoomsByInstitution(institutionId);
        setRooms(Object.entries(roomsData).map(([id, room]) => ({ id, ...room })));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file (JPG, PNG, GIF, WebP)');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                return;
            }

            setSelectedImage(file);

            // Create preview using FileReader
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError('');
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setFormData({ ...formData, imagePath: '' });
        // Clear file input
        const fileInput = document.getElementById('event-image-input');
        if (fileInput) fileInput.value = '';
    };

    const saveImageLocally = async (file) => {
        try {
            const timestamp = Date.now();
            const fileName = `${timestamp}_${file.name}`;
            const folderPath = `events/${institutionId}`;
            const fullPath = `${folderPath}/${fileName}`;

            // Convert file to base64
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    // Store in localStorage with the full path as key
                    try {
                        localStorage.setItem(`event_image_${fullPath}`, reader.result);
                        resolve(fullPath);
                    } catch (error) {
                        if (error.name === 'QuotaExceededError') {
                            reject(new Error('Storage quota exceeded. Please delete some old images or reduce image size.'));
                        } else {
                            reject(error);
                        }
                    }
                };
                reader.onerror = () => reject(new Error('Failed to read image file'));
                reader.readAsDataURL(file);
            });
        } catch (error) {
            console.error('Error saving image locally:', error);
            throw error;
        }
    };

    const handleRoomChange = async (roomId) => {
        const selectedRoom = rooms.find(r => r.id === roomId);
        if (selectedRoom) {
            setFormData({
                ...formData,
                roomId,
                roomName: selectedRoom.name
            });

            // Check availability if date and time are selected
            if (formData.startDate && formData.startTime && formData.endTime) {
                const availability = await checkRoomAvailability(
                    roomId,
                    formData.startDate,
                    formData.startTime,
                    formData.endTime
                );

                if (!availability.available) {
                    setRoomWarning('⚠️ This room has conflicting bookings at this time!');
                } else {
                    setRoomWarning('');
                }
            }
        }
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.roomId || !formData.startDate || !formData.endDate ||
            !formData.startTime || !formData.endTime) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.isPaid && (!formData.fee || formData.fee <= 0)) {
            setError('Please enter a valid fee amount');
            return;
        }

        setLoading(true);
        setError('');

        try {
            let imagePath = '';

            // Save image locally if selected
            if (selectedImage) {
                imagePath = await saveImageLocally(selectedImage);
            }

            const eventData = {
                ...formData,
                imagePath
            };

            const result = await createEvent(eventData, creatorId, institutionId);

            setLoading(false);

            if (result.success) {
                onSuccess();
                onClose();
                setFormData({
                    title: '',
                    type: 'Seminar',
                    roomId: '',
                    roomName: '',
                    startDate: '',
                    endDate: '',
                    startTime: '',
                    endTime: '',
                    description: '',
                    guestNames: '',
                    isPaid: false,
                    fee: 0,
                    imagePath: ''
                });
                setSelectedImage(null);
                setImagePreview(null);
                setRoomWarning('');
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError('Failed to create event: ' + error.message);
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Event" size="large">
            {error && <div className="message message-error">{error}</div>}
            {roomWarning && <div className="message message-warning">{roomWarning}</div>}

            <div className="form-group">
                <label>Event Title *</label>
                <input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter event title"
                />
            </div>

            <div className="form-group">
                <label>Event Image</label>
                <input
                    id="event-image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'block', marginBottom: '10px' }}
                />
                {imagePreview && (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img
                            src={imagePreview}
                            alt="Event preview"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '200px',
                                borderRadius: '8px',
                                marginTop: '10px',
                                border: '2px solid #e0e0e0'
                            }}
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '5px',
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                cursor: 'pointer',
                                fontSize: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ×
                        </button>
                    </div>
                )}
                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    Recommended: JPG, PNG (Max 5MB) - Images stored locally in browser
                </p>
            </div>

            <div className="grid-2">
                <div className="form-group">
                    <label>Event Type *</label>
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                        {EVENT_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Event Room *</label>
                    <select
                        value={formData.roomId}
                        onChange={(e) => handleRoomChange(e.target.value)}
                    >
                        <option value="">Select Room</option>
                        {rooms.map(room => (
                            <option key={room.id} value={room.id}>
                                {room.name} (Capacity: {room.capacity})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid-2">
                <div className="form-group">
                    <label>Start Date *</label>
                    <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div className="form-group">
                    <label>End Date *</label>
                    <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                    />
                </div>
            </div>

            <div className="grid-2">
                <div className="form-group">
                    <label>Start Time *</label>
                    <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>End Time *</label>
                    <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Event description and details"
                    rows="3"
                />
            </div>

            <div className="form-group">
                <label>Guest Names (Optional)</label>
                <input
                    value={formData.guestNames}
                    onChange={(e) => setFormData({ ...formData, guestNames: e.target.value })}
                    placeholder="e.g., Dr. John Doe, Prof. Jane Smith"
                />
            </div>

            <div className="form-check">
                <input
                    type="checkbox"
                    id="isPaid"
                    checked={formData.isPaid}
                    onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                />
                <label htmlFor="isPaid">This is a paid event</label>
            </div>

            {formData.isPaid && (
                <div className="form-group">
                    <label>Event Fee (₹) *</label>
                    <input
                        type="number"
                        value={formData.fee}
                        onChange={(e) => setFormData({ ...formData, fee: parseFloat(e.target.value) || 0 })}
                        placeholder="Enter fee amount"
                        min="0"
                    />
                </div>
            )}

            <div className="message message-info">
                Event will be sent for approval through the hierarchy: HOD → Principal → Admin
            </div>

            <div className="modal-footer">
                <button onClick={onClose} className="btn btn-secondary" disabled={loading}>
                    Cancel
                </button>
                <button onClick={handleSubmit} className="btn btn-success" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Event'}
                </button>
            </div>
        </Modal>
    );
};

export default CreateEventModal;