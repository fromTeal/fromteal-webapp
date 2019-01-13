import React, { Component } from 'react'
import firebase from '../../firebase/firebase-config'
import Chat from '../../components/Chat/Chat'
import ChatInput from '../../components/Chat/ChatInput/ChatInput'


class TeamChannel extends Component {
  state = {
    messages: [],
    speechActs: [
      "notification",
      "ask-to-join",
      "suggest-tool",
      "ask-for-advice-on-tool",
      "approve-tool",
    ]
  }


  componentDidMount() {
    const db = firebase.firestore();
    // Disable deprecated features
    db.settings({
      timestampsInSnapshots: true
    });
    db.collection("communicate/fromTeal/messages").orderBy("created")
        .onSnapshot((querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
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

  addMessage = (speechAct, text) => {
    const db = firebase.firestore();
    db.collection("communicate/fromTeal/messages").add({
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
    return (
      <React.Fragment>
        <Chat messages={this.state.messages}/>
        <ChatInput speechActs={this.state.speechActs} addMessage={this.addMessage}/>
      </React.Fragment>
    )

  }

}


export default TeamChannel
