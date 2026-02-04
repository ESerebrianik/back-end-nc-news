const { getAllArticles } = require("../services/articles.service");

exports.getArticles = (req, res, next) => {
  getAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
