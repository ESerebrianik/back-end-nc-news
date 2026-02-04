const { fetchAllTopics } = require("../models/topics.model");

exports.getAllTopics = () => {
  return fetchAllTopics();
};