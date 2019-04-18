import React, { Component } from 'react'

import { StyledFirebaseAuth } from 'react-firebaseui'

import firebase from '../../firebase/firebase-config'

import AuthContext from '../auth-context'


// TOTO configure & create TOS & Privacy links & pages

class FirebaseAuth extends Component {

  static contextType = AuthContext


  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    // We will display Google as auth provider.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ]
  }

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
        (user) => {
          console.log(`AuthStateChanged - user = ${user}`)
          if (user) {
            console.log(user)
            const userModel = {
              name: user.displayName,
              email: user.email,
              picture: user.photoURL
            }
            this.storeUserDetails(userModel)
            this.context.setAuthState(true, userModel)
          } else {
            this.clearUserDetails()
            this.context.setAuthState(false, null)
          }
        }
    );
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    return (
      <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
    )
  }
}


export default FirebaseAuth
