import firebase from 'firebase';

const firebaseConfig = {
	apiKey: "AIzaSyBNuUvSv1RE0YwGsrjuRJEihq2GObs3vic",
	authDomain: "wapichana-dictionary.firebaseapp.com",
	databaseURL: "https://wapichana-dictionary.firebaseio.com",
	projectId: "wapichana-dictionary",
	storageBucket: "wapichana-dictionary.appspot.com",
	messagingSenderId: "886442998382",
	appId: "1:886442998382:web:1247b86fcb26ac2906c47f"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase;