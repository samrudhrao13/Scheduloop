import { ref, set, get, update, remove } from 'firebase/database';
import { database } from '../config/firebase';
import { generateId } from '../utils/helpers';

export const createRoom = async (roomData, institutionId) => {
    try {
        const roomId = generateId();

        const newRoom = {
            ...roomData,
            capacity: parseInt(roomData.capacity),
            latitude: parseFloat(roomData.latitude),
            longitude: parseFloat(roomData.longitude),
            radius: parseInt(roomData.radius) || 100,
            institutionId,
            createdAt: Date.now()
        };

        await set(ref(database, `rooms/${roomId}`), newRoom);
        return { success: true, roomId };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const updateRoom = async (roomId, updates) => {
    try {
        await update(ref(database, `rooms/${roomId}`), updates);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const deleteRoom = async (roomId) => {
    try {
        await remove(ref(database, `rooms/${roomId}`));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getRoomsByInstitution = async (institutionId) => {
    try {
        const snapshot = await get(ref(database, 'rooms'));
        if (snapshot.exists()) {
            const allRooms = snapshot.val();
            const institutionRooms = Object.entries(allRooms)
                .filter(([id, room]) => room.institutionId === institutionId)
                .reduce((acc, [id, room]) => ({ ...acc, [id]: room }), {});
            return institutionRooms;
        }
        return {};
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return {};
    }
};

export const checkRoomAvailability = async (roomId, date, startTime, endTime) => {
    try {
        const eventsSnapshot = await get(ref(database, 'events'));
        if (eventsSnapshot.exists()) {
            const events = eventsSnapshot.val();
            const conflicts = Object.values(events).filter(event =>
                event.roomId === roomId &&
                event.startDate === date &&
                event.status === 'approved' &&
                ((event.startTime <= startTime && event.endTime > startTime) ||
                    (event.startTime < endTime && event.endTime >= endTime))
            );
            return { available: conflicts.length === 0, conflicts };
        }
        return { available: true, conflicts: [] };
    } catch (error) {
        console.error('Error checking room availability:', error);
        return { available: false, conflicts: [] };
    }
};