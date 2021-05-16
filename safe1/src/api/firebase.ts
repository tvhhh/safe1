import firebase from 'firebase';
import firebaseConfig from '@/api/firebaseConfig.json';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;