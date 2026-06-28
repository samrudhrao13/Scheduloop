import { ref, set, get } from 'firebase/database';
import { database } from '../config/firebase';
import { generateId } from '../utils/helpers';

export const createInstitution = async (institutionData, adminEmail) => {
    try {
        const institutionId = generateId();
        const adminId = generateId();

        // Create institution
        await set(ref(database, `institutions/${institutionId}`), {
            ...institutionData,
            adminId,
            createdAt: Date.now()
        });

        // Create admin user
        await set(ref(database, `users/${adminId}`), {
            email: adminEmail,
            password: 'admin123',
            role: 'admin',
            institutionId,
            name: 'Admin',
            mustChangePassword: true,
            createdAt: Date.now()
        });

        return { success: true, institutionId, adminId };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getInstitutions = async () => {
    try {
        const snapshot = await get(ref(database, 'institutions'));
        return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
        console.error('Error fetching institutions:', error);
        return {};
    }
};