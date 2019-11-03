import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {parse} from '../../../../protocols/entityChat'

import Classes from './ChatInput.css'

class ChatInput extends Component {
  speechActSelect = React.createRef()
  entityTypeSelect = React.createRef()
  entityIdInput = React.createRef()
  messageText = React.createRef()

  state = {
    isProtocolMessage: false
  }

  sendHandler = () => {
    const speechAct = this.speechActSelect.current.value
    const entityType = this.entityTypeSelect.current.value
    const entityId = this.entityIdInput.current.value
    const text = this.messageText.current.value
    const teamId = this.props.teamId
    this.props.addMessage(text, teamId, speechAct, entityType, entityId)
    this.messageText.current.value = ""
    this.entityIdInput.current.value = ""
  }

  highlightProtocolMessage = () => {
    try {
      parse(this.messageText.current.value)
      // parsed successfully
      this.setState({isProtocolMessage: true})
    } catch (e) {
      // not parsed successfully
      this.setState({isProtocolMessage: false})
    }  
  }

  render() {
    const textStyle = this.state.isProtocolMessage ? {backgroundColor: 'lightblue'} : {}
    return (
      <div className={'ChatInput'}>
        <div className={'InputForm'}>
          <select ref={this.speechActSelect}>
            <option key="" value="">(Action)</option>
          {this.props.speechActs.map((speechAct, i) => (<option key={speechAct} value={speechAct}>{speechAct}</option>))}
          </select>
          <select ref={this.entityTypeSelect}>
            <option key="" value="">(Entity type)</option>
          {this.props.entityTypes.map((entityType, i) => (<option key={entityType} value={entityType}>{entityType}</option>))}
          </select>
          <input type="text" placeholder="(Entity id)" ref={this.entityIdInput}/>
          <br/>
          <textarea ref={this.messageText} placeholder="Your message" rows="3" onChange={this.highlightProtocolMessage} style={textStyle}></textarea>
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
