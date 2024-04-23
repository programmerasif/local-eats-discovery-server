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
        const reviewsCollection = client.db('local-eats-discovery-server').collection('reviews')

       

        app.get('/items', async (req, res) => {
            const cursor = restaurants.find()
            const result = await cursor.toArray()
            res.send(result)

        })

        // all user 
        app.get('/get-users', async (req, res) => {
          const cursor = allUsers.find()
          const result = await cursor.toArray()
          res.send(result)

      })
        // all restaurants*******************************************************************
        app.get('/all-restaurants', async (req, res) => {
            try{ const cursor = restaurants.find()
                const result = await cursor.toArray()
                res.send(result)
            }
            catch (error) {
                console.error('Error all-restaurants:', error);
                res.status(500).send('Internal Server Error');
              }            
        })

        // added-user**************************************************************************
        app.post('/added-user', async (req, res) => {

            try{ 
                const body = req.body
                const quary= {email : body.email}
                const isabilavle = await allUsers.findOne(quary)
                if (isabilavle) {
                    return res.send({message : 'Already have'})
                  }
               
            const result = await allUsers.insertOne(body)
            res.send(result)
            }
            catch (error) {
                console.error('Error added-user:', error);
                res.status(500).send('Internal Server Error');
              }
            

        })


        app.get('/user/:id', async (req, res) => {
          try {
              const id = req.params.id;
              const user = await allUsers.findOne({ _id: new ObjectId(id) });
              if (user) {
                  res.send(user);
              } else {
                  res.status(404).send({ message: 'User not found' });
              }
          } catch (error) {
              console.error('Error retrieving user:', error);
              res.status(500).send('Internal Server Error');
          }
      });


        // single restaruant access********************************************************
        app.get('/single-restaurant/:id', async (req, res) => {

            try{
                const id = req.params.id;
            
                const quary = {_id : new ObjectId(id)}
                const result = await restaurants.findOne(quary)
               
                res.send(result)
            } catch (error) {
                console.error('Error single restaruant access:', error);
                res.status(500).send('Internal Server Error');
              }
        })


        // add new restaurants*****************************************************************************
        app.post('/added-new-restarunt', async (req, res) => {

          try{ 
              const body = req.body
              const quary= {ownerEmail : body.ownerEmail}
              const isabilavle = await restaurants.findOne(quary)
              if (isabilavle) {
                  return res.send({message : 'Already have'})
                }
             
          const result = await restaurants.insertOne(body)
          res.send(result)
          }
          catch (error) {
              console.error('Error added-user:', error);
              res.status(500).send('Internal Server Error');
            }
          

      })



      app.patch('/update-restarunt/:id', async (req, res) => {
        try {
          const id = req.params.id; 
          const { restaurant_name, place_name, name, ratings, email, uid, ownerEmail, 
            opening_time, image, phoneNumber, location } = req.body; 
      
          const { latitude, longitude } = location;
      
          const query = { uid: id };
          const updateDoc = {
            $set: { 
              name,
              restaurant_name,
              place_name,
              ratings,
              email,
              uid,
              ownerEmail,
              opening_time,
              image,
              phoneNumber,
              location: {
                latitude,
                longitude,
              },
            },
          };
          
          const result = await restaurants.updateOne(query, updateDoc);
          res.send(result);
        } catch (error) {
          console.error('Error updating restaurant data:', error);
          res.status(500).send('Internal Server Error'); 
        }
      });


      
        // user data update *************************************************************
        app.patch('/user-update/:id', async (req, res) => {
          try {
            const id = req.params.id;
            const { name, email, phNumber, place_name, location } = req.body;
        
            const { latitude, longitude, address } = location;
        
            const query = { uid: id };
            const updateDoc = {
              $set: {
                name,
                email,
                phNumber,
                place_name,
                location: {
                  latitude,
                  longitude,
                  address,
                },
              },
            };
            const result = await allUsers.updateOne(query, updateDoc);
            res.send(result);
          } catch (error) {
            console.error('Error user data update:', error);
            res.status(500).send('Internal Server Error');
          }
        });
        
          // updated name ****************************************************************
          app.patch('/name-update/:email',async(req,res) =>{
            try{
            const email = req.params.email;
            const {name, phNumber} = req.body
            const quary = {email : email}
            const updateDoc = {
              $set: {
                name,
                phNumber,
              },
            };
            const result= await allUsers.updateOne(quary,updateDoc)
            res.send(result)
        }catch (error) {
            console.error('Error user data update:', error);
            res.status(500).send('Internal Server Error');
          }
          })

    app.put('/single-restaurant-item-update/:id', async (req, res) => {
      try {
        const id = req.params.id;
      
        const newItem = req.body; 
    
        // Update the query to match the uid field
        const query = { uid: id };
        const update = { $push: { food_items: newItem } };
    
        const result = await restaurants.updateOne(query, update);
    
        res.send(result);
      } catch (error) {
        console.error('Error updating restaurant:', error);
        res.status(500).send('Internal Server Error');
      }
    });
        
        
          // identify the users**************************************************************************
          app.get('/verify-user/:email', async (req, res) => {

            try{
                const email = req.params.email;
                const quary = {email : email }
                const result = await allUsers.findOne(quary)
                if (result.role == 'admin' ) {
                  res.send({ role:'admin'})
                }
                if (result.role == 'owner' ) {
                  res.send( { role:'owner'})
                }
                else {
                  res.send( { role:'user'})
                 }
                
            } catch (error) {
                console.error('Error identify the admin:', error);
                res.status(500).send('Internal Server Error');
              }
        })


        // **** For review 

      app.post('/review', async(req, res) => {
        try{ 

          const { rating, comment, email, uid, uniqueId, image, name } = req.body;

          const review = {
            rating,
            comment,
            email,
            uid,
            uniqueId,
            image,
            name
          }
          const result = await reviewsCollection.insertOne(review)
          res.send(result)
        }catch (error) {
          console.error('Error added-user:', error);
          res.status(500).send('Internal Server Error');
        }

      })


      app.get('/reviews', async (req, res) => {
        
        try {
          const cursor = reviewsCollection.find();
          const reviews = await cursor.toArray();
          res.json(reviews);
        } catch (error) {
          console.error('Error fetching reviews:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });



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