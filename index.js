const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

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
        const orderCollection = database.collection('bookFeature');

        // get data 

        app.get('/features', async (req, res) => {
            const cursor = featureCollection.find({});
            const features = await cursor.toArray();
            res.send(features)
        })

        // find single data 
        app.get('/features/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting feature', id)
            const query = { _id: ObjectId(id) };
            const feature = await featureCollection.findOne(query);
            res.json(feature);
        })


        // post data 
        app.post('/features', async (req, res) => {
            const feature = req.body;

            const result = await featureCollection.insertOne(feature);
            console.log(result);
            res.json(result)
        })

        // post data 
        app.post('/bookFeature', async (req, res) => {
            const feature = req.body;
            const result = await orderCollection.insertOne(feature);

            console.log(result)
            res.json(result);
        })

        // get Order 
        app.get('/bookticket', async (req, res) => {
            const cursor = orderCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
            console.log(result);
        })


        // delete Order 
        app.delete('/bookticket/:id', async (req, res) => {
            const id = req.params.id;
            const query={_id:ObjectId(id)};
            const result=await orderCollection.deleteOne(query);
            res.send(result);
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


