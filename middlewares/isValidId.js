import { isValidObjectId } from "mongoose";
import HttpError from "../../../../Desktop/node-goit/goit-node-rest-api/helpers/HttpError.js";

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(HttpError(404, `${id} is not valid id!`));
  }
  next();
};
export default isValidId;
