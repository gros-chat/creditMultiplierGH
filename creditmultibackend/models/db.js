const MongoClient = require('mongodb').MongoClient;

// MongoDB connection URL with authentication options
let url ='mongodb://localhost:27017/'

let dbInstance = null;
const dbName = "bankDB";

async function connectToDatabase() {
    if (dbInstance){
        return dbInstance
    };

    const client = new MongoClient(url);

    await client.connect();
    dbInstance = client.db(dbName);
    return dbInstance;
}

module.exports = connectToDatabase;