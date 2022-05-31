const Category = require("../models/categoryModel");

const categoryController = {
  getAllCategories: async () => await Category.find(),
  getCategoryById: async (id) => await Category.findById(id),
  createCategory: async (args) => {
    const newCategory = new Category(args);
    return await newCategory.save();
  },
};

module.exports = categoryController;
