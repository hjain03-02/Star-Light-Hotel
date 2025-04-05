(() => {
    const mongodb = require('mongodb');
    const MongoClient = mongodb.MongoClient;
    const connection = require("./config/config");

    const getMongoClient = (local = true) => {
        let uri = `mongodb+srv://${connection.USERNAME}:${connection.PASSWORD}@${connection.SERVER}/${connection.DATABASE}?retryWrites=true&w=majority&appName=Spring-2025`;
        if (local) {
            uri = `mongodb://127.0.0.1:27017/${connection.DATABASE}`;
        }
        console.log(`Connection String<<${uri}`);
        return new MongoClient(uri);
    };

    const findAll = async (collection, query) => {
        return collection.find(query).toArray()
            .catch(err => {
                console.log("Could not find ", query, err.message);
            });
    };

    const findOne = async (collection, id) => {
        return collection.findOne({ _id: new mongodb.ObjectId(id) })
            .catch(err => {
                console.log(`Could not find document with id=${id}`, err.message);
            });
    };

    const deleteMany = async (collection, query) => {
        return collection.deleteMany(query)
            .catch(err => {
                console.log("Could not delete many ", query, err.message);
            });
    };

    const deleteOne = async (collection, query) => {
        return collection.deleteOne(query)
            .catch(err => {
                console.log("Could not delete one ", query, err.message);
            });
    };

    const insertMany = async (collection, documents) => {
        return collection.insertMany(documents)
            .then(res => console.log("Data inserted with IDs", res.insertedIds))
            .catch(err => {
                console.log("Could not add data ", err.message);
                if (!(err.name === 'BulkWriteError' && err.code === 11000)) throw err;
            });
    };

    const insertOne = async (collection, document) => {
        return await collection.insertOne(document)
            .then(res => console.log("Data inserted with ID", res.insertedId))
            .catch(err => {
                console.log("Could not add data ", err.message);
                if (!(err.name === 'BulkWriteError' && err.code === 11000)) throw err;
            });
    };

    const logRequest = async (req, res) => {
        const client = getMongoClient();
        client.connect()
            .then(conn => {
                console.log('Connected successfully to MongoDB!');
                let collection = client.db().collection("Requests");
                let log = {
                    Timestamp: new Date(),
                    Method: req.method,
                    Path: req.url,
                    Query: req.query,
                    'Status Code': res.statusCode,
                };
                util.insertOne(collection, log);
            })
            .catch(err => console.log(`Could not connect to MongoDB Server\n${err}`))
            .finally(() => {
                client.close(); // Close the connection
                console.log('Disconnected');
            });
    };

    const util = {
        url: 'localhost',
        username: 'webuser',
        password: 'letmein',
        port: 22643,
        database: 'forum',
        collections: ['logs', 'posts', 'users', 'roles'],
        getMongoClient: getMongoClient,
        logRequest: logRequest,
        findAll: findAll,
        findOne: findOne,
        insertOne: insertOne,
        insertMany: insertMany,
    };

    const moduleExport = util;
    if (typeof __dirname != 'undefined') module.exports = moduleExport;
})();
