const test = require('firebase-functions-test')()
const admin = require('firebase-admin')
const chai = require('chai')
const assert = chai.assert
const sinon = require('sinon')

const myFunctions = require('../index')


// describe('Cloud Functions', () => {
//     let myFunctions, adminInitStub, adminFirestoreStub

//     before(() => {
//       adminInitStub = sinon.stub(admin, 'initializeApp')
//       adminFirestoreStub = sinon.stub(admin, 'firestore')
      
//       myFunctions = require('../index')
//     })

//     after(() => {
//         adminInitStub.restore()
//         adminFirestoreStub.restore()
//         test.cleanup()
//     })



// })


