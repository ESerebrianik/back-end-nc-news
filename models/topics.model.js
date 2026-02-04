const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT slug, description, img_url FROM topics;")
  .then(({ rows }) => {
    return rows;
  });
};
