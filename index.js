require("dotenv").config()
const MongoClient = require("mongodb").MongoClient
const assert = require("assert")

const { MONGODB_URI, MONGODB_DBNAME } = process.env

MongoClient.connect(MONGODB_URI, (err, client) => {
  assert.equal(null, err)
  console.log("Connected to MongoDB!")

  const db = client.db(MONGODB_DBNAME)

  client.close()
})
