const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

const { deleteCommentById, patchCommentVotesById } = require("../models/comments.model");

exports.removeCommentById = (comment_id) => {
  if (isNaN(Number(comment_id))) {
    throw new BadRequestError("Bad request");
  }

  return deleteCommentById(comment_id).then((deletedComment) => {
    if (!deletedComment) {
      throw new NotFoundError("Comment not found");
    }
  });
};

exports.updateCommentVotesById = (comment_id, inc_votes) => {
  return patchCommentVotesById(comment_id, inc_votes).then((comment) => {
    if (!comment) throw new NotFoundError("Comment not found");
    return comment;
  });
};