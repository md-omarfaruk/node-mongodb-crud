const express = require("express");

const bodyParser = require("body-parser");

const password = '2rmqXqVYJW35Htt';

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mdomar:2rmqXqVYJW35Htt@cluster0.frpyipp.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const ObjectId = require("mongodb").ObjectId;

const app = express();
app.use(bodyParser.json());
app.use((bodyParser.urlencoded({ extended: false })));


app.get("/", (req, res) => {
        res.sendFile(__dirname + "/index.html");
});


// MONGODB DATABASE CONNECTING

client.connect(err => {
  const collection = client.db("mdomarproducts").collection("products");
    console.log("database connected");

    // POST DATA TO DATABASE
    app.post("/addProduct", (req, res) => {
      const productFromUI = req.body;
      collection.insertOne(productFromUI)
      .then(result => {
        console.log("post data added in database");
        res.redirect("/");
      })
        
    });

    // READ DATA OR MAKE DATA API FROM DATABASE
    app.get("/products", (req, res) => {
          collection.find({})
          .toArray((err, documents) => {
            res.send(documents)
          });
          
    });

    // UPDATE DATA ON DATABASE
    app.get("/product/:id", (req, res) => {
      collection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0])
      })
    })

    // NOW UPDATE SINGLE PRODUCT INFO
    app.patch("/updateProductInfo/:id", (req, res) => {
      collection.updateOne({ _id: ObjectId(req.params.id) }, 
      {
        $set: {price: req.body.price, quantity: req.body.quantity}
      })
      .then(result => {
              res.send(result.modifiedCount > 0)
      })
    })

    // DELETE DATA FROM DATABASE
    app.delete("/delete/:id", (req, res) => {
      collection.deleteOne({_id: ObjectId(req.params.id) })
      .then(result => {
              res.send(result.deletedCount > 0);
      })
    })
  
});


app.listen(5000)