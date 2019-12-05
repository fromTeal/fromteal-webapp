import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown'
import firebase from '../../firebase/firebase-config'

import classes from './DynamicContent.css'



class DynamicContent extends Component {

    state = {
        content: ''
    }
    
    fetchContent = (id) => {
        const db = firebase.firestore();
        // Disable deprecated features
        db.settings({
            timestampsInSnapshots: true
        });
        console.log(`running query for id: ${id}`)
        return db.collection('page_content').doc(id).get()
    } 

    componentDidMount = () => {
        this.fetchContent(this.props.contentId).then((doc) => {
            console.log("Query returned")
            console.log(doc)
            console.log(doc.data())
            const items = doc.data().content || []
            this.setState({content: items.join("\n")})
        })
    }
 
    render () {
        return (
        <div className={'DynamicContent'}>
            <ReactMarkdown source={this.state.content} />
        </div>
        )
    }

}


export default DynamicContent
