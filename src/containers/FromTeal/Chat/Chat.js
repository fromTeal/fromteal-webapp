import React, {Component} from 'react'

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
      <div ref={this.chat}>
        {this.props.messages.map((msg, i) => (
          <ChatMessage key={"msg_" + i} {...msg} progSendMessage={this.props.progSendMessage}/>
        ))}
      </div>
    )
  }

}

export default Chat
