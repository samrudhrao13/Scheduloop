import { ref, set, get, update, remove } from 'firebase/database';
import { database } from '../config/firebase';
import { generateId } from '../utils/helpers';
import { DEFAULT_WALLET_BALANCE } from '../utils/constants';

export const createUser = async (userData, institutionId) => {
    try {
        const userId = generateId();

        const newUser = {
            ...userData,
            institutionId,
            password: 'temp123',
            mustChangePassword: true,
            wallet: userData.role === 'student' ? DEFAULT_WALLET_BALANCE : 0,
            createdAt: Date.now()
        };

        await set(ref(database, `users/${userId}`), newUser);
        return { success: true, userId };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const updateUser = async (userId, updates) => {
    try {
        await update(ref(database, `users/${userId}`), updates);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const deleteUser = async (userId) => {
    try {
        await remove(ref(database, `users/${userId}`));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getUsersByInstitution = async (institutionId) => {
    try {
        const snapshot = await get(ref(database, 'users'));
        if (snapshot.exists()) {
            const allUsers = snapshot.val();
            const institutionUsers = Object.entries(allUsers)
                .filter(([id, user]) => user.institutionId === institutionId)
                .reduce((acc, [id, user]) => ({ ...acc, [id]: user }), {});
            return institutionUsers;
        }
        return {};
    } catch (error) {
        console.error('Error fetching users:', error);
        return {};
    }
};

export const updateWalletBalance = async (userId, amount) => {
    try {
        const userRef = ref(database, `users/${userId}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const currentWallet = snapshot.val().wallet || 0;
            await update(userRef, { wallet: currentWallet + amount });
            return { success: true, newBalance: currentWallet + amount };
        }

        return { success: false, error: 'User not found' };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
