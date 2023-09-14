const MongoClient = require('mongodb').MongoClient
const express = require('express')
const app = express();
const endPointsRouter = require('./routes/routes.js');
app.use('/microservicio', endPointsRouter); 

require('dotenv').config();
const port = process.env.PORT256
app.use(express.json());
app.listen(port, () =>{
    console.log(`Server is running on port ${port}`)
});