import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Layout from '../hoc/Layout/Layout'
import FirebaseAuth from './Auth/FirebaseAuth'

import FromTeal from './FromTeal/FromTeal'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Layout>
            <FromTeal />
          </Layout>
        </div>
      </BrowserRouter>
    )
  }

}

export default App
