import React, { Component } from 'react'
import firebase from '../../../firebase/firebase-config'
import Chat from '../Chat/Chat'
import ChatInput from '../Chat/ChatInput/ChatInput'
import Spinner from '../../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'

class TeamChannel extends Component {
  state = {
    messages: [],
    speechActs: [
      "notification",
      "ask-to-join",
      "suggest-tool",
      "ask-for-advice-on-tool",
      "approve-tool",
    ],
    loading: true
  }


  componentDidMount() {
    const teamId = this.props.match.params.id
    const db = firebase.firestore();
    // Disable deprecated features
    db.settings({
      timestampsInSnapshots: true
    });
    db.collection(`communicate/${teamId}/messages`).orderBy("created")
        .onSnapshot((querySnapshot) => {
          this.setState({loading: false})
          querySnapshot.docChanges().forEach((change) => {
            // TODO handle other changes - update & delete!
            if (change.type === "added") {
              this.setState((prevState) => {
                  const newMessages = [...prevState.messages]
                  newMessages.push(change.doc.data())
                  return {
                    ...prevState,
                    messages: newMessages
                  }
                })
              }
            })
        });
  }

  addMessage = (speechAct, text, teamId) => {
    const db = firebase.firestore()
    db.collection(`communicate/${teamId}/messages`).add({
        type: "text-message",
        speechAct: speechAct,
        text: text,
        user: "dibaunaumh@gmail.com",
        created: new Date()
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }

  render() {
    let chat = <Chat messages={this.state.messages}/>
    if (this.state.loading) chat = <Spinner />

    return (
      <React.Fragment>
        {chat}
        <ChatInput teamId={this.props.match.params.id} speechActs={this.state.speechActs} addMessage={this.addMessage}/>
      </React.Fragment>
    )

  }

}


export default withErrorHandler(TeamChannel)
