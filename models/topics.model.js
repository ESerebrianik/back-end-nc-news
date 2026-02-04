const db = require("../db/connection");

exports.fetchAllTopics = () => {
    return db
      .query("SELECT slug, description, img_url FROM topics;")
      .then(({ rows }) => rows);
  };
