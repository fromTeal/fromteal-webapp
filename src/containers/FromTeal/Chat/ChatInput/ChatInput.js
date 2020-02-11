import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import {parse} from '../../../../protocols/entityChat'

import Classes from './ChatInput.css'


const stages = {
  SPEECH_ACT: "speechAct",
  ENTITY_TYPE: "entityType",
  EXISTING_ENTITY_ID: "existingEntityId",
  NEW_ENTITY_ID: "newEntityId",
  ENTITY_TEXT: "entityText",
  INVALID: "invalid",
  DONE: "done"
}


class ChatInput extends Component {
  speechActSelect = React.createRef()
  entityTypeSelect = React.createRef()
  entityIdSelect = React.createRef()
  messageText = React.createRef()

  state = {
    isProtocolMessage: false,
    selectedSpeechAct: "",
    selectedEntityType: "",
    stage: stages.SPEECH_ACT
  }

  sendHandler = () => {
    const text = this.messageText.current.value
    const teamId = this.props.teamId
    this.props.addMessage(text, teamId)
    this.messageText.current.value = ""
    this.speechActSelect.current.value = ""
    this.entityTypeSelect.current.value = ""
    this.entityIdSelect.current.value = ""
    this.setState({stage: stages.SPEECH_ACT})
    this.parseMessage()
  }

  parseMessage = () => {
    // side effect: mark state.isProtocolMessage
    try {
      const parsedMsg = parse(this.messageText.current.value)
      // parsed successfully
      this.setState({isProtocolMessage: true})
      return parsedMsg
    } catch (e) {
      // console.log(e)
      // not parsed successfully
      this.setState({isProtocolMessage: false})
      return {}
    }  
  }

  determineStage = (parsedMsg) => {
    console.log("parsed msg:")
    console.log(parsedMsg)
    if (parsedMsg) {
      const tokens = this.messageText.current.value.split(" ")
      if (tokens.length === 1) return stages.SPEECH_ACT
      if (tokens.length === 2) {
        const speechAct = tokens[0]
        this.setState({selectedSpeechAct: speechAct})
        return stages.ENTITY_TYPE
      }
      if (tokens.length === 3) {
        const entityType = tokens[1]
        this.setState({selectedEntityType: entityType})
        return stages.EXISTING_ENTITY_ID
      }
    }
    return stages.DONE
  }

  handleTextChange = () => {
    const parsedMsg = this.parseMessage()
    this.setState({stage: this.determineStage(parsedMsg)})
  }

  injectSuggestion = (suggestion) => {
    const parts = this.messageText.current.value.split(" ")
    switch (this.state.stage) {
      case stages.SPEECH_ACT:
        this.setState({selectedSpeechAct: suggestion})
        if (parts) {
          // TODO fix - won't work well if using more than 1 space
          this.messageText.current.value = suggestion + " " + parts.slice(1, parts.length).join(" ")
        }
        break
      case stages.ENTITY_TYPE:
        this.setState({selectedEntityType: suggestion})
        if (parts) {
          // TODO fix - won't work well if using more than 1 space
          const speechAct = parts[0]
          const rest = parts.length > 2 ? " " + parts.slice(2, parts.length).join(" ") : ""
          this.messageText.current.value = speechAct + " " + suggestion + rest
        }
        break
      case stages.EXISTING_ENTITY_ID:
        this.setState({selectedEntityType: suggestion})
        const newParts = []
        if (parts.length > 0) newParts.push(parts[0])   // speechAct
        if (parts.length > 1) newParts.push(parts[1])   // entityType
        newParts.push(suggestion)
        if (parts.length > 3) newParts.push(parts.slice(3, parts.length).join(" "))   // rest
        this.messageText.current.value = newParts.join(" ")
        break
    }
    if (!parts) {
      this.messageText.current.value = suggestion + " "
    }
    this.parseMessage()
  } 

  handleSuggestionClick = (e) => {
    this.injectSuggestion(e.target.id)
  }

  handleSpeechActSelection = () => {
    const speechAct = this.speechActSelect.current.value
    return this.injectSuggestion(speechAct)
  }

  handleEntityTypeSelection = () => {
    const entityType = this.entityTypeSelect.current.value
    return this.injectSuggestion(entityType)
  }

  handleEntityIdSelection = () => {
    const entityId = this.entityIdSelect.current.value
    return this.injectSuggestion(entityId)
  }

  handleKeyPressed = (event) => {
    if (event.key === "Enter") {
      event.preventDefault()
      this.sendHandler()
    }
  }

  getSuggestions = (howMany) => {
    let options = []
    console.log(`stage is ${this.state.stage}`)
    switch (this.state.stage) {
      case stages.SPEECH_ACT:
        options = this.props.speechActs
        break
      case stages.ENTITY_TYPE:
        options = _.get(this.props.entityTypesBySpeechAct, this.state.selectedSpeechAct, [])
        break
      case stages.EXISTING_ENTITY_ID:
        options = _.get(this.props.idsByType, this.state.selectedEntityType, []).map(id => id.id)
        break
    }
    return options.slice(0, howMany)
  }

  render() {
    const textInputColor = this.state.isProtocolMessage ? {backgroundColor: 'lightblue'} : {}
    const textStyle = {...textInputColor, width: '99%'}
    const optionsSuggestionListStyle = {display: 'flex', flexFlow: 'row nowrap', border: 'solid green 0.5px', justifyContent: 'center'}
    const optionSuggestionStyle = {width: '200px'}
    let suggestions = this.getSuggestions(3)
    let options = suggestions.map( opt => {
      return (
          <div key={opt} style={optionSuggestionStyle} id={opt} onClick={this.handleSuggestionClick}>{opt}</div>              
      );
    })
    return (
      <div className={'ChatInput'}>
        <div className={'InputForm'}>
          <div style={optionsSuggestionListStyle}>
            {options}
          </div>
          <textarea ref={this.messageText} placeholder="Your message" rows="3" onChange={this.handleTextChange} onKeyPress={this.handleKeyPressed} style={textStyle}></textarea>
          <br/>
          <select ref={this.speechActSelect} onChange={this.handleSpeechActSelection}>
            <option key="" value="">(Action)</option>
          {this.props.speechActs.map((speechAct, i) => (<option key={speechAct} value={speechAct}>{speechAct}</option>))}
          </select>
          <select ref={this.entityTypeSelect} onChange={this.handleEntityTypeSelection}>
            <option key="" value="">(Entity type)</option>
            {_.get(this.props.entityTypesBySpeechAct, this.state.selectedSpeechAct, []).map((entityType, i) => (<option key={entityType} value={entityType}>{entityType}</option>))}
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
