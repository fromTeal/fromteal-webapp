import React, { Component } from 'react'

import classes from './NavigationItems.css'
import NavigationItem from '../NavigationItem/NavigationItem'
import AuthContext from '../../../containers/auth-context'

class NavigationItems extends Component {
  static contextType = AuthContext

  render() {
    return (
      <ul className={'NavigationItems'}>
        { this.context.isAuth ? <NavigationItem link="/teams">My teams</NavigationItem> : null }
        { this.context.isAuth ? <NavigationItem link="/logout">Logout</NavigationItem> : null }
      </ul>
    )
  }
}


export default NavigationItems
