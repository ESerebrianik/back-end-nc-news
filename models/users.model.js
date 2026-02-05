const db = require("../db/connection")

exports.fetchAllUsers = () => {
    return db
        .query ("SELECT * FROM users;")
        .then(({rows}) => rows);
}

exports.fetchUserByUsername = (username) => {
    return db
      .query(
        `SELECT username, name, avatar_url FROM users WHERE username = $1;`,
        [username]
      )
      .then(({ rows }) => rows[0]);
  };