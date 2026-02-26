const { 
  getAllArticles, 
  getArticleById: getArticleByIdService,
  getCommentsByArticleId: getCommentsByArticleIdService,
  addCommentByArticleId: addCommentByArticleIdService,
  updateArticleVotesById: updateArticleVotesByIdService,
  addArticle
   } = require("../services/articles.service");

exports.getArticles = (req, res, next) => {
    const { sort_by, order, topic, author, limit, p, q } = req.query;
  
    getAllArticles(sort_by, order, topic, author, limit, p, q)
      .then(({ articles, total_count }) => {
        res.status(200).send({ articles, total_count });
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

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (isNaN(Number(article_id))) {
    return res.status(400).send({ msg: "Bad request" });
  }

  addCommentByArticleIdService(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (isNaN(Number(article_id))) {
    return res.status(400).send({ msg: "Bad request" });
  }

  updateArticleVotesByIdService(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;

  if (!author || !title || !body || !topic) {
    return res.status(400).send({ msg: "Bad request" });
  }

  addArticle({ author, title, body, topic, article_img_url })
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};
