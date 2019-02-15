import React from 'react'

import classes from './NavigationItems.css'
import NavigationItem from '../NavigationItem/NavigationItem'

const navigationItems = () => (
  <ul className={'NavigationItems'}>
    <NavigationItem link="/" active>Make</NavigationItem>
    <NavigationItem link="/teams">Team-up</NavigationItem>
    <NavigationItem link="/auth">Login</NavigationItem>  
  </ul>
)


export default navigationItems
