import { firebaseApp } from "./firebaseInit";
import {
    Auth,
    AuthErrorCodes,
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithRedirect,
    signInAnonymously,
    signOut,
} from 'firebase/auth';

export const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

export const signInWithGoogle = async () => signInWithRedirect(auth, provider);

export const guestSignIn = async () => signInAnonymously(auth);

export const loginEmailPassword = async (email: string, password: string) => {
    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.log(error);
        return getErrorFieldAndMessage(error);
    }
    return undefined;
}

export const createUser = async (email: string, password: string) => {
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.log(error);
        return getErrorFieldAndMessage(error);
    }
    return undefined;
}

export const getErrorFieldAndMessage = (error: any) => {
    if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
        console.log('Invalid Password')
        return {
            field: 'password',
            message: 'Invalid Password'
        }
    }
    console.log('message', error.message);
    return {
        field: '',
        message: 'Invalid Password'
    }
}

export const logout = async () => {
    signOut(auth);
}