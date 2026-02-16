import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithCredential
} from 'firebase/auth';
import { auth } from './firebaseConfig';
import * as Google from 'expo-auth-session/providers/google';

export const login = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);
export const register = (email: string, pass: string) => createUserWithEmailAndPassword(auth, email, pass);
export const logout = () => signOut(auth);

export const loginWithGoogleCredential = (idToken: string) => {
    const credential = GoogleAuthProvider.credential(idToken);
    return signInWithCredential(auth, credential);
};

export const subscribeToAuthChanges = (callback: (user: any) => void) => {
    return onAuthStateChanged(auth, callback);
};
