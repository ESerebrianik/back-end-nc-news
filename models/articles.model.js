const db = require("../db/connection");
const BadRequestError = require("../errors/BadRequestError");

exports.fetchAllArticles = (sort_by = "created_at", order = "desc", topic) => {

  const validSortBys = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  const validOrders = ["asc", "desc"];

  if (!validSortBys.includes(sort_by)) {
    throw new BadRequestError("Bad request");
  }

  order = order.toLowerCase();
  if (!validOrders.includes(order)) {
    throw new BadRequestError("Bad request");
  }

  const sortColumn =
    sort_by === "comment_count" ? "comment_count" : `articles.${sort_by}`;

  const values = [];
  let whereStr = "";

  if (topic) {
    values.push(topic);
    whereStr = "WHERE articles.topic = $1"
  }

  const queryStr = `
    SELECT
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
      ${whereStr}
    GROUP BY articles.article_id
    ORDER BY ${sortColumn} ${order};
  `;

  return db.query(queryStr, values).then(({ rows }) => rows);
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `
      SELECT
        articles.author,
        articles.title,
        articles.article_id,
        articles.body,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id)::INT AS comment_count
      FROM articles
      LEFT JOIN comments
        ON comments.article_id = articles.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;
      `,
      [article_id]
    )
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


