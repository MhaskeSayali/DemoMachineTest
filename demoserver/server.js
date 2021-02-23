var bodyParser=require('body-parser');
var express = require("express");
var wroutes = require('./src/js/routes/wroutes');
const cors =require('cors');


const NODE_LISTENING_PORT = 80;

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/', wroutes);

app.listen(NODE_LISTENING_PORT);


