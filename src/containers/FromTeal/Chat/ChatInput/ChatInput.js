import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Classes from './ChatInput.css'

class ChatInput extends Component {
  speechActSelect = React.createRef()
  entityTypeSelect = React.createRef()
  entityIdInput = React.createRef()
  messageText = React.createRef()

  sendHandler = () => {
    const speechAct = this.speechActSelect.current.value
    const entityType = this.entityTypeSelect.current.value
    const entityId = this.entityIdInput.current.value
    const text = this.messageText.current.value
    const teamId = this.props.teamId
    this.props.addMessage(speechAct, entityType, entityId, text, teamId)
    this.messageText.current.value = ""
    this.entityIdInput.current.value = ""
  }

  render() {
    return (
      <div className={'ChatInput'}>
        <div className={'InputForm'}>
          <select ref={this.speechActSelect}>
          {this.props.speechActs.map((speechAct, i) => (<option key={speechAct} value={speechAct}>{speechAct}</option>))}
          </select>
          <select ref={this.entityTypeSelect}>
          {this.props.entityTypes.map((entityType, i) => (<option key={entityType} value={entityType}>{entityType}</option>))}
          </select>
          <input type="text" placeholder="Entity-id" ref={this.entityIdInput}/>
          <br/>
          <textarea ref={this.messageText} placeholder="Your message" rows="3"></textarea>
          <button className="SendButton" onClick={this.sendHandler}>Send</button>
        </div>
      </div>
    )
  }

}

ChatInput.propTypes = {
  speechActs: PropTypes.arrayOf(PropTypes.string)
}

export default ChatInput
