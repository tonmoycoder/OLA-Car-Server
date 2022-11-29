const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middle-ware
app.use(cors());
app.use(express.json());

// get api
app.get('/', (req, res) => {
  res.send('mama api working');
});

/**
 *
 * MongoDB start
 *
 */

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.vtstx9a.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});



run().catch((error) => {
  console.log(error);
});

app.listen(port, () => {
  console.log(`mama listening in : ${port}`);
});
