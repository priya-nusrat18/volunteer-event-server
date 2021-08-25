const express = require('express')
const app = express()
// const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

require('dotenv').config()


const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1msfu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send('Hello World!')
})



client.connect(err => {
  const eventsCollection = client.db("volunteerN").collection("events");
app.get('/events' , (req, res)=>{
    eventsCollection.find({})
    .toArray((err, documents)=>{
        res.send(documents)
    })
})

  app.post('/addEvent', (req, res) => {
    const newEvent = req.body;
    console.log('adding new event: ', newEvent)
    eventsCollection.insertOne(newEvent)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})

  // delete product
  app.delete('/deleteEvent/:id',(req,res) => {
    const id = ObjectId(req.params.id)
    eventsCollection?.deleteOne({
        _id: id
    })
    .then( result => {
        console.log('delete',result)
        res.send(result.deletedCount > 0)

    })
})
  console.log('connceted db');
  
//   client.close();
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})