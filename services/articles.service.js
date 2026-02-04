const { fetchAllArticles, fetchArticleById } = require("../models/articles.model");

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