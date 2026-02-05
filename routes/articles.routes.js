const express = require("express");
const { getArticles, getArticleById, getCommentsByArticleId } = require("../controllers/articles.controller");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);

module.exports = articlesRouter;
