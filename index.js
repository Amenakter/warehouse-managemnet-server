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

