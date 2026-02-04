const { fetchAllArticles } = require("../models/articles.model");

exports.getAllArticles = () => {
  return fetchAllArticles();
};