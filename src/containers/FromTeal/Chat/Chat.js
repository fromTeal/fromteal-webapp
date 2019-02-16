import React, {Component} from 'react'

import classes from './Chat.css'

import ChatMessage from './ChatMessage/ChatMessage'


class Chat extends Component {

  chat = React.createRef()

  componentDidUpdate() {
    // scroll to bottom
    const chatDiv = this.chat.current
    chatDiv.scrollTop = chatDiv.scrollHeight
  }

  render() {
    return (
      <div ref={this.chat} className={'Chat'}>
        {this.props.messages.map((msg, i) => (
          <ChatMessage key={"msg_" + i} {...msg}/>
        ))}
      </div>
    )
  }

}

export default Chat
