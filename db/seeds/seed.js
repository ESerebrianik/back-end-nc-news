const db = require("../connection");
const format = require("pg-format");
const createLookUpObject = require("../seeds/utils-seed");

const seed = ({
  topicData,
  userData,
  articleData,
  commentData,
  userTopicData,
}) => {
  return (
    db
      .query(
        `DROP TABLE IF EXISTS 
    emoji_article_user,
    user_article_votes,
    user_topic,
    comments,
    articles,
    users,
    topics,
    emojis
  CASCADE;
`
      )
      // .then(() => db.query(`DROP TABLE IF EXISTS articles;`))
      // .then(() => db.query(`DROP TABLE IF EXISTS users;`))
      // .then(() => db.query(`DROP TABLE IF EXISTS topics;`))
      // .then(() => db.query(`DROP TABLE IF EXISTS emojis;`))
      // .then(() => db.query(`DROP TABLE IF EXISTS emoji_article_user;`))
      // .then(() => db.query(`DROP TABLE IF EXISTS user_topic;`))
      // .then(() => db.query(`DROP TABLE IF EXISTS user_article_votes;`))
      .then(() => {
        return db.query(`
        CREATE TABLE topics (
          slug VARCHAR PRIMARY KEY,
          description VARCHAR NOT NULL,
          img_url VARCHAR(1000)
        );
      `);
      })
      .then(() => {
        return db.query(`
        CREATE TABLE users (
          username VARCHAR PRIMARY KEY,
          name VARCHAR NOT NULL,
          avatar_url VARCHAR(1000)
        );
      `);
      })
      .then(() => {
        return db.query(`
        CREATE TABLE articles (
          article_id SERIAL PRIMARY KEY,
          title VARCHAR NOT NULL,
          topic VARCHAR NOT NULL REFERENCES topics(slug),
          author VARCHAR NOT NULL REFERENCES users(username),
          body TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          votes INT DEFAULT 0,
          article_img_url VARCHAR(1000)
        );
      `);
      })
      .then(() => {
        return db.query(`
        CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          article_id INT NOT NULL REFERENCES articles(article_id),
          body TEXT NOT NULL,
          votes INT DEFAULT 0,
          author VARCHAR NOT NULL REFERENCES users(username),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      })
      .then(() => {
        return db.query(`
        CREATE TABLE emojis (
          emoji_id SERIAL PRIMARY KEY,
          emoji varchar NOT NULL
        );
      `);
      })
      .then(() => {
        return db.query(`
        CREATE TABLE emoji_article_user (
          emoji_article_user_id SERIAL PRIMARY KEY,
          emoji_id INT REFERENCES emojis(emoji_id),
          username VARCHAR REFERENCES users(username),
          article_id INT REFERENCES articles(article_id)
        );
      `);
      })
      .then(() => {
        return db.query(`
        CREATE TABLE user_topic (
          user_topic_id SERIAL PRIMARY KEY,
          username VARCHAR REFERENCES users(username),
          topic VARCHAR REFERENCES topics(slug)
        );
      `);
      })
      .then(() => {
        return db.query(`
        CREATE TABLE user_article_votes (
          user_article_votes_id SERIAL PRIMARY KEY,
          username VARCHAR REFERENCES users(username),
          article_id INT REFERENCES articles(article_id),
          vote_count INT NOT NULL
        );
      `);
      })
      .then(() => {
        const formattedTopics = topicData.map((topic) => {
          return [topic.slug, topic.description, topic.img_url];
        });

        const queryTopicStr = format(
          `INSERT INTO topics (slug, description, img_url) VALUES %L`,
          formattedTopics
        );

        return db.query(queryTopicStr);
      })
      .then(() => {
        const formattedUsers = userData.map((user) => {
          return [user.username, user.name, user.avatar_url];
        });

        const queryUserStr = format(
          `INSERT INTO users (username, name, avatar_url) VALUES %L`,
          formattedUsers
        );
        return db.query(queryUserStr);
      })
      .then(() => {
        const formattedArticles = articleData.map((article) => {
          return [
            article.title,
            article.topic,
            article.author,
            article.body,
            article.created_at,
            article.votes,
            article.article_img_url,
          ];
        });

        const queryArticleStr = format(
          `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url)
        VALUES %L RETURNING title, article_id`,
          formattedArticles
        );
        return db.query(queryArticleStr);
      })
      .then((result) => {
        const insertedArticles = result.rows;

        const articleIdLookup = createLookUpObject(
          insertedArticles,
          "title",
          "article_id"
        );

        const formattedComments = commentData.map((comment) => {
          return [
            articleIdLookup[comment.article_title],
            comment.body,
            comment.votes,
            comment.author,
            comment.created_at,
          ];
        });

        const queryCommentStr = format(
          `INSERT INTO comments (article_id, body, votes, author, created_at)
         VALUES %L;`,
          formattedComments
        );

        return db.query(queryCommentStr);
      })
      .then(() => {
        const formatedUserTopic = userTopicData.map((userTopic) => {
          return [userTopic.username, userTopic.topic];
        });

        const queryUserTopicStr = format(
          `INSERT INTO user_topic (username, topic) VALUES %L`,
          formatedUserTopic
        );
        return db.query(queryUserTopicStr);
      })
  );
};
module.exports = seed;
