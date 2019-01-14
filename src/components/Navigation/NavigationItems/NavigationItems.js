import React from 'react'

import classes from './NavigationItems.css'

import NavigationItem from '../NavigationItem/NavigationItem'


const navigationItems = () => (
  <ul className={'NavigationItems'}>
    <NavigationItem link="/">List of teams</NavigationItem>
    <NavigationItem link="/" active>Team home</NavigationItem>
  </ul>
)


export default navigationItems
