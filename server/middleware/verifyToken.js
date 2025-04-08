// import jwt from "jsonwebtoken";
// import { createError } from "../error.js";

// export const verifyToken = async (req, res, next) => {
//   try {
//     if (!req.headers.authorization) {
//       return next(createError(401, "You are not authenticated!"));
//     }
//     const token = req.headers.authorization.split(" ")[1];
//     if (!token) return next(createError(401, "You are not authenticated!"));
//     const decode = jwt.verify(token, process.env.JWT);
//     req.user = decode;
//     return next();
//   } catch (err) {
//     next(err);
//   }
// };

import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(createError(401, "You are not authenticated!"));
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(createError(401, "Invalid authentication token!"));
    }

    const decoded = jwt.verify(token, process.env.JWT);
    req.user = decoded;

    next();
  } catch (err) {
    next(createError(403, "Token is invalid or expired!"));
  }
};
