const express = require("express");
const { getArticles } = require("../controllers/articles.controller");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);

module.exports = articlesRouter;
