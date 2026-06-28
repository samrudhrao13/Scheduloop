// import { ref, set, get } from 'firebase/database';
// import { database } from '../config/firebase';
// import { calculateDistance } from '../utils/helpers';
// import { GEO_FENCE_RADIUS } from '../utils/constants';

// export const markAttendance = async (eventId, userId, userLocation, roomLocation) => {
//     try {
//         const distance = calculateDistance(
//             userLocation.latitude,
//             userLocation.longitude,
//             roomLocation.latitude,
//             roomLocation.longitude
//         );

//         if (distance > GEO_FENCE_RADIUS) {
//             return {
//                 success: false,
//                 error: `You must be within ${GEO_FENCE_RADIUS}m of the event location. Current distance: ${Math.round(distance)}m`
//             };
//         }

//         await set(ref(database, `attendance/${eventId}/${userId}`), {
//             userId,
//             timestamp: Date.now(),
//             latitude: userLocation.latitude,
//             longitude: userLocation.longitude,
//             distance: Math.round(distance)
//         });

//         return { success: true, distance: Math.round(distance) };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// };

// export const getEventAttendance = async (eventId) => {
//     try {
//         const snapshot = await get(ref(database, `attendance/${eventId}`));
//         return snapshot.exists() ? snapshot.val() : {};
//     } catch (error) {
//         console.error('Error fetching attendance:', error);
//         return {};
//     }
// };

// export const getUserAttendance = async (userId) => {
//     try {
//         const snapshot = await get(ref(database, 'attendance'));
//         if (snapshot.exists()) {
//             const allAttendance = snapshot.val();
//             const userAttendance = {};

//             Object.entries(allAttendance).forEach(([eventId, attendees]) => {
//                 if (attendees[userId]) {
//                     userAttendance[eventId] = attendees[userId];
//                 }
//             });

//             return userAttendance;
//         }
//         return {};
//     } catch (error) {
//         console.error('Error fetching user attendance:', error);
//         return {};
//     }
// };













import { ref, set, get } from 'firebase/database';
import { database } from '../config/firebase';
import { calculateDistance } from '../utils/helpers';

export const markAttendance = async (eventId, userId, userLocation, roomLocation, roomRadius) => {
    try {
        const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            roomLocation.latitude,
            roomLocation.longitude
        );

        const isWithinRadius = distance <= roomRadius;
        const status = isWithinRadius ? 'present' : 'absent';

        await set(ref(database, `attendance/${eventId}/${userId}`), {
            userId,
            timestamp: Date.now(),
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            distance: Math.round(distance),
            status: status,
            roomRadius: roomRadius
        });

        if (!isWithinRadius) {
            return {
                success: false,
                marked: true,
                error: `You are ${Math.round(distance)}m away from the event location. You must be within ${roomRadius}m to be marked present. You have been marked as ABSENT.`,
                distance: Math.round(distance),
                status: 'absent'
            };
        }

        return {
            success: true,
            distance: Math.round(distance),
            status: 'present'
        };
    } catch (error) {
        return { success: false, error: error.message, marked: false };
    }
};

export const getEventAttendance = async (eventId) => {
    try {
        const snapshot = await get(ref(database, `attendance/${eventId}`));
        return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
        console.error('Error fetching attendance:', error);
        return {};
    }
};

export const getUserAttendance = async (userId) => {
    try {
        const snapshot = await get(ref(database, 'attendance'));
        if (snapshot.exists()) {
            const allAttendance = snapshot.val();
            const userAttendance = {};

            Object.entries(allAttendance).forEach(([eventId, attendees]) => {
                if (attendees[userId]) {
                    userAttendance[eventId] = attendees[userId];
                }
            });

            return userAttendance;
        }
        return {};
    } catch (error) {
        console.error('Error fetching user attendance:', error);
        return {};
    }
};

export const getAttendanceStats = (attendance) => {
    const stats = {
        total: 0,
        present: 0,
        absent: 0,
        presentPercentage: 0,
        absentPercentage: 0
    };

    if (!attendance || Object.keys(attendance).length === 0) {
        return stats;
    }

    const attendanceArray = Object.values(attendance);
    stats.total = attendanceArray.length;
    stats.present = attendanceArray.filter(att => att.status === 'present').length;
    stats.absent = attendanceArray.filter(att => att.status === 'absent').length;
    stats.presentPercentage = stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0;
    stats.absentPercentage = stats.total > 0 ? ((stats.absent / stats.total) * 100).toFixed(1) : 0;

    return stats;
};