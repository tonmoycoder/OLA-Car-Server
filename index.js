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

    // get user data by email

    app.get('/userData/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const curser = userLoginCollection.find(query);
      const result = await curser.toArray();
      res.send(result);
    });

    // verify user data by id

    app.put('/verifyUser/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const userData = req.body;
      const option = { upsert: true };
      const updateUser = {
        $set: {
          verifyStatus: userData.verifyStatus,
        },
      };
      const result = await userLoginCollection.updateOne(query, updateUser, option);
      res.send(result);
    });

    // post products data to DB
    
    app.post('/products', async (req, res) => {
      const productsData = req.body;
      const result = await productsDataCollection.insertOne(productsData);
      res.send(result);
    });

    // get products data by email

    app.get('/productsData/:email', async (req, res) => {
      const email = req.params.email;
      const query = { seller: email };
      const curser = productsDataCollection.find(query);
      const result = await curser.toArray();
      res.send(result);
    });

    // delete user data from DB by id

    app.delete('/productDelete/:id', async (req, res) => {
      const ID = req.params.id;
      const query = { _id: ObjectId(ID) };
      const deleteUser = await productsDataCollection.deleteOne(query);
      res.send(deleteUser);
    });

    // ADs data delete api

    app.delete('/adsDelete/:id', async (req, res) => {
      const ID = req.params.id;
      const query = { productID: ID };
      const deleteUser = await productAdsCollection.deleteMany(query);
      res.send(deleteUser);
    });

    // delete product from user booking

    app.delete('/SellerUserBookingDelete/:id', async (req, res) => {
      const ID = req.params.id;
      const query = { productID: ID };
      const deleteUser = await userBookingCollection.deleteMany(query);
      res.send(deleteUser);
    });

    // get all-car category

    app.get('/allCarCategory', async (req, res) => {
      const data = await carCategoryCollection.find().toArray();
      res.send(data);
    });

    // only Porsche car category

    app.get('/CarCategory', async (req, res) => {
      const queryData = req.query.model;
      if (queryData == null) {
        const query = { model: 'Porsche' };
        const data = await carCategoryCollection.find(query).toArray();
        return res.send(data);
      }
      const query = { model: queryData };
      const curser = carCategoryCollection.find(query);
      const result = await curser.toArray();
      res.send(result);
    });

    // get all cars data

    app.get('/allCars', async (req, res) => {
      const queryData = req.query.model;
      if (queryData == null) {
        const query = { carType: 'Porsche' };
        const data = await productsDataCollection.find(query).toArray();
        return res.send(data);
      }
      const query = { carType: queryData };
      const curser = productsDataCollection.find(query);
      const result = await curser.toArray();
      res.send(result);
    });

    // get single product data by id

    app.get('/singleProduct/:id', async (req, res) => {
      const ID = req.params.id;
      const query = { _id: ObjectId(ID) };
      const result = await productsDataCollection.find(query).toArray();
      res.send(result);
    });

    // post user booking to DB

    app.post('/userBooking', async (req, res) => {
      const bookingData = req.body;
      const result = await userBookingCollection.insertOne(bookingData);
      res.send(result);
    });

    // get user booking data by email

    app.get('/userBookingData/:email', async (req, res) => {
      const email = req.params.email;
      const query = { buyerEmail: email };
      const result = await userBookingCollection.find(query).toArray();
      res.send(result);
    });

    // get user order by product ID

    app.get('/userBookingDataByProductID/:id', async (req, res) => {
      const ID = req.params.id;
      const query = { productID: ID };
      const result = await userBookingCollection.find(query).toArray();
      res.send(result);
    });

    // update user payment status

    app.put('/updateUserPaymentStatus/:id', async (req, res) => {
      const id = req.params.id;
      const query = { productID: id };
      const userData = req.body;
      const option = { upsert: true };

      const updateUser = {
        $set: {
          paymentStatus: userData.paymentStatus,
        },
      };
      console.log(userData);
      const result = await userBookingCollection.updateMany(query, updateUser, option);
      res.send(result);
    });

    // post product report

    app.post('/report', async (req, res) => {
      const reportBody = req.body;
      const result = await userProductReportCollection.insertOne(reportBody);
      res.send(result);
    });

    // get all report

    app.get('/allReport', async (req, res) => {
      const sort = { ReportTime: -1 };
      const query = {};
      const data = await userProductReportCollection.find(query).sort(sort).toArray();
      return res.send(data);
    });

    // post product ads

    app.post('/productADS', async (req, res) => {
      const ADSdata = req.body;
      const result = await productAdsCollection.insertOne(ADSdata);
      res.send(result);
    });

    // get all products ads

    app.get('/getAllProductADS', async (req, res) => {
      const sort = { time: -1 };
      const limit = 4;
      const data = await productAdsCollection.find().sort(sort).limit(limit).toArray();
      res.send(data);
    });

    // get all sellers

    app.get('/allSellers', async (req, res) => {
      const queryData = req.query.accountType;
      const query = { accountType: queryData };
      const curser = userLoginCollection.find(query);
      const result = await curser.toArray();
      res.send(result);
    });

    // seller data delete by admin api

    app.delete('/sellerDelete/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const deleteUser = await userLoginCollection.deleteOne(query);
      res.send(deleteUser);
    });

    // product report delete

    app.delete('/reportDelete/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const deleteUser = await userProductReportCollection.deleteOne(query);
      res.send(deleteUser);
    });

    // Admin api

    app.get('/adminState/:email', async (req, res) => {
      console.log(req.params.email);
      const query = { email: req.params.email };
      const curser = await userLoginCollection.findOne(query);
      if (curser?.accountType === 'Admin') {
        console.log('admin');
        return res.send(true);
      }
      console.log('not admin');
      res.send(false);
    });

    // Buyer api
    app.get('/buyerState/:email', async (req, res) => {
      console.log(req.params.email);
      const query = { email: req.params.email };
      const curser = await userLoginCollection.findOne(query);
      if (curser?.accountType === 'Buyer') {
        console.log('buyer');
        return res.send(true);
      }
      console.log('not buyer');
      res.send(false);
    });

    // Seller api

    app.get('/sellerState/:email', async (req, res) => {
      console.log(req.params.email);
      const query = { email: req.params.email };
      const curser = await userLoginCollection.findOne(query);
      if (curser?.accountType === 'Seller') {
        console.log('Seller');
        return res.send(true);
      }
      console.log('not Seller');
      res.send(false);
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
