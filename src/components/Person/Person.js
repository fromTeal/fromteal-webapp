import React from 'react'

const person = (props) => {
  return (
    <div className="App">
      <h1>Person: {props.name} age: {props.age}</h1>
    </div>

  )
}

export default person;
