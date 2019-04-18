import React, { Component } from 'react'
import firebase from '../../firebase/firebase-config'

import AuthContext from '../auth-context'

// TOTO configure & create TOS & Privacy links & pages

class FirebaseLogout extends Component {

  static contextType = AuthContext


  componentDidMount = () => {
    const self = this
    firebase.auth().signOut().then(function() {
      self.context.setAuthState(false, null)
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
          <a href="/">Back to homepage</a>
        </p>
    )
  }
}


export default FirebaseLogout
