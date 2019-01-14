import React, { Component } from 'react'
import firebase from '../../firebase/firebase-config'
import Chat from '../../components/Chat/Chat'
import ChatInput from '../../components/Chat/ChatInput/ChatInput'
import TeamForm from '../../components/TeamForm/TeamForm'
import Modal from '../../components/UI/Modal/Modal'
import Button from '../../components/UI/Button/Button'


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
    creatingNewTeam: false
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

  cancelCreateTeam = () => {
    this.setState({creatingNewTeam: false})
  }

  showTeamForm = () => {
    this.setState({creatingNewTeam: true})
  }

  render() {
    return (
      <React.Fragment>
        <Modal show={this.state.creatingNewTeam} modalClosed={this.cancelCreateTeam}>
          <TeamForm clickHandler={this.createTeam} cancelCreateTeam={this.cancelCreateTeam}/>
        </Modal>
        <Chat messages={this.state.messages}/>
        <ChatInput speechActs={this.state.speechActs} addMessage={this.addMessage}/>
        <Button btnType="Success" clicked={this.showTeamForm}>Create new team</Button>
      </React.Fragment>
    )

  }

}


export default TeamChannel
