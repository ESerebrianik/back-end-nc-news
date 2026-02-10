const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("200: responds with { topics: [...] } where each topic has slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("topics");
        expect(Array.isArray(body.topics)).toBe(true);
        expect(typeof body.topics[0].slug).toBe("string");
        expect(typeof body.topics[0].description).toBe("string");
        expect(typeof body.topics[0].img_url).toBe("string");
      });
  });
});

describe("GET /api/articles", () => {
  test("should return an object with key articles and value of an array of articles without body", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBeGreaterThan(0);

        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(Number.isNaN(Date.parse(article.created_at))).toBe(false);
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
          expect(article.body).toBe(undefined);
        });
      });
  });

  test("should return articles sorted by created_at in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        for (let i = 0; i < articles.length - 1; i++) {
          const currentDate = Date.parse(articles[i].created_at);
          const nextDate = Date.parse(articles[i + 1].created_at);
          expect(currentDate).toBeGreaterThanOrEqual(nextDate);
        }
      });
  });
});

describe("GET api/users", () => {
  test("shoul return an object with key users and value of an array with username, name, avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(0);

        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: should return an article object with the correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(typeof article).toBe("object");
        expect(article.article_id).toBe(1);
        expect(typeof article.author).toBe("string");
        expect(typeof article.title).toBe("string");
        expect(typeof article.body).toBe("string");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.created_at).toBe("string");
        const timestamp = Date.parse(article.created_at);
        expect(Number.isNaN(timestamp)).toBe(false);
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
      });
  });

  test("400: should return bad request when article_id is not a number", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: should return not found when article_id does not exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("200: should include comment_count on the returned article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toBeObject();
        expect(article.article_id).toBe(1);
        expect(article).toHaveProperty("comment_count");
        expect(Number(article.comment_count)).not.toBeNaN();
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: should return an object with key comments and value of an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          const timestamp = Date.parse(comment.created_at);
          expect(Number.isNaN(timestamp)).toBe(false);
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
          expect(comment.article_id).toBe(1);
        });
      });
  });

  test("200: should return comments sorted by created_at in descending order (most recent first)", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        const createdAts = comments.map((c) => Date.parse(c.created_at));
        expect(createdAts).toBeSorted({ descending: true });
      });
  });

  test("200: should return an empty array when the article exists but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
      });
  });

  test("400: should return bad request when article_id is not a number", () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: should return not found when article_id does not exist", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: should add a comment for the given article_id and return the posted comment", () => {
    const newComment = { username: "butter_bridge", body: "hello from test" };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;

        expect(comment).toBeObject();
        expect(comment.comment_id).toBeNumber();

        expect(comment.body).toBe("hello from test");
        expect(comment.author).toBe("butter_bridge");
        expect(comment.article_id).toBe(1);

        expect(comment.votes).toBeNumber();
        expect(Date.parse(comment.created_at)).not.toBeNaN();
      });
  });

  test("400: should return Bad request when article_id is not a number", () => {
    return request(app)
      .post("/api/articles/not-a-number/comments")
      .send({ username: "butter_bridge", body: "hi" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: should return Article not found when article_id does not exist", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send({ username: "butter_bridge", body: "hi" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("400: should return Bad request when body is missing", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: should return Bad request when username is missing", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ body: "hi" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: should return User not found when username does not exist", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "not-a-real-user", body: "hi" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
});

describe("POST /api/articles", () => {
    test("201: should add a new article and return it with required properties", () => {
      const newArticle = {
        author: "butter_bridge",
        title: "My new article",
        body: "Hello world",
        topic: "mitch",
        article_img_url: "https://example.com/image.jpg",
      };
  
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(201)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toBeObject();
          expect(article.article_id).toBeNumber();
          expect(article.author).toBe("butter_bridge");
          expect(article.title).toBe("My new article");
          expect(article.body).toBe("Hello world");
          expect(article.topic).toBe("mitch");
          expect(article.article_img_url).toBe("https://example.com/image.jpg");
          expect(article.votes).toBeNumber();
          expect(Number.isNaN(Date.parse(article.created_at))).toBe(false);
          expect(article.comment_count).toBe(0); 
        });
    });
  
    test("201: should default article_img_url when not provided", () => {
      const newArticle = {
        author: "butter_bridge",
        title: "No image provided",
        body: "Image should default",
        topic: "mitch",
      };
  
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(201)
        .then(({ body }) => {
          const { article } = body;
          expect(article.article_img_url).toBeString();
          expect(article.article_img_url.length).toBeGreaterThan(0);
        });
    });
  
    test("400: should return Bad request when required fields are missing", () => {
      const badArticle = {
        author: "butter_bridge",
        title: "Missing body and topic",
      };
  
      return request(app)
        .post("/api/articles")
        .send(badArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  
    test("404: should return User not found when author does not exist", () => {
      const newArticle = {
        author: "not-a-user",
        title: "Bad author",
        body: "test",
        topic: "mitch",
      };
  
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("User not found");
        });
    });
  
    test("404: should return Topic not found when topic does not exist", () => {
      const newArticle = {
        author: "butter_bridge",
        title: "Bad topic",
        body: "test",
        topic: "not-a-topic",
      };
  
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Topic not found");
        });
    });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: should increment votes by inc_votes and return the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toBeObject();
        expect(article.article_id).toBe(1);
        expect(article.votes).toBeNumber();
        expect(article.votes).toBe(101);
      });
  });

  test("200: should decrement votes when inc_votes is negative", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.article_id).toBe(1);
        expect(article.votes).toBe(0);
      });
  });

  test("400: should return Bad request when article_id is not a number", () => {
    return request(app)
      .patch("/api/articles/not-a-number")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: should return Bad request when inc_votes is missing", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: should return Bad request when inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "one" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: should return Article not found when article_id does not exist", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: should delete the given comment and return no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });

  test("400: should return Bad request when comment_id is not a number", () => {
    return request(app)
      .delete("/api/comments/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: should return Comment not found when comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });

  test("204: should actually remove the comment from the database", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return request(app).delete("/api/comments/1").expect(404);
      })
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
    test("200: should increment votes by inc_votes and return updated comment", () => {
        return request(app)
        .patch("/api/comments/1")
        .send({inc_votes: 1})
        .expect(200)
        .then(({body}) => {
            const { comment } = body;
            expect(comment).toBeObject();
            expect(comment.comment_id).toBe(1);
            expect(comment.votes).toBeNumber();
        })
    })

    test("200 should decrement votes when inc_votes is negative", () => {
        return request(app)
        .patch("/api/comments/1")
        .send({inc_votes: -1})
        .expect(200)
        .then(({ body }) => {
            expect(body.comment.comment_id).toBe(1);
            expect(body.comment.votes).toBeNumber();
        })
    })

    test("400: bad request when comment_id is not a number", () => {
        return request(app)
          .patch("/api/comments/not-a-number")
          .send({ inc_votes: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
    
      test("400: bad request when inc_votes is missing", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
    
      test("400: bad request when inc_votes is not a number", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: "one" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
    
      test("404: comment not found when comment_id does not exist", () => {
        return request(app)
          .patch("/api/comments/9999")
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Comment not found");
          });
      });
})

describe("GET /api/articles (sorting queries)", () => {
  test("200: should sort articles by votes when sort_by=votes", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const votes = body.articles.map((a) => a.votes);
        expect(votes).toBeSorted({ descending: true });
      });
  });

  test("200: should sort articles by created_at ascending when order=asc", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        const dates = body.articles.map((a) => Date.parse(a.created_at));
        expect(dates).toBeSorted({ descending: false });
      });
  });

  test("200: should sort articles by title ascending when sort_by=title&order=asc", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        const titles = body.articles.map((a) => a.title);
        expect(titles).toBeSorted();
      });
  });

  test("400: should return Bad request when sort_by is invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=not_a_column")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: should return Bad request when order is invalid", () => {
    return request(app)
      .get("/api/articles?order=sideways")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles (topic query)", () => {
  test("200: should return only articles for the given topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeArray();
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
          expect(article).not.toHaveProperty("body");
        });
      });
  });

  test("200: should return an empty array when topic exists but has no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeArray();
        expect(body.articles).toEqual([]);
      });
  });

  test("404: should return Topic not found when topic does not exist", () => {
    return request(app)
      .get("/api/articles?topic=not-a-topic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: returns a user object", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toBeObject();
        expect(user.username).toBe("butter_bridge");
        expect(typeof user.name).toBe("string");
        expect(typeof user.avatar_url).toBe("string");
      });
  });

  test("404: user not found", () => {
    return request(app)
      .get("/api/users/not-a-user")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
});

describe("GET /api/articles (pagination)", () => {
    test("200: defaults to limit=10 and p=1, and responds with total_count", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty("articles");
          expect(body.articles).toBeArray();
          expect(body).toHaveProperty("total_count");
          expect(body.total_count).toBeNumber();
          expect(body.articles.length).toBeLessThanOrEqual(10);
        });
    });
  
    test("200: accepts limit query and returns that many articles", () => {
      return request(app)
        .get("/api/articles?limit=5")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeArray();
          expect(body.articles).toHaveLength(5);
          expect(body.total_count).toBeNumber();
        });
    });
  
    test("200: accepts p query and returns the correct page (calculated using limit)", () => {
      const page1 = request(app).get("/api/articles?limit=5&p=1").expect(200);
      const page2 = request(app).get("/api/articles?limit=5&p=2").expect(200);
  
      return Promise.all([page1, page2]).then((responses) => {
        const body1 = responses[0].body;
        const body2 = responses[1].body;
        expect(body1.articles).toHaveLength(5);
        expect(body2.articles).toHaveLength(5);
        const ids1 = body1.articles.map((a) => a.article_id);
        const ids2 = body2.articles.map((a) => a.article_id);
        ids1.forEach((id) => expect(ids2).not.toContain(id));
      });
    });
  
    test("200: total_count ignores limit (returns total number of articles matching filters)", () => {
      const noLimit = request(app).get("/api/articles").expect(200);
      const limited = request(app).get("/api/articles?limit=5").expect(200);
  
      return Promise.all([noLimit, limited]).then(([res1, res2]) => {
        expect(res1.body.total_count).toBeNumber();
        expect(res2.body.total_count).toBeNumber();
        expect(res2.body.total_count).toBe(res1.body.total_count);
      });
    });
  
    test("200: total_count respects filters (e.g. topic)", () => {
      return request(app)
        .get("/api/articles?topic=mitch&limit=5&p=1")
        .expect(200)
        .then(({ body }) => {
          expect(body.total_count).toBeNumber();
          expect(body.articles).toBeArray();
          body.articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
  
    test("400: invalid limit (not a number)", () => {
      return request(app)
        .get("/api/articles?limit=not-a-number")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  
    test("400: invalid p (not a number)", () => {
      return request(app)
        .get("/api/articles?p=not-a-number")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  
    test("400: limit must be positive", () => {
      return request(app)
        .get("/api/articles?limit=0")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  
    test("400: p must be positive", () => {
      return request(app)
        .get("/api/articles?limit=5&p=0")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  
    test("200: p is out of range -> returns empty array (but total_count still present)", () => {
      return request(app)
        .get("/api/articles?limit=5&p=999")
        .expect(200)
        .then(({ body }) => {
          expect(body.total_count).toBeNumber();
          expect(body.articles).toBeArray();
          expect(body.articles).toEqual([]);
        });
    });
  });
