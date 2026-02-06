const { 
  fetchAllArticles, 
  fetchArticleById,
  fetchCommentsByArticleId,
  insertComment,
  updateArticleVotesById,
 } = require("../models/articles.model");

const { fetchUserByUsername } = require("../models/users.model");
const { fetchTopicBySlug } = require("../models/topics.model");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

exports.getAllArticles = (sort_by, order, topic) => {
  return fetchAllArticles(sort_by, order, topic).then((articles) => {
    if(topic && articles.length === 0) {
      return fetchTopicBySlug(topic).then((foundTopic) => {
        if(!foundTopic) throw new NotFoundError("Topic not found");
        return articles; 
      })
    }
    return articles;
  });
};

exports.getArticleById = (article_id) => {
  return fetchArticleById(article_id).then((article) => {
    if (!article) throw new NotFoundError("Article not found");
    return article;
  });
};

exports.getCommentsByArticleId = (article_id) => {
  return fetchArticleById(article_id).then((article) => {
    if (!article) throw new NotFoundError("Article not found");
    return fetchCommentsByArticleId(article_id);
  });
};

exports.addCommentByArticleId = (article_id, username, body) => {
  if (!username || !body) throw new BadRequestError("Bad request");

  return fetchArticleById(article_id).then((article) => {
    if (!article) throw new NotFoundError("Article not found");

    return fetchUserByUsername(username).then((user) => {
      if (!user) throw new NotFoundError("User not found");

      return insertComment(article_id, username, body);
    });
  });
};

exports.updateArticleVotesById = (article_id, inc_votes) => {
  if (inc_votes === undefined) throw new BadRequestError("Bad request");
  if (typeof inc_votes !== "number") throw new BadRequestError("Bad request");

  return updateArticleVotesById(article_id, inc_votes).then((article) => {
    if (!article) throw new NotFoundError("Article not found");
    return article;
  });
};