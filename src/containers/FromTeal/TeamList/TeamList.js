import React from 'react'
import Team from '../Team/Team'

const TeamList = ({teams, clicked}) => teams.map(team => (
  <Team
    name={team.name}
    key={team.name}
    clickHandler={() => clicked(team.name)}/>
  ))

export default TeamList
