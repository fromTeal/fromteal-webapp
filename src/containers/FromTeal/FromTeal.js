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
            <p>
              Hi, my name is Udi & I'm a software developer from Boston.
              Every now & then, my mind comes up with ideas for new
              projects. I really want to build these projects, but
              it usually takes more than one person to build something
              that's really great. So, I decided to build an app to help people like me to
              <strong> team-up with like-minded people</strong> in order to
              <strong> realize their dream projects</strong>.
            </p>
          </div>

          <div class="container">
            <img src={dibauAvatar} alt="Avatar"></img>
            <p>
              There are many apps to facilitate teams work, but this app is intended for
              <strong> self-managed teams</strong>, that are driven by shared <strong>purpose</strong>,
              & strive to fully express their members <strong>wholeness</strong>.
              Such teams are known as <strong>"Teal Organizations"</strong>, a term introduced
              in a book called <a href="http://www.reinventingorganizations.com/">"Reinventing Organizations"</a>,
              which I really recommend you to read, so you'll understand why I think
              self-managed teams are the future.
            </p>
          </div>


          <div class="container">
            <img src={dibauAvatar} alt="Avatar"></img>
              <p>As the team has no managers, we need a way
                to decide on how to manage equity, & split the
                project's profits once it has some. For that purpose,
                the app manages a digital currency for each team,
                & keeps tap of member's contributions. Future versions of the app
                will extend the digital currency into a smart contract for establishing a
                <strong> continuous organization</strong> (or DAO), in order to enable teams
                to raise funds & manage their cash flow, in a fair & owner-less way.
            </p>
          </div>

      <div class="container">
        <img src={dibauAvatar} alt="Avatar"></img>
          <p>
            If you're like me, & wish to work on what you love, love your work,
            & make a living out of it, you're invited to try the app.
          <br/>
      </p>

            <FirebaseAuth />
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
