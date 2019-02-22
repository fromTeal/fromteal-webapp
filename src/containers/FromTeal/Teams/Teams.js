import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Team from '../Team/Team';
import './Teams.css';

class Teams extends Component {
    state = {
        teams: []
    }

    componentDidMount () {
        console.log( this.props );
        // axios.get( '/teams' )
        //     .then( response => {
        //         const teams = response.data.slice( 0, 4 );
        //         const updatedPosts = teams.map( team => {
        //             return {
        //                 ...team,
        //                 tags: 'something'
        //             }
        //         } );
        //         this.setState( { teams: updatedTeams } );
        //         // console.log( response );
        //     } )
        //     .catch( error => {
        //         console.log( error );
        //         // this.setState({error: true});
        //     } );
        this.setState({
          teams: [
            {
              id: "fromTeal",
              name: "fromTeal",
              purpose: "enable people to work on what they love, love their work, & make a living out of it.",
              tags: "organizing"
            },
            {
                id: "manual-pilot",
                name: "Manual Pilot",
                purpose: "help you spend more time on the things that are important to you.",
                tags: "life"
            },
            {
              id: "w2m",
              name: "W2M",
              purpose: "empower people to handle more information",
              tags: "visualization"
            }
          ]
        })
    }

    teamSelectedHandler = ( id ) => {
        // this.props.history.push({pathname: '/teams/' + id});
        this.props.history.push( '/teams/' + id );
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
