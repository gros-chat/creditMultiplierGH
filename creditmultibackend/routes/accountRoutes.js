const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const { MongoClient } = require('mongodb');



// check connection
router.get('/', async (req, res, next) => {
    try {
        console.log("hi");
        const db = await connectToDatabase();

        try {
            await client.connect(); // Connect to the MongoDB server
        
            const database = client.db('bankDB'); // Specify the database name
            const collection = database.collection('accountcol'); // Specify the collection name
        
            const query = {}; // Query to find all documents
        
            const documents = await collection.find(query).toArray(); // Get all documents in the collection
        
            const documentIds = documents.map(doc => doc._id); // Extract _id values from each document
        
            return documentIds; // Return the array of _id values
          } catch (error) {
            console.error('Error retrieving document ids:', error);
          } finally {
            await client.close(); // Close the connection to the MongoDB server
          }
        
        res.send("ok");

    }catch(e){
        next (e);
    }

});

// Get a single account by ID
router.get('/accountByName/:name', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("accountCol");
        const account = await collection.findOne({ name: req.params.name});

        if (!account) {
            return res.status(404).send("Account not found");
        }

        res.json(account);
    } catch (e) {
        next(e);
    }
});

// create Account 
router.post('/', async (req, res, next) => {
    console.log("hi");
    try {
        const db = await connectToDatabase();
        const collection = db.collection("accountCol");
        // const document = {
        //     "id": "bankZophia_ClientRon",
        //     "debit": "100",
        //     "credit": "0"
        //   }
        // const account = await collection.insertOne(req.body);
        const document = req.body;
        const account = await collection.insertOne(document);
        // collection.insertOne(document, function(err, result) {
        //     if (err) {
        //       console.log('Error inserting document:', err);
        //     } else {
        //       console.log('Document inserted successfully:', result);
        //     }
        //     client.close();
        //   });
        

        // res.status(201).json(account.ops[0]);
       res.send("account created");
    } catch (e) {
        next(e);
    }
});

router.get('/getAccNames', async (req, res, next) =>{
    const uri = 'mongodb://localhost:27017'; // Connection string for MongoDB
    const client = new MongoClient(uri);
  
    try {
      await client.connect(); // Connect to the MongoDB server
  
      const database = client.db('bankDB'); // Specify the database name
      const collection = database.collection('accountCol'); // Specify the collection name
  
      const query = {}; // Query to find all documents
  
      const projection = { name: 1, _id: 0 }; // Projection to only include the "name" field
  
      const documents = await collection.find(query).project(projection).toArray(); // Get all documents and project only the "name" field
  
      const names = documents.map(doc => doc.name); // Extract the value of the "name" field from each document
  
      res.json(names); // Return the array of "name" values
    } catch (error) {
      next(e);
    } finally {
      await client.close(); // Close the connection to the MongoDB server
    }
  });

  router.post('/update-credit', async(req, res) => {

    console.log("hi credit");
    // const name = req.body.name;
    // const filter = { name: name };
    // console.log(name);
    const update = { $inc: { "credit.0": 100 } };
    const url ='mongodb://localhost:27017';
  
        try{
            const db = await connectToDatabase();
            const collection = db.collection("accountCol");
            const theAccount = await collection.findOne({ name: req.body.name });
            console.log(theAccount);
            
            if(theAccount){
                const upDatedAcc = await collection.updateOne({name: req.body.name}, {$push: {"credit": req.body.credit}});
               return res.send("credit updated");
            }else{
                return res.send("account not found");
            }
            

            } catch(e){
               return res.send(e);

            }
  });

  router.post('/update-debit', async(req, res) => {

    console.log("hi dedit");
    const url ='mongodb://localhost:27017';
  
        try{
            const db = await connectToDatabase();
            const collection = db.collection("accountCol");
            const theAccount = await collection.findOne({ name: req.body.name });
            console.log(theAccount);
            
            if(theAccount){
                const upDatedAcc = await collection.updateOne({name: req.body.name}, {$push: {"debit": req.body.debit}});
               return res.send("debit updated");
            }else{
                return res.send("account not found");
            }
            

            } catch(e){
               return res.send(e);

            }

      
  });

module.exports = router;