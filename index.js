const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j9nln.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try{
        await client.connect();
        
        const database = client.db('travel_agency');
        const placeCollection = database.collection('places');
        const bookingCollection = database.collection('bookings');

        // Get All The Places API
        app.get('/places', async(req, res)=>{
            const cursor = placeCollection.find({});
            const places = await cursor.toArray();
            res.send(places);
        });

        // Get All The Bookings
        app.get('/bookingDetails', async(req, res)=>{
            const cursor = bookingCollection.find({});
            const bookingDetails = await cursor.toArray();
            res.send(bookingDetails);
        });

        // Add Trip API
        app.post('/addplace', async(req, res)=>{
            const newPlace = req.body;
            const result = await placeCollection.insertOne(newPlace);
            res.json(result);
        })

        // Add Bookings API
        app.post('/bookings', async(req, res)=>{
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.json(result);
        })

        // Delete Booking API
        app.delete('/booking/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: id};
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Travelling Agency BD server is running')
});

app.listen(port, () => {
    console.log('Server is running at port ', port)
})