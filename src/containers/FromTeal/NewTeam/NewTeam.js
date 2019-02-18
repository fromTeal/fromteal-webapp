import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import './NewTeam.css';

class NewTeam extends Component {
    state = {
        name: '',
        content: '',
        author: 'Max',
        submitted: false
    }

    componentDidMount () {
        // If unauth => this.props.history.replace('/teams');
        console.log( this.props );
    }

    postDataHandler = () => {
        const data = {
            title: this.state.title,
            body: this.state.content,
            author: this.state.author
        };
        // axios.post( '/teams', data )
        //     .then( response => {
        //         console.log( response );
        //         this.props.history.replace('/teams');
        //         // this.setState( { submitted: true } );
        //     } );
    }

    render () {
        let redirect = null;
        if (this.state.submitted) {
            redirect = <Redirect to="/teams" />;
        }
        return (
            <div className="NewTeam">
                {redirect}
                <h1>Create new team</h1>
                <label>Initial name</label>
                <input type="text" value={this.state.name} onChange={( event ) => this.setState( { name: event.target.value } )} />
                <label>Initial purpose</label>
                <textarea rows="4" value={this.state.purpose} onChange={( event ) => this.setState( { purpose: event.target.value } )} />
                <label>Tags</label>
                <input type="text" value={this.state.tags} onChange={( event ) => this.setState( { tags: event.target.value } )} />
                <button onClick={this.postDataHandler}>Create team</button>
            </div>
        );
    }
}

export default NewTeam;
