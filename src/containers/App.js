import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Layout from '../hoc/Layout/Layout'
import TeamChannel from './TeamChannel/TeamChannel'
import Teams from './Teams/Teams'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Layout>
            <Route path="/" exact component={TeamChannel} />
            <Route path="/teams" exact component={Teams} />
          </Layout>
        </div>
      </BrowserRouter>
    )
  }

}

export default App
