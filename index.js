const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT;
const api = process.env.HOST;

app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
    console.log(`Server started on port http://${api}:${port}`);
});