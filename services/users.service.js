const { fetchAllUsers } = require("../models/users.model");

exports.getAllUsers = () => {
    return fetchAllUsers();
}