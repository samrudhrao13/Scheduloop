import { ref, set, get, update, remove } from 'firebase/database';
import { database } from '../config/firebase';
import { generateId } from '../utils/helpers';
import { EVENT_STATUS } from '../utils/constants';

export const createEvent = async (eventData, creatorId, institutionId) => {
    try {
        const eventId = generateId();

        const newEvent = {
            ...eventData,
            createdBy: creatorId,
            institutionId,
            status: EVENT_STATUS.PENDING_HOD,
            createdAt: Date.now(),
            registrations: {},
            attendees: {}
        };

        await set(ref(database, `events/${eventId}`), newEvent);
        return { success: true, eventId };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const updateEventStatus = async (eventId, status, approverId, reason = null) => {
    try {
        const updates = {
            status,
            [`${status}_by`]: approverId,
            [`${status}_at`]: Date.now()
        };

        if (reason) {
            updates.rejectionReason = reason;
        }

        await update(ref(database, `events/${eventId}`), updates);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const registerForEvent = async (eventId, userId, userWallet, eventFee) => {
    try {
        // Check wallet balance if event is paid
        if (eventFee > 0 && userWallet < eventFee) {
            return { success: false, error: 'Insufficient wallet balance' };
        }

        // Register user
        await set(ref(database, `events/${eventId}/registrations/${userId}`), {
            userId,
            registeredAt: Date.now(),
            amountPaid: eventFee
        });

        // Deduct from wallet if paid
        if (eventFee > 0) {
            await update(ref(database, `users/${userId}`), {
                wallet: userWallet - eventFee
            });
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getEventsByInstitution = async (institutionId) => {
    try {
        const snapshot = await get(ref(database, 'events'));
        if (snapshot.exists()) {
            const allEvents = snapshot.val();
            const institutionEvents = Object.entries(allEvents)
                .filter(([id, event]) => event.institutionId === institutionId)
                .reduce((acc, [id, event]) => ({ ...acc, [id]: event }), {});
            return institutionEvents;
        }
        return {};
    } catch (error) {
        console.error('Error fetching events:', error);
        return {};
    }
};

export const deleteEvent = async (eventId) => {
    try {
        await remove(ref(database, `events/${eventId}`));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
