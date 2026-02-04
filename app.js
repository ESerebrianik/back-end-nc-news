
const express = require("express");
const app = express();

app.use(express.json());

const topicsRouter = require("./routes/topic.routes");
app.use("/api/topics", topicsRouter);

const articlesRouter = require("./routes/articles.routes");
app.use("/api/articles", articlesRouter);

const usersRouter = require("./routes/users.routes");
app.use("/api/users", usersRouter);

app.use((err, req, res, next) => {
    console.log("ERROR:", err); // чтобы увидеть причину в терминале
    res.status(500).send({ msg: "Internal Server Error" });
  });


module.exports = app;
