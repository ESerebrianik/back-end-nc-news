const db = require("../connection");

db.query("SELECT * FROM articles WHERE author = 'grumpy19';")
    .then(({rows}) => {
        console.log(rows);
    })
    .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        db.end();
      });