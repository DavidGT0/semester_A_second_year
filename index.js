const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT;
const host = process.env.HOST;
const db = require('./config/db_config');

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.use('/users', require('./routes/users_R'));

app.listen(port, () => {
    console.log(`Server started on port http://${host}:${port}`);
});