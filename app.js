
const express = require("express");
const app = express();

app.use(express.json());

const topicsRouter = require("./routes/topic.routes");
app.use("/api/topics", topicsRouter);

module.exports = app;
