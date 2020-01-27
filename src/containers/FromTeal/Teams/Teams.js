import React, { Component } from 'react';
import firebase from '../../../firebase/firebase-config'
import axios from 'axios'

import Team from '../Team/Team';
import './Teams.css';


const TEAMS_ENDPOINT = `https://us-central1-${process.env.REACT_APP_FIREBASE_PROJECT_ID}.cloudfunctions.net/getMyTeams`


class Teams extends Component {
    state = {
        teams: []
    }

    componentDidMount () {
        console.log( this.props );
        firebase.auth().currentUser.getIdToken(true).then((idToken) => {

            axios.get( TEAMS_ENDPOINT, {headers: {'me': idToken}} )
                .then( response => {
                    console.log(response.data)
                    const teams = response.data.slice( 0, 4 );
                    const updatedTeams = teams.map( team => {
                        return {
                            ...team,
                            id: team.name
                        }
                    } );
                    this.setState( { teams: updatedTeams } );
                    // console.log( response );
                } )
                .catch( error => {
                    console.log( error );
                    // this.setState({error: true});
                } );

        }).catch(function(error) {
            console.log( error );
            // Handle error
        });



    }

    teamSelectedHandler = ( id ) => {
        // this.props.history.push({pathname: '/teams/' + id});
        this.props.history.push( '/my_teams/' + id );
    }

    render () {
        let teams = <p style={{ textAlign: 'center' }}>Something went wrong!</p>;
        if ( !this.state.error ) {
            teams = this.state.teams.map( team => {
                return (
                    // <Link to={'/teams/' + team.id} key={team.id}>
                    <Team
                        key={team.id}
                        name={team.name}
                        purpose={team.purpose}
                        tags={team.tags}
                        members={team.members}
                        clicked={() => this.teamSelectedHandler( team.id )} />
                    // </Link>
                );
            } );
        }

        return (
            <div>
                <section className="Teams">
                    {teams}
                </section>
            </div>
        );
    }
}

export default Teams;
