import React, { Component } from 'react'
import Classes from './Layout.css'

import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'

class Layout extends Component {

  state = {
    showSideDrawer: false
  }

  sideDrawerClosedHandler = () => {
    this.setState({showSideDrawer: false})
  }

  sideDrawerToggleHander = () => {
    this.setState((prevState) => {
      return {showSideDrawer: !prevState.showSideDrawer}
    })
  }

  render() {
     return (
      <React.Fragment>
        <Toolbar drawerToggleClicked={this.sideDrawerToggleHander}/>
        <SideDrawer open={this.state.showSideDrawer} closed={this.sideDrawerClosedHandler}/>
        <main className={'Content'}>
          {this.props.children}
        </main>
      </React.Fragment>
    )
  }

}

export default Layout
