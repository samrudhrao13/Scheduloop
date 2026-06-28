import React, { useState } from 'react';
import Modal from '../common/Modal';
import { submitFeedback } from '../../services/feedbackService';

const FeedbackModal = ({ isOpen, onClose, onSuccess, eventId, userId, eventTitle }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (rating === 0) {
            setError('Please provide a rating');
            return;
        }

        setLoading(true);
        setError('');

        const result = await submitFeedback(eventId, userId, rating, comment);

        setLoading(false);

        if (result.success) {
            onSuccess();
            onClose();
            setRating(0);
            setComment('');
        } else {
            setError(result.error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Submit Event Feedback">
            {error && <div className="message message-error">{error}</div>}

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: '#667eea', marginBottom: '10px' }}>{eventTitle}</h3>
                <p style={{ color: '#666', fontSize: '14px' }}>How would you rate this event?</p>
            </div>

            <div className="feedback-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={rating >= star || hoveredRating >= star ? 'active' : ''}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        style={{ cursor: 'pointer' }}
                    >
                        ★
                    </span>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '20px', color: '#666', fontSize: '14px' }}>
                {rating === 0 && 'Click to rate'}
                {rating === 1 && '⭐ Poor'}
                {rating === 2 && '⭐⭐ Fair'}
                {rating === 3 && '⭐⭐⭐ Good'}
                {rating === 4 && '⭐⭐⭐⭐ Very Good'}
                {rating === 5 && '⭐⭐⭐⭐⭐ Excellent'}
            </div>

            <div className="form-group">
                <label>Comments (Optional)</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience and suggestions..."
                    rows="4"
                />
            </div>

            <div className="modal-footer">
                <button onClick={onClose} className="btn btn-secondary" disabled={loading}>
                    Cancel
                </button>
                <button onClick={handleSubmit} className="btn btn-success" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </div>
        </Modal>
    );
};

export default FeedbackModal;