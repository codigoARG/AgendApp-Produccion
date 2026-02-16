import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    onSnapshot,
    setDoc
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Event } from '../store/useEventStore';

const EVENTS_COLLECTION = 'events';

export const syncEventToFirestore = async (userId: string, event: Event) => {
    const eventRef = doc(db, USERS_COLLECTION, userId, EVENTS_COLLECTION, event.id);
    await setDoc(eventRef, event);
};

const USERS_COLLECTION = 'users';

export const deleteEventFromFirestore = async (userId: string, eventId: string) => {
    const eventRef = doc(db, USERS_COLLECTION, userId, EVENTS_COLLECTION, eventId);
    await deleteDoc(eventRef);
};

export const subscribeToEvents = (userId: string, callback: (events: Event[]) => void) => {
    const q = query(collection(db, USERS_COLLECTION, userId, EVENTS_COLLECTION));

    return onSnapshot(q, (snapshot) => {
        const events: Event[] = [];
        snapshot.forEach((doc) => {
            events.push(doc.data() as Event);
        });
        callback(events);
    });
};
