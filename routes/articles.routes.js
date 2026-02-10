const express = require("express");
const { 
    getArticles, 
    getArticleById, 
    getCommentsByArticleId,
    postCommentByArticleId,
    patchArticleById,
    postArticle
 } = require("../controllers/articles.controller");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);
articlesRouter.post("/:article_id/comments", postCommentByArticleId);
articlesRouter.patch("/:article_id", patchArticleById);
articlesRouter.post("/", postArticle);

module.exports = articlesRouter;
