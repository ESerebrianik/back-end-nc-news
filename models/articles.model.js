const db = require("../db/connection");

exports.fetchAllArticles = () => {
  return db
    .query(
      `SELECT 
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id)::INT AS comment_count
      FROM articles
      LEFT JOIN comments
        ON comments.article_id = articles.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => rows);
};

exports.fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => rows[0]);
};

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
      [article_id]
    )
    .then(({ rows }) => rows);
};

exports.insertComment = (article_id, username, body) => {
  return db
    .query(
      `
      INSERT INTO comments (article_id, body, author)
      VALUES ($1, $2, $3)
      RETURNING comment_id, votes, created_at, author, body, article_id;
      `,
      [article_id, body, username]
    )
    .then(({ rows }) => rows[0]);
};

exports.updateArticleVotesById = (article_id, inc_votes) => {
  return db
    .query(
      `
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING author, title, article_id, body, topic, created_at, votes, article_img_url;
      `,
      [inc_votes, article_id]
    )
    .then(({ rows }) => rows[0]);
};
