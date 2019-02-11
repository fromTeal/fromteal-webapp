import React, { Component } from 'react'

import Modal from '../../components/UI/Modal/Modal'


const withErrorHandler = (WrappedComponent) => {
    return class extends Component {
      state = {
        error: null
      }

      componentWillMount() {
        // TODO setup interceptors/listeners for errors
      }

      componentWillUnmount() {
        // TODO destroy interceptors/listeners for errors
      }

      errorConfirmedHandler = () => {
        this.setState({error: null})
      }

      render() {
        return (
          <React.Fragment>
            <Modal
              modalClosed={this.errorConfirmedHandler}
              show={this.state.error}>
              {this.state.error ? this.state.error.message : null}
            </Modal>
            <WrappedComponent {...this.props} />
          </React.Fragment>

        )
      }
    }


}

export default withErrorHandler
