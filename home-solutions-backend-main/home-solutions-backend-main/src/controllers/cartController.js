const Cart = require('../models/cartModel');

exports.addItemToCart = async (req, res) => {
  try {
    // Check if the cart already exists for the user
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      // If the cart already exists, update the cart items by pushing the new items
      const product = req.body.cartItems[0].product; // Assuming you're sending only one item
      const isItemAdded = cart.cartItems.find((c) => c.product.equals(product)); // Use .equals() for ObjectId comparison

      if (isItemAdded) {
        // Update quantity and price of the existing item in the cart
        isItemAdded.quantity += req.body.cartItems[0].quantity;
        isItemAdded.price = req.body.cartItems[0].price;
      } else {
        // If the item is not in the cart, add it to cartItems array
        cart.cartItems.push(req.body.cartItems[0]);
      }
    } else {
      // If the cart doesn't exist, create a new cart
      cart = new Cart({
        user: req.user._id, // customer id.
        cartItems: req.body.cartItems,
      });
    }

    // Save or update the cart
    const savedCart = await cart.save();

    if (savedCart) {
      return res.status(200).json({ message: "Cart Items", savedCart });
    } else {
      return res.status(400).json({ message: "Error while adding items to the cart" });
    }
  } 
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
