const express = require('express');
const app = express();

//cors
const cors = require("cors");
app.use(cors())

//url
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


require("dotenv").config()


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://vitalHub:.codeworld101.@cluster0.iduz7rm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const vitalHubDB = client.db("vitalHubDB");
        const usersCollection = vitalHubDB.collection("usersCollection");
        const prescriptionCollection = vitalHubDB.collection("prescriptionCollection")

        app.get('/vitalUsers', async (req, res) => {
            const cursor = usersCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/vitalUsers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.findOne(query);
            res.send(result)
        })

        app.post('/vitalUsers', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })



        app.get('/prescriptions', async (req, res) => {
            const cursor = prescriptionCollection.find()
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get("/prescriptions/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await prescriptionCollection.findOne(query);
            res.send(result)
        })

        app.post('/prescriptions', async (req, res) => {
            const prescription = req.body;
            const result = await prescriptionCollection.insertOne(prescription)
            res.send(result)
        })

        app.put('/prescriptions/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const prescriptionBody = req.body
            const updateDoc = {
                $set: {
                    medicineName: prescriptionBody.medicineName,
                    startingDate: prescriptionBody.startingDate,
                    endingDate: prescriptionBody.endingDate,
                    beforeMeal: prescriptionBody.beforeMeal,
                    timeBeforeMeal: prescriptionBody.timeBeforeMeal,
                    beforeDayNoonNight: prescriptionBody.beforeDayNoonNight,
                    afterMeal: prescriptionBody.afterMeal,
                    timeAfterMeal: prescriptionBody.timeAfterMeal,
                    afterDayNoonNight: prescriptionBody.afterDayNoonNight
                },
            };
            const result = await prescriptionCollection.updateOne(query, updateDoc, options);
            res.send(result)
        })

        app.delete('/prescriptions/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await prescriptionCollection.deleteOne(query);
            res.send(result)
        })



        app.get('/myList/:email', async (req, res) => {
            const result = await prescriptionCollection.find({ email: req.params.email }).toArray();
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get("/", async (req, res) => {
    res.send("Vital Hub Server is running")
})

module.exports = app;