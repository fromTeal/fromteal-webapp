import React from 'react'
import { NavLink } from 'react-router-dom'
import classes from './NavigationItem.css'

const navigationItem = (props) => (
  <li className={'NavigationItem'}>
    <NavLink to={props.link} exact className={props.active ? 'active' : null}>{props.children}</NavLink>
  </li>
)


export default navigationItem
