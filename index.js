const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const URL = 'mongodb://localhost:27017'
const DB_NAME = 'myproject'

MongoClient.connect(URL, (err, client) => {
    assert.equal(null, err)
    console.log('Connected successfully to the server')    

    const db = client.db(DB_NAME)

    client.close()
})