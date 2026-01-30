const db = require("../connection");

db.query("SELECT * FROM comments WHERE votes < 0;")
  .then(({ rows }) => {
    console.log(rows);
  })
  .catch((error) => {
    console.log(error)
  })
  .finally(() => {
    db.end();
  });