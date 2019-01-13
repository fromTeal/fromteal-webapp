import React, { Component } from 'react'

import Layout from '../components/Layout/Layout'
import TeamChannel from './TeamChannel/TeamChannel'

class App extends Component {
  render() {
    return (
      <div>
        <Layout>
          <TeamChannel/>
        </Layout>
      </div>
    )
  }

}

export default App
