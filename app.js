
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
    if (err.status && err.msg) {
      return res.status(err.status).send({ msg: err.msg });
    }
    console.log("ERROR:", err);
    res.status(500).send({ msg: "Internal Server Error" });
  });


module.exports = app;
