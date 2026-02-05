const express = require("express");
const { 
    getArticles, 
    getArticleById, 
    getCommentsByArticleId,
    postCommentByArticleId
 } = require("../controllers/articles.controller");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);
articlesRouter.post("/:article_id/comments", postCommentByArticleId);

module.exports = articlesRouter;
