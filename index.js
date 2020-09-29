const express=require('express');
const bodyParser=require('body-parser');
const ObjectID = require('mongodb').ObjectID;

const app=express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const password='CJtD97BR80LDDUiZ';
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://tamim:CJtD97BR80LDDUiZ@cluster0.o2jpm.mongodb.net/mongodb-crude?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true  });
app.get('/', function (req, res) {
    
    res.sendFile(__dirname+'/index.html');

  })

  client.connect(err => {
    const collection = client.db("mongodb-crude").collection("data");
    
    app.get('/products',(req,res)=>{
        collection.find({})
        .toArray((err,documents)=>{
            res.send(documents);
        })
    })

    app.get('/product/:id',(req,res)=>{
        collection.find({_id: ObjectID(req.params.id)})
        .toArray((err,documents)=>{
            res.send(documents[0]);
        })
    })
    app.post('/addProduct',(req,res)=>{
        const product=req.body;
        collection.insertOne(product)
        .then(result=>{
            console.log("data added successfully");
            res.redirect('/');
        })

    })

    

        app.patch('/update/:id', (req, res) => {
        collection.updateOne({_id: ObjectID(req.params.id)},
        {
          $set: {price: req.body.price, quantity: req.body.quantity}
        })
        .then (result => {
          res.send(result.modifiedCount>0);
        })
      })

    app.delete('/delete/:id',(req,res)=>{
        collection.deleteOne({_id:ObjectID(req.params.id) })
        .then(result=>{
            res.send(result.deletedCount>0);
        })
    })


    
  });
  

app.listen(3000);