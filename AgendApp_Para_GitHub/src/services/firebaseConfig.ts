import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración real obtenida de la consola de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAcv52dh8B9N_PKOK1gRC0Lv0iB8kRY1gc",
    authDomain: "agendapp-4652f.firebaseapp.com",
    projectId: "agendapp-4652f",
    storageBucket: "agendapp-4652f.firebasestorage.app",
    messagingSenderId: "476321500445",
    appId: "1:476321500445:web:ff7ee8057d2839852865f4",
    measurementId: "G-YDSDMMW58Y"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
