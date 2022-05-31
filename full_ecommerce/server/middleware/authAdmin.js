const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");
const auth = require("./auth");
const User = require("../models/userModel");

const authAdmin = async (req) => {
  const { id } = auth(req);
  const user = await User.findById(id);
  if (user && user.role !== 0) {
    try {
      return true;
    } catch (error) {
      throw new AuthenticationError("Admin resources access denied");
    }
  }
  throw new AuthenticationError("Admin resources access denied");
};

module.exports = authAdmin;
