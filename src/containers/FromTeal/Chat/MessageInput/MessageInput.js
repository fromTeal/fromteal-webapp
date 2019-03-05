import React, { Component } from 'react'

import SuggestionBar from './SuggestionBar/SuggestionBar'
import TextInput from './TextInput/TextInput'


class MessageInput extends Component {

  suggestions = [];
  description = ""
  selectedSuggestion = "";
  currentMessage = null
  currentText = ""

  textChangedHandler = (text) => {

  }

  textEnteredHandler = (text) => {

  }

  suggestionClickHandler = (suggestion) => {
    this.selectedSuggestion = suggestion
  }


  render() {
    return (
      <React.Fragment>
        <SuggestionBar
          suggestions={this.suggestions}
          description={this.description}
          suggestionClicked={this.suggestionClickHandler} />
        <TextInput
          suggestion={this.selectedSuggestion}
          textChanged={this.textChangedHandler}
          textEntered={this.textEnteredHandler}/>
      </React.Fragment>
    )
  }


}


export default MessageInput
