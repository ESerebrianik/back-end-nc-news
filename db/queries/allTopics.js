const db = require("../connection");

db.query("SELECT * FROM topics;")
.then(({rows}) => {
    console.log(rows);
})
.catch((error) => {
    console.log(error)
  })
.finally(() => {
    db.end();
});