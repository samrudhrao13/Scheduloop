import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase';

export const useEvents = (institutionId = null) => {
    const [events, setEvents] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const eventsRef = ref(database, 'events');

        const unsubscribe = onValue(eventsRef, (snapshot) => {
            if (snapshot.exists()) {
                let eventsData = snapshot.val();

                if (institutionId) {
                    eventsData = Object.entries(eventsData)
                        .filter(([id, event]) => event.institutionId === institutionId)
                        .reduce((acc, [id, event]) => ({ ...acc, [id]: event }), {});
                }

                setEvents(eventsData);
            } else {
                setEvents({});
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [institutionId]);

    return { events, loading };
};