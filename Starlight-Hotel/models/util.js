const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const connection = require("./config/config.js");

const getMongoClient = () => {
  const uri = `mongodb+srv://${connection.USERNAME}:${connection.PASSWORD}@${connection.SERVER}/${connection.DATABASE}?retryWrites=true&w=majority&appName=Spring-2025`;
  return new MongoClient(uri);
};

const findAll = async (collection, query) => {
  return collection.find(query).toArray().catch(err => {});
};

const findOne = async (collection, id) => {
  return collection.findOne({ _id: new mongodb.ObjectId(id) }).catch(err => {});
};

const insertOne = async (collection, document) => {
  return collection.insertOne(document)
    .catch(err => {
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
