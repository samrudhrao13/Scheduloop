import { ref, get, update } from 'firebase/database';
import { database } from '../config/firebase';

export const loginUser = async (email, password, role) => {
    try {
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            const users = snapshot.val();
            const userEntry = Object.entries(users).find(
                ([id, user]) =>
                    user.email === email &&
                    user.password === password &&
                    user.role === role
            );

            if (userEntry) {
                const [userId, userData] = userEntry;
                return {
                    success: true,
                    user: { id: userId, ...userData }
                };
            }
        }

        return { success: false, error: 'Invalid credentials' };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
};

export const changePassword = async (userId, oldPassword, newPassword) => {
    try {
        const userRef = ref(database, `users/${userId}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const user = snapshot.val();
            if (user.password === oldPassword) {
                await update(userRef, {
                    password: newPassword,
                    mustChangePassword: false
                });
                return { success: true };
            }
        }

        return { success: false, error: 'Invalid old password' };
    } catch (error) {
        return { success: false, error: error.message };
    }
};