import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/route";
import connect from "./config/connectDB";
import bodyParser from "body-parser";
var cookieParser = require('cookie-parser');
var cors = require('cors')
require("dotenv").config();

const app=express();
const PORT = process.env.PORT || 8080;
const ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

var corsOptions = {
    origin: ORIGIN,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true
  }

//config view engine
configViewEngine(app);

//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//cors
app.use(cors(corsOptions));

//cookies-parser
app.use(cookieParser());

// test connect db
connect();

//init web routes
initWebRoutes(app);

app.listen(PORT, () => {
    console.log("--- Server WMS is running on the port "+PORT);
})
