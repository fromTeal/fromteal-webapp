import React, { Component } from 'react'

import AuthContext from '../../auth-context'

// todo use prop-types


import './Team.css'


class Team extends Component {

  static contextType = AuthContext

  render() {
    return (
      <article className="Team" onClick={this.props.clicked}>
          <h1>{this.props.name}</h1>
          <div className="Info">
            <div className="Purpose">{this.props.purpose}</div>
            <div className="Tags">{this.props.tags.join(", ")}</div>
          </div>
      </article>
    )
  }

}

export default Team
