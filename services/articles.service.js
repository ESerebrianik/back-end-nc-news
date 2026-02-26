const { 
  fetchAllArticles, 
  fetchArticleById,
  fetchCommentsByArticleId,
  insertComment,
  updateArticleVotesById,
  insertArticle
 } = require("../models/articles.model");

const { fetchUserByUsername } = require("../models/users.model");
const { fetchTopicBySlug } = require("../models/topics.model");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

exports.getAllArticles = (sort_by, order, topic, author, limit = 10, p = 1, q) => {
  return fetchAllArticles(sort_by, order, topic, author, limit, p, q).then((rows) => {
    const total_count = rows.length ? rows[0].total_count : 0;
    const articles = rows.map(({ total_count, ...article }) => article);

    if (topic && articles.length === 0) {
      return fetchTopicBySlug(topic).then((foundTopic) => {
        if (!foundTopic) throw new NotFoundError("Topic not found");
        return { articles: [], total_count: 0 };
      });
    }

    if (author && articles.length === 0) {
      return fetchUserByUsername(author).then((user) => {
        if (!user) throw new NotFoundError("User not found");
        return { articles: [], total_count: 0 };
      });
    }

    return { articles, total_count };
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

exports.addArticle = (newArticle) => {
  const { author, title, body, topic, article_img_url } = newArticle;

  if (!author || !title || !body || !topic) {
    throw new BadRequestError("Bad request");
  }

  const defaultImgUrl =
    "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700";

  const imgUrl = article_img_url || defaultImgUrl;
  return fetchUserByUsername(author)
    .then((user) => {
      if (!user) throw new NotFoundError("User not found");
      return fetchTopicBySlug(topic);
    })
    .then((foundTopic) => {
      if (!foundTopic) throw new NotFoundError("Topic not found");
      return insertArticle({
        author,
        title,
        body,
        topic,
        article_img_url: imgUrl,
      });
    })
    .then((insertedArticle) => {
      return fetchArticleById(insertedArticle.article_id);
    });
};