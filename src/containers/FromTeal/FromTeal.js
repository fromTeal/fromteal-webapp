import React, { Component } from 'react';
// import axios from 'axios';
import { Route, NavLink, Switch, Redirect } from 'react-router-dom';

import './FromTeal.css';
import Teams from './Teams/Teams';
import TeamChannel from './TeamChannel/TeamChannel';
import FirebaseAuth from '../Auth/FirebaseAuth'
import asyncComponent from '../../hoc/asyncComponent';
import AuthContext from '../auth-context'
import Layout from '../../hoc/Layout/Layout'

const AsyncNewTeam = asyncComponent(() => {
    return import('./NewTeam/NewTeam');
});

class FromTeal extends Component {

    state = {
        isAuth: false,
        user: null
    }

    componentDidMount = () => {
      this.checkAuth()
    }

    checkAuth = () => {
      const user = localStorage.getItem('user')
      if (user) {
        console.log(user)
        this.toggleAuth(true, user)
        this.setState({user: user})
      }
    }

    toggleAuth = (isSignedIn, user) => {
      console.log("toggleAuth")
      this.setState(prevState => {
        return {
          ...prevState,
          isAuth: isSignedIn,
          user: user
        }
      })
    }

    render () {
      let content = (
        <div>
          <h1>Welcome to fromTeal!</h1>
          <p>Please sign-in:</p>
          <FirebaseAuth />
        </div>
      )
      if (this.state.isAuth) {
        content = (
          <Switch>
              {this.state.isAuth ? <Route path="/new-team" component={AsyncNewTeam} /> : null}
              <Route path="/teams/:id" exact component={TeamChannel} />
              <Route path="/teams" exact component={Teams} />
              <Route path="/auth" exact component={FirebaseAuth} />
              <Route path="/" exact component={Teams} />
              {/* <Route render={() => <h1>Not found</h1>}/> */}
              {/* <Redirect from="/" to="/teams" /> */}
              {/* <Route path="/" component={Teams} /> */}
          </Switch>
        )
      }

      return (
        <AuthContext.Provider
          value={{ isAuth: this.state.isAuth, user: this.state.user, toggleAuth: this.toggleAuth }}>
          <Layout>
            <div className="FromTeal">
              {content}
            </div>
          </Layout>
        </AuthContext.Provider>
      )
    }
}

export default FromTeal;
