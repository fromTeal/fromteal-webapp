import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Classes from './ChatInput.css'

class ChatInput extends Component {
  speectActSelect = React.createRef()
  messageText = React.createRef()

  sendHandler = () => {
    const speechAct = this.speectActSelect.current.value
    const text = this.messageText.current.value
    this.props.addMessage(speechAct, text)
    this.messageText.current.value = ""
  }

  render() {
    return (
      <div className={'ChatInput'}>
        <div className={'InputForm'}>
          <select ref={this.speectActSelect}>
          {this.props.speechActs.map((speechAct, i) => (<option key={speechAct} value={speechAct}>{speechAct}</option>))}
          </select>
          <br/>
          <textarea ref={this.messageText} placeholder="Your message" cols="80" rows="3"></textarea>
          <input type="button" className="SendButton" onClick={this.sendHandler} value="Send"/>
        </div>
      </div>
    )
  }

}

ChatInput.propTypes = {
  speechActs: PropTypes.arrayOf(PropTypes.string)
}

export default ChatInput
