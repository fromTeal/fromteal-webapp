import firebase from 'firebase';

const config = {
	apiKey: "AIzaSyCtz7bxcOZ_9C3mR756qBJrCvlYw1zcRJY",
	authDomain: "manual-pilot.firebaseapp.com",
	databaseURL: "https://manual-pilot.firebaseio.com",
	projectId: "manual-pilot",
	storageBucket: "manual-pilot.appspot.com",
	messagingSenderId: "599409639649"
};


export const firebaseApp = firebase.initializeApp(config);
export const googleProvider = new firebase.auth.GoogleAuthProvider();

export default firebase;
