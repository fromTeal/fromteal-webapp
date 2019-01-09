import React, { Component } from 'react'
import AuthContext from '../../containers/auth-context'

class Login extends Component {
  static contextType = AuthContext

  render() {
    return <button onClick={this.context.toggleAuth}>
      {this.context.isAuth ? 'Logout' : 'Login'}
    </button>

  }

}

export default Login
