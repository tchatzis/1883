const { initializeApp, applicationDefault, cert } = require( "firebase-admin/app" );
const { getFirestore, Timestamp, FieldValue } = require( "firebase-admin/firestore" );

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = 
{
  apiKey: "AIzaSyDSICb3kvjpIpyKa5yRXAeQfnGD0_1yfBE",
  authDomain: "project-4085465294612037309.firebaseapp.com",
  projectId: "project-4085465294612037309",
  storageBucket: "project-4085465294612037309.appspot.com",
  messagingSenderId: "900310003630",
  appId: "1:900310003630:web:8d525e277a73b64649a23f"
};

const serviceAccount = require( '../../firestore.json');

initializeApp(
{
  credential: cert( serviceAccount )
} );

module.exports = getFirestore();