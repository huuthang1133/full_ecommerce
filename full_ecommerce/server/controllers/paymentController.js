const Product = require("../models/productModel");
const Payment = require("../models/paymentModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");

const paymentController = {
  getPayments: async (req, args) => {
    const payments = await Payment.find();
    return payments;
  },
  getPaymentsByUser: async (req, args) => {
    const { id } = auth(req);
    const payments = await Payment.find({ userId: id });
    return payments;
  },
  createPayment: async (req, args) => {
    const { id } = auth(req);
    const { cart } = args;
    const newPayment = new Payment({
      userId: id,
      cart,
    });
    await newPayment.save();
    cart.filter((item) => {
      return sold(item.productId, item.qty);
    });
    return { newPayment, message: "Checkout Success !!!" };
  },
};

const sold = async (id, qty) => {
  await Product.findByIdAndUpdate(id, {
    $inc: {
      sold: qty,
      quantity: -qty,
    },
  });
};
module.exports = paymentController;
