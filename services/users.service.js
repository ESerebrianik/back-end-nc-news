const { fetchAllUsers, fetchUserByUsername } = require("../models/users.model");
const NotFoundError = require("../errors/NotFoundError");

exports.getAllUsers = () => {
    return fetchAllUsers();
}

exports.getUserByUsername = (username) => {
    return fetchUserByUsername(username).then((user) => {
      if (!user) throw new NotFoundError("User not found");
      return user;
    });
  };