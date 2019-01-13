import React, { Component } from 'react';
import './Teams.css';
import TeamList from '../components/TeamList/TeamList'
import TeamForm from '../components/TeamForm/TeamForm'
import Login from '../components/Login/Login'
import AuthContext from './auth-context'


class Teams extends Component {
  state = {
    isAuth: false,
    teams: [
      { name: "Manual Pilot" },
      { name: "W2M" },
      { name: "fromTeal" }
    ]
  }

  toggleAuth = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        isAuth: !prevState.isAuth
      }
    })
  }

  createTeamHandler = (name) => {
    console.log("creating team")
    const newTeams = [...this.state.teams]
    newTeams.push({name: name})
    this.setState({teams: newTeams})
  }

  openTeamHandler = (name) => {
    console.log("openning team " + name)
  }

  render() {
    return (
      <div className="Teams">
        <AuthContext.Provider
          value={{ isAuth: this.state.isAuth, toggleAuth: this.toggleAuth }}
        >
          <Login/>
          <TeamList
            teams={this.state.teams}
            clicked={this.openTeamHandler}/>
          <TeamForm clickHandler={this.createTeamHandler}/>
        </AuthContext.Provider>
      </div>
    );
  }
}

export default Teams;
