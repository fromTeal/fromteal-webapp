import React, { Component } from 'react'
import firebase from '../../../firebase/firebase-config'
import Chat from '../Chat/Chat'
import ChatInput from '../Chat/ChatInput/ChatInput'
import Spinner from '../../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import AuthContext from '../../auth-context'

class TeamChannel extends Component {
  static contextType = AuthContext

  state = {
    messages: [],
    lastMessage: null,
    speechActs: [
      "suggest",
      "discuss",
      "approve",
      "decline",
      "delete",
      "list",
      "invite",
      "add",
      // the following aren't supported yet
      // "apply",
      // "deactivate",
      // "defer",
      // "notify",
      // "remove",
      // "release",
      // "replace",
      // "start",
      // "validate"
    ],
    entityTypes: [
      "purpose",
      "logo",
      "name",
      "description",
      "intro",
      "tag",
      "tool",
      "member",
      // the following aren't supported yet
      // "product-concept",
      // "ux-spec",
      // "tech-spec",
      // "use-case",
      // "user",
      // "metric",
      // "progress"
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
    db.collection(`messages/simple/${teamId}`).orderBy("created")
        .onSnapshot((querySnapshot) => {
          this.setState({loading: false})
          querySnapshot.docChanges().forEach((change) => {
            // TODO handle other changes - update & delete!
            if (change.type === "added") {
              this.setState((prevState) => {
                const lastMessage = change.doc.data()
                  const newMessages = [...prevState.messages]
                  newMessages.push(lastMessage)
                  return {
                    ...prevState,
                    messages: newMessages,
                    lastMessage: lastMessage
                  }
                })
              }
            })
        });
  }

  addMessage = (speechAct, entityType, entityId, text, teamId) => {
    const newMessage = {
      type: "text-message",
      text: text,
      user: this.context.user.email,
      userName: this.context.user.name,
      userPicture: this.context.user.picture,
      created: new Date()
    }
    if (speechAct !== "") {
      newMessage.speechAct = speechAct
    }
    if (entityType !== "") {
      newMessage.entityType = entityType
    }
    if (entityId !== "") {
      newMessage.entityId = entityId
    }

    // check if the previous message was a question 
    // - if it is, we can assume this message is an answer & mark it as a reply to the previous message
    if (this.state.lastMessage && 
      (this.state.lastMessage.speechAct === 'ask' || this.state.lastMessage.speechAct === 'confirm')) {
      newMessage.inReplyTo = this.state.lastMessage
    }
    const db = firebase.firestore()
    db.collection(`messages/simple/${teamId}`).add(newMessage)
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
        <ChatInput
          teamId={this.props.match.params.id}
          speechActs={this.state.speechActs}
          entityTypes={this.state.entityTypes}
          addMessage={this.addMessage}/>
      </React.Fragment>
    )

  }

}


export default withErrorHandler(TeamChannel)
