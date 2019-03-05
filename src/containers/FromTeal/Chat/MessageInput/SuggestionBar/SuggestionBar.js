import React from 'react'


const suggestionBar = (props) => {

  const suggestions = props.suggestions.map(suggestion => (
      <span onclick={() => props.suggestionClicked(suggestion)}>{suggestion}</span>
    ))

  return (
    <React.Fragment>
      <div className={'SuggestionDescription'}>
        {props.description}
      </div>
      <div className={'Suggestions'}>
        {suggestions}
      </div>
    </React.Fragment>
  )
}

export default suggestionBar
