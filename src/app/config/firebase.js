import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBPIeTxoFDk1NAafeYni0ysW9-9knbS5a8",
    authDomain: "revents-987ca.firebaseapp.com",
    databaseURL: "https://revents-987ca.firebaseio.com",
    projectId: "revents-987ca",
    storageBucket: "revents-987ca.appspot.com",
    messagingSenderId: "717074066035"
}

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const settings = {
    timestampsInSnapshots: true
}
firestore.settings(settings);

export default firebase;