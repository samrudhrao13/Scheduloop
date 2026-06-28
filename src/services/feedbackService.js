import { ref, set, get } from 'firebase/database';
import { database } from '../config/firebase';

export const submitFeedback = async (eventId, userId, rating, comment) => {
    try {
        await set(ref(database, `feedback/${eventId}/${userId}`), {
            userId,
            rating,
            comment,
            timestamp: Date.now()
        });

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getEventFeedback = async (eventId) => {
    try {
        const snapshot = await get(ref(database, `feedback/${eventId}`));
        if (snapshot.exists()) {
            const feedbackData = snapshot.val();
            const feedbackArray = Object.values(feedbackData);

            const averageRating = feedbackArray.reduce((sum, f) => sum + f.rating, 0) / feedbackArray.length;

            return {
                feedbacks: feedbackData,
                averageRating: averageRating.toFixed(1),
                totalCount: feedbackArray.length
            };
        }
        return { feedbacks: {}, averageRating: 0, totalCount: 0 };
    } catch (error) {
        console.error('Error fetching feedback:', error);
        return { feedbacks: {}, averageRating: 0, totalCount: 0 };
    }
};

export const getAllFeedbackByInstitution = async (institutionId, events) => {
    try {
        const snapshot = await get(ref(database, 'feedback'));
        if (snapshot.exists()) {
            const allFeedback = snapshot.val();
            const institutionFeedback = {};

            Object.entries(events).forEach(([eventId, event]) => {
                if (event.institutionId === institutionId && allFeedback[eventId]) {
                    institutionFeedback[eventId] = allFeedback[eventId];
                }
            });

            return institutionFeedback;
        }
        return {};
    } catch (error) {
        console.error('Error fetching institution feedback:', error);
        return {};
    }
};