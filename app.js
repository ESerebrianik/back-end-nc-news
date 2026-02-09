const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());

app.use("/api", express.static(path.join(__dirname, "public")));

const apiRouter = require("./routes/api.routes");
app.use("/api", apiRouter);

const topicsRouter = require("./routes/topic.routes");
app.use("/api/topics", topicsRouter);

const articlesRouter = require("./routes/articles.routes");
app.use("/api/articles", articlesRouter);

const usersRouter = require("./routes/users.routes");
app.use("/api/users", usersRouter);

const commentsRouter = require("./routes/comments.routes");
app.use("/api/comments", commentsRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.status) return res.status(err.status).send({ msg: err.message });
  if (err.code === "22P02") return res.status(400).send({ msg: "Bad request" });

  console.log("ERROR:", err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
