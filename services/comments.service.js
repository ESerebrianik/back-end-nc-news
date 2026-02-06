const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

const { deleteCommentById } = require("../models/comments.model");

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