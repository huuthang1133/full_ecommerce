const Product = require("../models/productModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString }; //queryString = req.query

    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(
    //   /\b(gte|gt|lt|lte|regex)\b/g,
    //   (match) => "$" + match
    // );

    const { title } = (queryStr = JSON.parse(queryStr));
    if (title) {
      const newQueryStr = { ...queryStr, title: { $regex: title } };
      this.query.find(newQueryStr);
      return this;
    }
    this.query.find(queryStr);
    return this;
    //    gte = greater than or equal
    //    lte = lesser than or equal
    //    lt = lesser than
    //    gt = greater than
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const productController = {
  getAllProducts: async (args) => {
    try {
      const features = new APIfeatures(Product.find(), args)
        .filtering()
        .sorting()
        .paginating();

      const products = await features.query;

      return products;
    } catch (err) {
      throw new Error(err);
    }
  },
  getProductById: async (productId) => {
    return await Product.findById(productId);
  },
  createProduct: async (args, req) => {
    const { id } = auth(req);
    const user = await User.findById(id);
    if (user.role !== 0) {
      try {
        const newProduct = new Product({
          title: args.title.toLowerCase(),
          ...args,
        });
        return await newProduct.save();
      } catch (error) {
        throw new Error("Admin resources access denied");
      }
    }
    throw new Error("Admin resources access denied");
  },
  updateProduct: async (args, req) => {
    const { id, ...restArgs } = args;
    const user = await User.findById(auth(req).id);
    if (user.role !== 0) {
      try {
        return await Product.findByIdAndUpdate(
          id,
          { ...restArgs },
          { new: true }
        );
      } catch (err) {
        throw new Error("Admin resources access denied");
      }
    }
  },
  deleteProduct: async (args, req) => {
    const { id } = args;
    const user = await User.findById(auth(req).id);

    if (user.role !== 0) {
      try {
        await Product.findByIdAndDelete(id);
        return { msg: "Deleted Product" };
      } catch (error) {
        throw new Error("Admin resources access denied");
      }
    }
  },
};

module.exports = productController;
