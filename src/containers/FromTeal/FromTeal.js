import React, { Component } from 'react';
// import axios from 'axios';
import { Route, NavLink, Switch, Redirect } from 'react-router-dom';

import './FromTeal.css';
import Teams from './Teams/Teams';
import TeamChannel from './TeamChannel/TeamChannel';
import asyncComponent from '../../hoc/asyncComponent';
// import NewTeam from './NewTeam/NewTeam';

const AsyncNewTeam = asyncComponent(() => {
    return import('./NewTeam/NewTeam');
});

class FromTeal extends Component {
    state = {
        auth: true
    }

    render () {
        return (
            <div className="FromTeal">
                {/* <Route path="/" exact render={() => <h1>Home</h1>} />
                <Route path="/" render={() => <h1>Home 2</h1>} /> */}
                <Switch>
                    {this.state.auth ? <Route path="/new-team" component={AsyncNewTeam} /> : null}
                    <Route path="/teams/:id" exact component={TeamChannel} />
                    <Route path="/teams" exact component={Teams} />
                    {/* <Route render={() => <h1>Not found</h1>}/> */}
                    {/* <Redirect from="/" to="/teams" /> */}
                    {/* <Route path="/" component={Teams} /> */}
                </Switch>
            </div>
        );
    }
}

export default FromTeal;
