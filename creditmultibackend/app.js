const express = require('express');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 5001;
const accountRoutes = require('./routes/accountRoutes');


// load data


// MongoDB connection URL with authentication options
let url = 'mongodb://localhost:27017/';
let filename = './accounts.json'
const dbName = 'bankDB';
const collectionName = 'accountCol';

// notice you have to load the array of gifts into the data object
const data = JSON.parse(fs.readFileSync(filename, 'utf8')).docs;

// connect to database and insert data into the collection
async function loadData() {
    const client = new MongoClient(url);

    try {
        // Connect to the MongoDB client
        await client.connect();
        console.log("Connected successfully to server");

        // database will be created if it does not exist
        const db = client.db(dbName);

        // collection will be created if it does not exist
        const collection = db.collection(collectionName);
        let cursor = await collection.find({});
        let documents = await cursor.toArray();

        if(documents.length == 0) {
            // Insert data into the collection
            const insertResult = await collection.insertMany(data);
            console.log('Inserted documents:', insertResult.insertedCount);
        } else {
            console.log("Accounts already exists in DB")
        }
    } catch (err) {
        console.error(err);
    } finally {
        // Close the connection
        await client.close();
    }
}

loadData();





// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/account', accountRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bankDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const accountSchema = new mongoose.Schema({
    id: String,
});

const Account = mongoose.model('Account', accountSchema);

// API endpoint to get accounts
app.get('/accounts', async (req, res) => {
    try {
        const accounts = await Account.find({});
        res.json(accounts);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
