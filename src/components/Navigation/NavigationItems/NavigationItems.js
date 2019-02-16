import React from 'react'

import classes from './NavigationItems.css'
import NavigationItem from '../NavigationItem/NavigationItem'

const navigationItems = () => (
  <ul className={'NavigationItems'}>
    <NavigationItem link="/teams">My teams</NavigationItem>
    <NavigationItem link="/new-team">Create team</NavigationItem>
    <NavigationItem link="/auth">Login</NavigationItem>
  </ul>
)


export default navigationItems
