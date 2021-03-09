import React, { Component } from 'react'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import TeamChannel from '../TeamChannel/TeamChannel';



class TeamMilestoneChannel extends Component {
 
    render() {
        const teamId = this.props.match.params.id
        const milestone = this.props.match.params.milestone
        const milestoneChannelId = teamId + "|" + milestone    

        return (
            <TeamChannel teamId={teamId} channelId={milestoneChannelId} milestone={milestone}></TeamChannel>
        )
    }

}


export default withErrorHandler(TeamMilestoneChannel)