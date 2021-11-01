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

// console.log(uri)

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
            // console.log(result);
            res.json(result)
        })

        // post data 
        app.post('/bookFeature', async (req, res) => {
            const feature = req.body;
            const result = await orderCollection.insertOne(feature);

            // console.log(result)
            res.json(result);
        })

        // get Order 
        app.get('/myOrders', async (req, res) => {
            const cursor = orderCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
            // console.log(result);
        })




        // get data 
        app.get('/myOrders/:email', async (req, res) => {
            const email = req.params.email;
            const cursor = orderCollection.find({ email: email });
            const result = await cursor.toArray()
            // console.log(result);
            res.send(result)
        })



        // approve data 
        // app.put('/myOrders/:id', async (req, res) => {
        //     const id=req.params.id;
        //     const approveOrder=req.body;
        //     const filter={_id:ObjectId(id)};
        //     const options={upsert:true}
        //     const updatedDoc={
        //         $set:{
        //             name:approveOrder.name,
        //             email:approveOrder.email,
        //             address:approveOrder.address,
        //             // status:"approved"
        //         }
        //     }
        //     const result=await orderCollection.updateOne(filter,updatedDoc,options)
        //     console.log('update',id)
        //     res.json(result)
        // })



        // delete Order 
        app.delete('/myOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            // console.log(query)
            res.send(result);
        })


    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('server is live');
});

app.listen(port, () => {
    console.log("server is running from port ", port);
})


