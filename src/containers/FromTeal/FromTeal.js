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

import dibauAvatar from '../../assets/images/dibau.jpg'


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
          <div class="container">
            <img src={dibauAvatar} alt="Avatar"></img>
            <p>Hi, my name is Udi & I'm a software developer from Boston.
            Every now & then, my mind comes up with ideas for new
            projects. I really want to build these projects, but
            it usually takes more than one person to build something
            that's really good. So, I decided to build an app called fromTeal, in order
            to enable people like me to:
          </p>
          <ul>
            <li><strong>Work on what they love</strong> & realize their projects</li>
            <li><strong>Love their work</strong> through collaboration with a team of like minded people</li>
            <li><strong>Make a living out of it</strong> by making the projects profitable so they can work on them full-time</li>
          </ul>

            <span class="time-right">11:00</span>
          </div>

          <div class="container">
            <img src={dibauAvatar} alt="Avatar"></img>
            <p>Sign-in to get started:</p>
            <FirebaseAuth />
            <span class="time-right">11:00</span>
          </div>
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
