require("dotenv").config();
const express = require("express");

const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors());
const {
  graphqlUploadExpress, // A Koa implementation is also exported.
} = require("graphql-upload");

const categoryController = require("./controllers/categoryController");
const productController = require("./controllers/productController");
const userController = require("./controllers/userController");
const paymentController = require("./controllers/paymentController");
const upload = require("./controllers/upload");
const typeDefs = require("./schema");
const resolvers = require("./resolver");
// Connect to MongoDb

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectDB();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    req,
    categoryController,
    productController,
    userController,
    paymentController,
    upload,
  }),
});

const startServer = async () => {
  await server.start();
  app.use(graphqlUploadExpress());
  server.applyMiddleware({ app });
};

startServer();

app.listen({ port: process.env.PORT || 4000 }, () =>
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
);
