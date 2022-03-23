const { request, response } = require('express');
const express = require('express')
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(express.json());

app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin","*");
 
    app.use(cors());
    next();
})


app.use(routes);



app.listen(process.env.PORT || 3350);