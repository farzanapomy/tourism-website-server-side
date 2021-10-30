const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const { serialize } = require('bson');

const app = express();

// middleware 

app.use(cors());
app.use(express.json())

require('dotenv').config()
const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjoai.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)

async function run() {
    try {
        await client.connect();

        const database = client.db('travelTour');
        const featureCollection = database.collection('features');

        // get data 

        app.get('/features', async (req, res) => {
            const cursor = featureCollection.find({});
            const features = cursor.toArray();
            res.send(features)
        })




        // post data 
        app.post('/features', async (req, res) => {
            const feature = req.body;

            const result = await featureCollection.insertOne(feature);
            console.log(feature);
            res.json(result)
        })



    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir)






app.get('/', (req, res) => {
    res.send('server is live');
});

app.listen(port, () => {
    console.log("server is running from port ", port);
})


