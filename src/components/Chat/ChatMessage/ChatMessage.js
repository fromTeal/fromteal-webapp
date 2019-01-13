import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classes from './ChatMessage.css'


class ChatMessage extends Component {

  render() {
    let message = null

    switch ( this.props.type ) {
      case ('text-message'):
        message = <div className={'TextMessage'}><pre>{this.props.text}</pre></div>
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
        <div className={'ChatMessage'}>
          <div className={'SpeechAct'}>{this.props.speechAct}</div>
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
