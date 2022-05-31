const { GraphQLUpload } = require("graphql-upload");
const productController = require("../controllers/productController");
const paymentController = require("../controllers/paymentController");
const upload = require("../controllers/upload");

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    products: async (parent, args, { productController }) =>
      await productController.getAllProducts(args),
    categories: async (parent, args, { categoryController }) =>
      await categoryController.getAllCategories(),
    users: async (parent, args, { userController, req }) =>
      await userController.getAllUsers(req),
    user: async (parent, args, { userController, req }) =>
      await userController.getUser(req),
    payment: async (parents, args, { paymentController, req }) =>
      await paymentController.getPayments(req),
    paymentByUserId: async (_, args, { paymentController, req }) =>
      await paymentController.getPaymentsByUser(req),
  },

  Product: {
    category: async ({ categoryId }, args, { categoryController }) =>
      await categoryController.getCategoryById(categoryId),
  },

  Payment: {
    user: async ({ userId }, args, { userController }) =>
      await userController.getUserById(userId),
  },

  ItemInCart: {
    product: async ({ productId }, args, { productController }) =>
      await productController.getProductById(productId),
  },

  Category: {
    products: async ({ id }, args, { productController }) =>
      await productController.getAllProducts({ categoryId: id }),
  },

  Mutation: {
    createProduct: async (parent, args, { productController, req }) =>
      await productController.createProduct(args, req),
    updateProduct: async (parent, args, { productController, req }) =>
      await productController.updateProduct(args, req),
    deleteProduct: async (_, args, { productController }) =>
      await productController.deleteProduct(args),
    createCategory: async (parent, args, { categoryController }) =>
      await categoryController.createCategory(args, req),
    register: async (parent, args, { userController }) => {
      return await userController.register(args);
    },
    login: async (_, args, { userController }) => {
      return await userController.login(args);
    },
    refreshToken: async (_, args, { userController }) =>
      await userController.refreshToken(args),
    singleUpload: async (parent, { file }, { upload, req }) => {
      return await upload(file, req);
    },
    payment: async (_, args, { paymentController, req }) => {
      return await paymentController.createPayment(req, args);
    },
  },
};

module.exports = resolvers;
