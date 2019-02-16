import React, { Component } from 'react';
import './Teams.css';
import TeamList from '../../components/TeamList/TeamList'
import TeamForm from '../../components/TeamForm/TeamForm'
import Modal from '../../components/UI/Modal/Modal'
import Button from '../../components/UI/Button/Button'
import Login from '../../components/Login/Login'
import AuthContext from '../auth-context'


class Teams extends Component {
  state = {
    isAuth: false,
    teams: [
      { name: "Manual Pilot" },
      { name: "W2M" },
      { name: "fromTeal" }
    ],
    creatingNewTeam: false,
  }

  toggleAuth = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        isAuth: !prevState.isAuth
      }
    })
  }

  cancelCreateTeam = () => {
    this.setState({creatingNewTeam: false})
  }

  showTeamForm = () => {
    this.setState({creatingNewTeam: true})
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
          value={{ isAuth: this.state.isAuth, toggleAuth: this.toggleAuth }}>
          <Login/>
          <TeamList
            teams={this.state.teams}
            clicked={this.openTeamHandler}/>
          <Button btnType="Success" clicked={this.showTeamForm}>Create new team</Button>
          <Modal show={this.state.creatingNewTeam} modalClosed={this.cancelCreateTeam}>
            <TeamForm clickHandler={this.createTeamHandler} cancelCreateTeam={this.cancelCreateTeam}/>
          </Modal>
        </AuthContext.Provider>
      </div>
    );
  }
}

export default Teams;
