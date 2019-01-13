import React from 'react'

import classes from './Chat.css'

import ChatMessage from './ChatMessage/ChatMessage'

const chat = ( props ) => {

  return (
    <div id="chat" className={'Chat'}>
      {props.messages.map((msg, i) => (
        <ChatMessage key={"msg_" + i} {...msg}/>
      ))}
    </div>
  )

}

export default chat
