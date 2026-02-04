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

describe("/api/articles", () => {
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
  

