import React from 'react'
import Classes from './Layout.css'

const layout = ( props ) => (
  <React.Fragment>
    <div>Toolbar, SideDrawer, Backdrop</div>
    <main className={'Content'}>
      {props.children}
    </main>
  </React.Fragment>
)

export default layout
