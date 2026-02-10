const db = require("../db/connection");

exports.deleteCommentById = (comment_id) => {
  return db
    .query(
      `
      DELETE FROM comments
      WHERE comment_id = $1
      RETURNING *;
      `,
      [comment_id]
    )
    .then(({ rows }) => rows[0]);
};

exports.patchCommentVotesById = (comment_id, inc_votes) => {
  return db
    .query(
      `
      UPDATE comments
      SET votes = votes + $1
      WHERE comment_id = $2
      RETURNING comment_id, votes, created_at, author, body, article_id;
      `,
      [inc_votes, comment_id]
    )
    .then(({ rows }) => rows[0]);
};