import { signInWithPopup, FacebookAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import { auth } from './init';

export const facebookLogin = () => {
    return new Promise((resolve, reject) => {
        const provider = new FacebookAuthProvider();
        signInWithPopup(auth,provider).then(res => resolve(res)).catch(err => reject(err))
    })
}

export const twitterLogin = () => {
    return new Promise((resolve, reject) => {
        const provider = new TwitterAuthProvider();
        signInWithPopup(auth, provider).then(res => resolve(res)).catch(err => reject(err));
    })
}