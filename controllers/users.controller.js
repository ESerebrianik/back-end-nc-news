const { 
    getAllUsers,
    getUserByUsername: getUserByUsernameService  } = require("../services/users.service")

exports.getUsers = (req, res, next) => {
    getAllUsers()
        .then((users) => {
            res.status(200).send({ users });
        })
        .catch(next);
}

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params;
    getUserByUsernameService(username)
        .then((user) => {
            res.status(200).send({user});
        })
        .catch(next);
}