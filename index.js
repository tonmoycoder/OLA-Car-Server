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

async function run() {
  try {
    // user registration data
    const userLoginCollection = client.db('UserRegisterData').collection('RegisterData');

    // all products data
    const productsDataCollection = client.db('productData').collection('productCollection');

    // total car category
    const carCategoryCollection = client.db('CarCategory').collection('CategoryData');

    // user booking data
    const userBookingCollection = client.db('UserBooking').collection('BookingData');

    // user product report data
    const userProductReportCollection = client.db('UserReport').collection('ReportData');

    // all-product ads data
    const productAdsCollection = client.db('ProductAdd').collection('ProductAddCollection');

    app.post('/userRegister', async (req, res) => {
      const userData = req.body;
      const result = await userLoginCollection.insertOne(userData);
      res.send(result);
    });

    // get all user data

    app.get('/allUserData', async (req, res) => {
      const result = await userLoginCollection.find().toArray();
      res.send(result);
    });

    // get social media login data

    app.get('/socialLogin/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const curser = userLoginCollection.find(query);
      const result = await curser.toArray();
      const arraysLength = result;
      if (arraysLength.length > 0) {
        return res.send({ accountType: 'Buyer' });
      }
      const newUser = {
        email: email,
        name: email,
        accountType: 'Buyer',
      };
      const createUser = await userLoginCollection.insertOne(newUser);
      res.send(createUser);
    });




















 

   

  } finally {
  }
}

run().catch((error) => {
  console.log(error);
});

app.listen(port, () => {
  console.log(`mama listening in : ${port}`);
});
