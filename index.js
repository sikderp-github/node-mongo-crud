const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const password = '2AKtWiMBoC8rk5YJ';


const uri = "mongodb+srv://herbalUser:2AKtWiMBoC8rk5YJ@cluster0.xxgsk.mongodb.net/herbaldb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


client.connect(err => {
    const pdcollection = client.db("herbaldb").collection("products");

    app.get('/products', (req, res) => {
        pdcollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    });

    app.get('/product/:id', (req, res) => {
        pdcollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    });

    app.post("/addProduct", (req, res) => {
        const product = req.body;
        pdcollection.insertOne(product)
            .then(result => {
                res.redirect('/')
            })
    });

    app.patch('/update/:id', (req, res) => {
        pdcollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { price: req.body.price, quantity: req.body.quantity }
            })
            .then(result => {
                res.send(result.modifiedCount > 0);
            })
    });

    app.delete('/delete/:id', (req, res) => {
        pdcollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
            })
    })

});


app.listen(3200);

