import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { getEventFeedback } from '../../services/feedbackService';
import { formatDate } from '../../utils/helpers';

const ViewFeedbackModal = ({ isOpen, onClose, eventId, eventTitle }) => {
  const [feedbackData, setFeedbackData] = useState({ feedbacks: {}, averageRating: 0, totalCount: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && eventId) {
      loadFeedback();
    }
  }, [isOpen, eventId]);

  const loadFeedback = async () => {
    setLoading(true);
    const data = await getEventFeedback(eventId);
    setFeedbackData(data);
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Event Feedback" size="large">
      <h3 style={{ color: '#667eea', marginBottom: '15px' }}>{eventTitle}</h3>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          <div className="feedback-summary">
            <div className="feedback-summary-header">
              <div>
                <div className="feedback-rating">
                  {'★'.repeat(Math.round(feedbackData.averageRating))}
                  {'☆'.repeat(5 - Math.round(feedbackData.averageRating))}
                  <span style={{ marginLeft: '10px', color: '#333', fontSize: '18px' }}>
                    {feedbackData.averageRating}
                  </span>
                </div>
                <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>
                  Based on {feedbackData.totalCount} {feedbackData.totalCount === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>
          </div>

          {feedbackData.totalCount > 0 ? (
            <div className="feedback-list">
              {Object.entries(feedbackData.feedbacks).map(([userId, feedback]) => (
                <div key={userId} className="feedback-item">
                  <div className="feedback-item-header">
                    <div className="feedback-item-rating">
                      {'★'.repeat(feedback.rating)}
                      {'☆'.repeat(5 - feedback.rating)}
                    </div>
                    <div className="feedback-item-date">
                      {formatDate(feedback.timestamp)}
                    </div>
                  </div>
                  {feedback.comment && (
                    <p className="feedback-item-comment">{feedback.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3>No Feedback Yet</h3>
              <p>No feedback has been submitted for this event.</p>
            </div>
          )}
        </>
      )}

      <div className="modal-footer">
        <button onClick={onClose} className="btn btn-primary">
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ViewFeedbackModal;