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


describe('data-processing functions', () => {

    it("should count frequencies", () => {
        const arr = ["a", "d", "a", "b", "a", "d", "a", "c"]
        const expected = {
            "a": 4,
            "d": 2,
            "b": 1,
            "c": 1
        }
        const got = myFunctions.countFrequency(arr)
        assert.deepEqual(got, expected)
    })

    it("should return object keys sorted by values", () => {
        const obj = {
            "c": 1,
            "a": 4,
            "b": 1,
            "d": 2
        }
        const expected = ["c", "b", "d", "a"]
        const got = myFunctions.keysSortedByValues(obj)
        assert.deepEqual(got, expected)
    })

})