const { removeCommentById, updateCommentVotesById } = require("../services/comments.service");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  if (isNaN(Number(comment_id)) || inc_votes === undefined || isNaN(Number(inc_votes))) {
    return res.status(400).send({ msg: "Bad request" });
  }

  updateCommentVotesById(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};