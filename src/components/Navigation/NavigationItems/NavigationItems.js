import React from 'react'

import classes from './NavigationItems.css'
import NavigationItem from '../NavigationItem/NavigationItem'

const navigationItems = () => (
  <ul className={'NavigationItems'}>
    <NavigationItem link="/" active>Team home</NavigationItem>
    <NavigationItem link="/">Teams list</NavigationItem>
  </ul>
)


export default navigationItems
