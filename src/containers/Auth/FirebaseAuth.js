import React from 'react'

import { StyledFirebaseAuth } from 'react-firebaseui'

import firebase from '../../firebase/firebase-config'


// TOTO configure & create TOS & Privacy links & pages

const firebaseAuth = (props) => {

  // Configure FirebaseUI.
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    // We will display Google as auth provider.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ]
  };

  return (
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
  )
}


export default firebaseAuth
