import React from 'react'

import classes from './TextInput.css'


const textInput = (props) => {


  return (
    <textarea
      onchange={props.textChanged}
      rows="3">
    </textarea>
  )

}


export default textInput
