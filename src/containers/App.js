import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import FromTeal from './FromTeal/FromTeal'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <FromTeal />
        </div>
      </BrowserRouter>
    )
  }

}

export default App
