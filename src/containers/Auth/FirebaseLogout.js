import React, { Component } from 'react'
import firebase from '../../firebase/firebase-config'

import AuthContext from '../auth-context'

// TOTO configure & create TOS & Privacy links & pages

class FirebaseLogout extends Component {

  static contextType = AuthContext


    clearUserDetails = () => {
        console.log("clearUserDetails")
        localStorage.clear()
    }

    componentDidMount = () => {
      this.clearUserDetails()
      this.context.setAuthState(false)
      firebase.auth().signOut().then(function() {
      console.log('Signed Out');
    }, function(error) {
      console.error('Sign Out Error', error);
    });
  }

  render() {
    return (
        <p>
          You have successfully logged out.
          <br/>
          See you next time!
        </p>
    )
  }
}


export default FirebaseLogout
