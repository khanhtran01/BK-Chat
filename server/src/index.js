require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;
const route = require('./routes');
const cookieParse = require('cookie-parser');
const http = require("http");
const server = http.createServer(app);

const db = require('./config/db/index');

db.connect();
// Middlleware built-in
app.use(
    express.urlencoded({
        extended: true,
    }),
); // unicode
app.use(express.json()); // axios, ajax
app.use(cookieParse(process.env.COOKIE_SECRECT)); //cookie parser

// Set up
app.use(morgan('combined'));
app.use(cors());

// Routes init
route(app);
server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
