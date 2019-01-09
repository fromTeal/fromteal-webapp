import React, {Component} from 'react'


class TeamForm extends Component {
  constructor(props) {
    super(props)
    this.submit = this.submit.bind(this)
    this.form = React.createRef()
  }

  submit() {
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
          <input type="button" value="Create" onClick={this.submit}/>
        </form>
      </div>
    )
  }

}

export default TeamForm
