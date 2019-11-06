import React, { Component } from 'react';
// import axios from 'axios';
import { Route, NavLink, Switch, Redirect } from 'react-router-dom';

import './FromTeal.css';
import Teams from './Teams/Teams';
import TeamChannel from './TeamChannel/TeamChannel';
import FirebaseAuth from '../Auth/FirebaseAuth'
import FirebaseLogout from '../Auth/FirebaseLogout'
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
        this.setAuthState(true, user)
      }
    }

    setAuthState = (isAuth, user) => {
        console.log(`setAuthState: ${isAuth}`)
        this.setState(prevState => {
            return {
                ...prevState,
                isAuth: isAuth,
                user: user
            }
        })
    }

    render () {
      const iframeStyle = {marginLeft: '7%'}

      let content = (
        <div>
          <div className="container">
            <img src={dibauAvatar} alt="Avatar"/>
            <p>
            Every person in this world is valuable. We all have ideas &amp; skills to create value for others.
            No person is more important than any other &amp; everyone have the right to be free to work on what they love, without anyone telling them what to do &amp; what to work on.
            <br/><br/>
            <strong>fromTeal</strong> is helping people to create <strong><a href="https://en.wikipedia.org/wiki/Teal_organisation">Teal Organizations</a></strong> - teams of people with shared purpose, working together as equal partners to achieve their purpose.
            If you've ever been to a Hackathon - then you experienced what's it like to work in a Teal Organization & how much it's more effective than any other type of organization.
            <br/><br/>
            Here's how fromTeal works:
            </p>

            <iframe style={iframeStyle} width="500" height="350" src="//speakerdeck.com/player/7b754d59b56446598afccdf8c56de28c"/>

            <FirebaseAuth />
          </div>
        </div>
      )
      if (this.state.isAuth) {
        content = (
          <Switch>
              {this.state.isAuth ? <Route path="/new-team" component={AsyncNewTeam} /> : null}
              <Route path="/my_teams/:id" exact component={TeamChannel} />
              <Route path="/my_teams" exact component={Teams} />
              <Route path="/auth" exact component={FirebaseAuth} />
              <Route path="/logout" exact component={FirebaseLogout} />
              <Route path="/" exact component={Teams} />
              {/* <Route render={() => <h1>Not found</h1>}/> */}
              {/* <Redirect from="/" to="/teams" /> */}
              {/* <Route path="/" component={Teams} /> */}
          </Switch>
        )
      }

      return (
        <AuthContext.Provider
              value={{ isAuth: this.state.isAuth, user: this.state.user, setAuthState: this.setAuthState }}>
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
