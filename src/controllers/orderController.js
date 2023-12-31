const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
  try {
    const { products } = req.body;
    const userId = req.user.userId; // Extracted from the JWT token during authentication

    // Calculate total amount based on product prices and quantities
    const productIds = products.map((item) => item.product);
    const productsInOrder = await Product.find({ _id: { $in: productIds } });
    const totalAmount = productsInOrder.reduce((acc, product) => {
      const orderedProduct = products.find((item) => item.product.toString() === product._id.toString());
      return acc + product.price * orderedProduct.quantity;
    }, 0);

    // Create the order
    const order = new Order({
      user: userId,
      products,
      totalAmount,
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from the JWT token during authentication
    const orders = await Order.find({ user: userId }).populate('products.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createOrder, getOrdersByUser };
