import React, { Component } from 'react'

import AuthContext from '../../containers/auth-context'

// todo use prop-types


import './Team.css'


class Team extends Component {

  static contextType = AuthContext

  render() {
    return (
      <div className="Team" onClick={this.props.clickHandler}>
        <h2>{this.props.name}</h2>
        {this.context.isAuth ? (<button>Join</button>) : null}
      </div>
    )
  }

}

export default Team
