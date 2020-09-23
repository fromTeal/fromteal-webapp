import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classes from './ChatMessage.css'

import dibauAvatar from '../../../../assets/images/dibau.jpg'



class ChatMessage extends Component {



  render() {
    // TODO find nicer way to do this
    if (!window.progSendMessage) {
      window.progSendMessage = this.props.progSendMessage
    }

    let message = null

    switch ( this.props.type ) {
      case ('text-message'):
        // TODO cache the regexes
        const speechRegex = /\[(.*?)\]/g
        const strongRegex = /\_(.*?)\_/g
        
        let msgText = this.props.text.replace(speechRegex, (match, code, id) => `<strong><a href='javascript:progSendMessage("${match}")'>${match}</a><strong>`)
        msgText = msgText.replace(strongRegex, (match, code, id) => {
          match = match.replace(/_/g, "")
          return `<br/><strong>${match}</strong>`
        })
        
        message = <div className={'TextMessage'} dangerouslySetInnerHTML={{__html: 
          msgText}}></div>
        break
      case ('image-message'):
        message = <div className={'ImageMessage'}><img src={this.props.imageUrl} width="250px"/></div>
        break
      case ('link-message'):
        message = <div className={'LinkMessage'}><a href={this.props.url} target="_blank">{this.props.description || this.props.url}</a></div>
        break
      default:
        message = null
    }

    return (
        <div className={'container'}>
          <img src={this.props.userPicture} alt={this.props.userName}></img>
          <span className={'SpeechActRight'}>{this.props.speechAct}  {this.props.entityType} {this.props.entityId}</span>
          <strong>{this.props.userName}</strong><br/>
          <span className="ChatMessageTime">{this.props.created.toDate().toLocaleString()}</span><br/><br/>
          {message}
        </div>
    )
  }

}

ChatMessage.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string,
  speechAct: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  description: PropTypes.string,
  url: PropTypes.string
}



export default ChatMessage
