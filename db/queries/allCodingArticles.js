const db = require("../connection");

db.query("SELECT * FROM articles WHERE topic = 'coding';")
  .then(({ rows }) => {
    console.log(rows);
  })
  .catch((error) => {
    console.log(error)
  })
  .finally(() => {
    db.end();
  });