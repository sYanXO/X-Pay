const express = require('express');
const mainRouter= require("./routes/index.js")
const app = express();

app.use("/api/v1",mainRouter);