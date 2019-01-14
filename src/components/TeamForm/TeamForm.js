import React, {Component} from 'react'

import Button from '../UI/Button/Button'


class TeamForm extends Component {
  constructor(props) {
    super(props)
    this.submit = this.submit.bind(this)
    this.form = React.createRef()
  }

  submit = () => {
    this.props.clickHandler(this.form.current[0].value)
    this.form.current.reset()
  }

  render() {
    return (
      <div className="team-form">
        <h4>Create new team:</h4>
        <form ref={this.form}>
          <input
            type="text"
            name="name"
            placeholder="Team name"
          />
          <br/>
          <Button btnType="Success" clicked={this.submit}>Create</Button>
          <Button btnType="Danger" clicked={this.props.cancelCreateTeam}>Cancel</Button>

        </form>
      </div>
    )
  }

}

export default TeamForm
