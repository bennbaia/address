import firebase from 'firebase/app'
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyAY4R0jyApdG4dlgC09kQtnT_1Kxz3R5AY",
    authDomain: "addressx-9843f.firebaseapp.com",
    databaseURL: "https://addressx-9843f.firebaseio.com",
    projectId: "addressx-9843f",
    storageBucket: "addressx-9843f.appspot.com",
    messagingSenderId: "93091720039",
    appId: "1:93091720039:web:ae138ba68c623828965dc2",
    measurementId: "G-2025XPMTNR"
}

firebase.initializeApp(config)
const db = firebase.firestore()
export default db