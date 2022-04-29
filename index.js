const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()


app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.NAME}:${process.env.PASS}@cluster0.xqhbp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const bookCollection = client.db("Books").collection("collections");
        const user = { name: "Amena Akter", email: "amenakter27@gmail.com" };
        const result = await bookCollection.insertOne(user);
        console.log(result);

        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = bookCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
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

