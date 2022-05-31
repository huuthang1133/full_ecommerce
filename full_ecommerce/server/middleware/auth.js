const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");

const auth = (req) => {
  if (!req) throw new Error("Please login or register");
  const token = req.header("Authorization");
  if (!token) throw new AuthenticationError("Invalid Authentication");
  if (token) {
    try {
      const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return user;
    } catch (err) {
      throw new AuthenticationError("Invalid Authentication");
    }
  }
  throw new Error("Authentication token must be provided");
};

module.exports = auth;
