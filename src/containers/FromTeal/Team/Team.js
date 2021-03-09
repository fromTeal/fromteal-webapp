import React, { Component } from 'react'

import AuthContext from '../../auth-context'

// todo use prop-types


import './Team.css'


class Team extends Component {

  static contextType = AuthContext

  intersperse(arr, sep) {
    if (arr.length === 0) {
        return [];
    }

    return arr.slice(1).reduce(function(xs, x, i) {
        return xs.concat([sep, x]);
    }, [arr[0]]);
  }

  // buildLink(teamId, milestone) {
  //   return '/my_teams/' + teamId + '/milestone/' + milestone
  // }

  render() {
    // TODO cleanup code for showing links to container bldg for milestones
    // let milestones = this.props.milestones.map(milestone => (
    //   <a href={this.buildLink(this.props.teamId, milestone)}>{milestone}</a>
    // ))
    //let milestones = this.intersperse(this.props.milestones, ", ")

    let milestones = ""
    if (this.props.milestones.length) {
      milestones = `Milestones: ${this.props.milestones}`
    }

    return (
      <article className="Team" onClick={this.props.clicked}>
        <h1>{this.props.name}</h1>
        <div className="Info">
          <div className="Purpose">{this.props.purpose}</div>
          <div className="members">{this.props.members.length} members</div>
          <div className="Milestones">{milestones}
          </div>
          <div className="Tags">{this.props.tags.join(", ")}</div>
        </div>
      </article>
    )
  }

}

export default Team
