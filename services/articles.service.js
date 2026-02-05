const { 
  fetchAllArticles, 
  fetchArticleById,
  fetchCommentsByArticleId,
  insertComment
 } = require("../models/articles.model");

 const { fetchUserByUsername } = require("../models/users.model");

exports.getAllArticles = () => {
  return fetchAllArticles();
};

exports.getArticleById = (article_id) => {
  return fetchArticleById(article_id).then((article) => {
    if (!article) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    }
    return article;
  });
};

exports.getCommentsByArticleId = (article_id) => {
  return fetchArticleById(article_id).then((article) => {
    if (!article) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    }

    return fetchCommentsByArticleId(article_id);
  });
};

exports.addCommentByArticleId = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return fetchArticleById(article_id).then((article) => {
    if (!article) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    }

    return fetchUserByUsername(username).then((user) => {
      if (!user) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }

      return insertComment(article_id, username, body);
    });
  });
};