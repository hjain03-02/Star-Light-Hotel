const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const connection = require("./config/config.js");

// const connection = require("../server/config/config");

// Accessing values from connection object
console.log(connection.USERNAME);  // Check if the username is properly populated
console.log(connection.PASSWORD);  // Check if the password is properly populated
console.log(connection.SERVER);    // Check if the server is properly populated
console.log(connection.DATABASE);  // Check if the database name is properly populated


const getMongoClient = () => {
  const uri = `mongodb+srv://${connection.USERNAME}:${connection.PASSWORD}@${connection.SERVER}/${connection.DATABASE}?retryWrites=true&w=majority&appName=Spring-2025`;
  console.log(`📡 Connecting to MongoDB Atlas: ${uri}`);
  return new MongoClient(uri);
};

const findAll = async (collection, query) => {
  return collection.find(query).toArray().catch(err => {
    console.log("❌ Could not find", query, err.message);
  });
};

const findOne = async (collection, id) => {
  return collection.findOne({ _id: new mongodb.ObjectId(id) }).catch(err => {
    console.log(`❌ Could not find document with id=${id}`, err.message);
  });
};

const insertOne = async (collection, document) => {
  return collection.insertOne(document)
    .then(res => console.log("✅ Inserted document ID:", res.insertedId))
    .catch(err => {
      console.log("❌ Could not insert document:", err.message);
      if (!(err.name === 'BulkWriteError' && err.code === 11000)) throw err;
    });
};

const logRequest = async (req, res) => {
  const client = getMongoClient();
  try {
    await client.connect();
    const collection = client.db().collection("Requests");
    const log = {
      Timestamp: new Date(),
      Method: req.method,
      Path: req.url,
      Query: req.query,
      StatusCode: res.statusCode,
    };
    await insertOne(collection, log);
  } catch (err) {
    console.log("❌ Could not log request:", err);
  } finally {
    await client.close();
  }
};

const util = {
  getMongoClient,
  logRequest,
  findAll,
  findOne,
  insertOne,
};

module.exports = util;
