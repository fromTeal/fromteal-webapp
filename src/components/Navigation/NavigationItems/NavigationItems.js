import React, { Component } from 'react'

import classes from './NavigationItems.css'
import NavigationItem from '../NavigationItem/NavigationItem'
import AuthContext from '../../../containers/auth-context'

class NavigationItems extends Component {
  static contextType = AuthContext

  render() {
    return (
      <ul className={'NavigationItems'}>
        <NavigationItem link="/teams">My teams</NavigationItem>
        <NavigationItem link="/new-team">Create team</NavigationItem>
        { this.context.isAuth ? <img src={this.context.user.picture}/> : <NavigationItem link="/auth">Login</NavigationItem> }
      </ul>
    )
  }
}


export default NavigationItems
