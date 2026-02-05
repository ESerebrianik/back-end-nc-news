const { 
  getAllArticles, 
  getArticleById: getArticleByIdService,
  getCommentsByArticleId: getCommentsByArticleIdService,
   } = require("../services/articles.service");

exports.getArticles = (req, res, next) => {
  getAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  if (isNaN(Number(article_id))) {
    return res.status(400).send({ msg: "Bad request" });
  }

  getArticleByIdService(article_id)
    .then((article) => res.status(200).send({ article }))
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  if (isNaN(Number(article_id))) {
    return res.status(400).send({ msg: "Bad request" });
  }

  getCommentsByArticleIdService(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
