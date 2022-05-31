const { UserInputError, AuthenticationError } = require("apollo-server");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const createAccessToken = (user) =>
  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "11h" });

const createRefreshToken = (user) =>
  jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

const userController = {
  getAllUsers: async (req) => {
    const { id } = auth(req);
    if (id) {
      const user = await User.findById(id);
      if (user.role !== 0) {
        return await User.find();
      } else throw new Error("Admin resources access denied");
    } else throw new Error("Admin resources access denied");
  },
  getUser: async (req) => {
    const { id } = auth(req);
    if (id) {
      const user = await User.findById(id);
      return user;
    } else throw new Error("Admin resources denied");
  },
  getUserById: async (userId) => {
    const user = await User.findById(userId);
    return user;
  },
  register: async (args) => {
    const { name, password, email } = args;
    // Validator

    if (!name || (name && !name.trim()))
      throw new UserInputError("Name must not be empty");

    if (!password || (password && !password.trim()))
      throw new UserInputError("Password must not be empty");

    if (!email || (email && !email.trim()))
      throw new UserInputError("Email must not be empty");

    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

    if (!email.match(regEx))
      throw new UserInputError("Email must be a valid email address");

    const user = await User.findOne({ email });

    if (user) {
      throw new UserInputError("The email already exist");
    }

    if (password.length < 6)
      throw new UserInputError("Password is at least 6 characters long");

    // Password Encryption

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: passwordHash,
    });

    // Save mongodb
    await newUser.save();

    // Then create jsonwebtoken to authentication

    const accesstoken = createAccessToken({ id: newUser._id });
    const refreshtoken = createRefreshToken({ id: newUser._id });

    return { token: accesstoken, email, name, id: newUser._id };
  },
  login: async (args) => {
    const { email, password } = args;

    const user = await User.findOne({ email });

    if (!user) throw new UserInputError("User doesn't exist");

    const match = await bcrypt.compare(password, user.password);

    if (!match) throw new UserInputError("Wrong Password");

    const accessToken = createAccessToken({ id: user.id });

    const refreshToken = createRefreshToken({ id: user.id });

    return {
      refreshToken,
      message: "Login Sucess",
    };
  },
  getUser: async (req) => {
    const { id } = auth(req);
    if (id) {
      try {
        const user = await User.findById(id);
        return user;
      } catch (err) {
        throw AuthenticationError("Invalid Authentication");
      }
    }
  },
  refreshToken: async (args) => {
    const { refreshToken } = args;
    const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (user) {
      const accessToken = createAccessToken({ id: user.id });
      const userValue = await User.findById(user.id).select("-id");
      return { accessToken, user: userValue };
    } else throw new Error("Please login or register");
  },
};

module.exports = userController;
