const express = require('express');
const app = express();
const jsonwebtoken = require('jsonwebtoken');
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.NAME}:${process.env.PASS}@cluster0.xqhbp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const bookCollection = client.db("Books").collection("collections");
        const MyCollection = client.db("Books").collection("myItems");

        // inventory item load
        app.get('/book', async (req, res) => {
            const query = {};
            const cursor = bookCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        // go update and restock inventory
        app.get('/book/:id', async (req, res) => {
            const findId = (req.params.id);
            const search = { _id: ObjectId(findId) }
            const result = await bookCollection.findOne(search);
            res.send(result)
        })

        // insert inventories
        app.post('/book', async (req, res) => {
            const newBook = req.body;
            const result = await bookCollection.insertOne(newBook);
            res.send(result)
        })

        // delete manageinventories
        app.delete("/book/:id", async (req, res) => {
            const deletedBookId = req.params.id;
            const query = { _id: ObjectId(deletedBookId) }
            const result = await bookCollection.deleteOne(query)
            res.send(result);
        })


        // added items find
        app.get('/addeditems', async (req, res) => {
            const query = {}
            const cursor = MyCollection.find(query);
            const items = await cursor.toArray();
            res.send(items)
        })

        // added items load
        app.post('/addedItems', async (req, res) => {
            const newBook = req.body;
            const result = await MyCollection.insertOne(newBook);
            res.send(result)
        })

        // 
        app.get('/addedItems/:id', async (req, res) => {
            const findId = (req.params.id);
            const search = { _id: ObjectId(findId) }
            const result = await MyCollection.findOne(search);
            res.send(result)
        })

        app.delete("/addedItems/:id", async (req, res) => {
            const deleteItem = req.params.id;
            const query = { _id: ObjectId(deleteItem) }
            const result = await MyCollection.deleteOne(query)
            res.send(result);
        })

        // myItems
        app.get('/addedItems', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = MyCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        //----------------------------------------------- 
        //Quantity updated
        app.put('/book/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const updateUser = req.body;
            console.log(updateUser);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updateUser.newQuantity,

                },
            };
            const result = await bookCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })


    }
    finally {

    }
}
run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('hello bro');
})

app.listen(port, () => {
    console.log('it is running', port)
})

