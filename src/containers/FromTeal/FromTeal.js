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
              Hi, my name is Udi.
              Every now & then, my mind comes up with ideas for new
              projects. I really want to build these projects, but
              it usually takes more than one person to build something
              that's really great. So, I decided to build an app to help people like me to
              <strong> team-up with like-minded people</strong> in order to
              <strong> realize their dream projects</strong>. See how it works:
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
