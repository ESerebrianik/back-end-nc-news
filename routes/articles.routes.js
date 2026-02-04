const express = require("express");
const { getArticles, getArticleById } = require("../controllers/articles.controller");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);

module.exports = articlesRouter;
