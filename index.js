const express = require('express');
var cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// midelwere
app.use(cors());
app.use(express.json())





var uri = "mongodb://local-eats-discovery:vuQeazZOIiF2EOdi@ac-wotlaa2-shard-00-00.0rmdzda.mongodb.net:27017,ac-wotlaa2-shard-00-01.0rmdzda.mongodb.net:27017,ac-wotlaa2-shard-00-02.0rmdzda.mongodb.net:27017/?ssl=true&replicaSet=atlas-as340s-shard-0&authSource=admin&retryWrites=true&w=majority";
// const uri = `local-eats-discovery:vuQeazZOIiF2EOdi@ac-wotlaa2-shard-00-00.0rmdzda.mongodb.net:27017,ac-wotlaa2-shard-00-01.0rmdzda.mongodb.net:27017,ac-wotlaa2-shard-00-02.0rmdzda.mongodb.net:27017/?ssl=true&replicaSet=atlas-as340s-shard-0&authSource=admin&retryWrites=true&w=majority`;
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
        // await client.connect();
        const foodItems = client.db('local-eats-discovery-server').collection('items')
        const restaurants = client.db('local-eats-discovery-server').collection('restaurants')
        const allUsers = client.db('local-eats-discovery-server').collection('allUsers')

       

        app.get('/items', async (req, res) => {
            const cursor = restaurants.find()
            const result = await cursor.toArray()
            res.send(result)

        })
        // all restaurants
        app.get('/all-restaurants', async (req, res) => {
            const cursor = restaurants.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // newUser
        app.post('/added-user', async (req, res) => {
            const body = req.body
            const result = await allUsers.insertOne(body)
            res.send(result)
        })

        // single restaruant access
        app.get('/single-restaurants/:id', async (req, res) => {
            const id = req.params.id;
            
            const quary = {_id : new ObjectId(id)}
            const result = await restaurants.findOne(quary)
           
            res.send(result)

        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('local-eats-discovery is open')
})

app.listen(port, () => {
    console.log(`local-eats-discovery running on ${port}`);
})