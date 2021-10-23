import { getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

if (getApps().length === 0) {
  const firebaseConfig = {
    apiKey: 'AIzaSyB12wuzp21p7qS0RV83WyrJwgfg6Tewk_Q',
    authDomain: 'catan-with-friends.firebaseapp.com',
    projectId: 'catan-with-friends',
    storageBucket: 'catan-with-friends.appspot.com',
    messagingSenderId: '271843217242',
    appId: '1:271843217242:web:be1fccd67251677af16d63',
  }
  initializeApp(firebaseConfig)
}

export const db = getFirestore()
