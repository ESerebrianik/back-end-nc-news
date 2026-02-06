const db = require("../db/connection");

exports.fetchAllTopics = () => {
    return db
      .query("SELECT * FROM topics;")
      .then(({ rows }) => rows);
  };

  exports.fetchTopicBySlug = (slug) => {
    return db
      .query(`SELECT slug FROM topics WHERE slug = $1;`, [slug])
      .then(({ rows }) => rows[0]);
  };
