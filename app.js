
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
    if (err.status) {
      return res.status(err.status).send({ msg: err.message });
    }
  
    if (err.code === "22P02") {
      return res.status(400).send({ msg: "Bad request" });
    }
  
    console.log("ERROR:", err);
    res.status(500).send({ msg: "Internal Server Error" });
  });




module.exports = app;
