import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import { storage } from '../config/firebase';

// Returns a browser-accessible URL for the given image path in Firebase Storage
export const getEventImageUrl = async (imagePath) => {
    try {
        if (!imagePath) return null;

        // If an absolute URL is already provided, just return it
        if (/^https?:\/\//i.test(imagePath)) {
            return imagePath;
        }

        // Build a ref and get a signed download URL
        const refObj = storageRef(storage, imagePath);
        const url = await getDownloadURL(refObj);
        return url;
    } catch (err) {
        console.error('Error fetching event image URL for path:', imagePath, err);
        // Fallback to localStorage if we have a cached base64 image
        try {
            const local = localStorage.getItem(`event_image_${imagePath}`);
            if (local && local.startsWith('data:image')) return local;
        } catch { }
        return null;
    }
};
