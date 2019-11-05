import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import {parse} from '../../../../protocols/entityChat'

import Classes from './ChatInput.css'

class ChatInput extends Component {
  speechActSelect = React.createRef()
  entityTypeSelect = React.createRef()
  entityIdSelect = React.createRef()
  messageText = React.createRef()

  state = {
    isProtocolMessage: false,
    selectedEntityType: ""
  }

  sendHandler = () => {
    const text = this.messageText.current.value
    const teamId = this.props.teamId
    this.props.addMessage(text, teamId)
    this.messageText.current.value = ""
    this.speechActSelect.current.value = ""
    this.entityTypeSelect.current.value = ""
    this.entityIdSelect.current.value = ""
    this.highlightProtocolMessage()
  }

  highlightProtocolMessage = () => {
    try {
      parse(this.messageText.current.value)
      // parsed successfully
      this.setState({isProtocolMessage: true})
    } catch (e) {
      // console.log(e)
      // not parsed successfully
      this.setState({isProtocolMessage: false})
    }  
  }

  handleSpeechActSelection = () => {
    const speechAct = this.speechActSelect.current.value
    const parts = this.messageText.current.value.split(" ")
    if (parts) {
      // TODO fix - won't work well if using more than 1 space
      this.messageText.current.value = speechAct + " " + parts.slice(1, parts.length).join(" ")
    } else {
      this.messageText.current.value = speechAct + " "
    }
    this.highlightProtocolMessage()
  }

  handleEntityTypeSelection = () => {
    const entityType = this.entityTypeSelect.current.value
    this.setState({selectedEntityType: entityType})
    const parts = this.messageText.current.value.split(" ")
    if (parts) {
      // TODO fix - won't work well if using more than 1 space
      const speechAct = parts[0]
      const rest = parts.length > 2 ? " " + parts.slice(2, parts.length).join(" ") : ""
      this.messageText.current.value = speechAct + " " + entityType + rest
    } else {
      this.messageText.current.value = entityType
    }
    this.highlightProtocolMessage()
  }

  handleEntityIdSelection = () => {
    const entityId = this.entityIdSelect.current.value
    const parts = this.messageText.current.value.split(" ")
    const newParts = []
    if (parts.length > 0) newParts.push(parts[0])   // speechAct
    if (parts.length > 1) newParts.push(parts[1])   // entityType
    newParts.push(entityId)
    if (parts.length > 3) newParts.push(parts.slice(3, parts.length).join(" "))   // rest
    this.messageText.current.value = newParts.join(" ")
    this.highlightProtocolMessage()
  }

  handleKeyPressed = (event) => {
    if (event.key === "Enter") {
      event.preventDefault()
      this.sendHandler()
    }
  }

  render() {
    const textInputColor = this.state.isProtocolMessage ? {backgroundColor: 'lightblue'} : {}
    const textStyle = {...textInputColor, width: '99%'}
    return (
      <div className={'ChatInput'}>
        <div className={'InputForm'}>
          <textarea ref={this.messageText} placeholder="Your message" rows="3" onChange={this.highlightProtocolMessage} onKeyPress={this.handleKeyPressed} style={textStyle}></textarea>
          <br/>
          <select ref={this.speechActSelect} onChange={this.handleSpeechActSelection}>
            <option key="" value="">(Action)</option>
          {this.props.speechActs.map((speechAct, i) => (<option key={speechAct} value={speechAct}>{speechAct}</option>))}
          </select>
          <select ref={this.entityTypeSelect} onChange={this.handleEntityTypeSelection}>
            <option key="" value="">(Entity type)</option>
          {this.props.entityTypes.map((entityType, i) => (<option key={entityType} value={entityType}>{entityType}</option>))}
          </select>
          <select ref={this.entityIdSelect} onChange={this.handleEntityIdSelection}>
            <option key="" value="">(Entity Id)</option>
            {_.get(this.props.idsByType, this.state.selectedEntityType, []).map((id, i) => (<option key={id.id} value={id.id}>{id.id} - {_.truncate(id.text)}</option>))}
          </select>
        </div>
      </div>
    )
  }

}

ChatInput.propTypes = {
  speechActs: PropTypes.arrayOf(PropTypes.string)
}

export default ChatInput
