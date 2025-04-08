import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import users from "../models/User.js";
import Orders from "../models/Orders.js";
import mongoose from "mongoose";

dotenv.config();

//user register controller
export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return next(createError(409, "Email is already in use"));
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedpassword = bcrypt.hashSync(password, salt);

    const user = new users({
      name,
      email,
      password: hashedpassword,
      img,
    });
    const createduser = await user.save();
    const token = jwt.sign({ id: createduser._id }, process.env.JWT, {
      expiresIn: "10h",
    });
    return res.status(200).json({ token, user: createduser });
  } catch (error) {
    return next(error);
  }
};

//user login controller
export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email,password);
    const existingUser = await users.findOne({ email });
    if (!existingUser) {
      return next(createError(404, "user not found"));
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password"));
    }
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT, {
      expiresIn: "10h",
    });
    return res.status(200).json({ token, user: existingUser });
  } catch (error) {
    return next(error);
  }
};

// Cart
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userJWT = req.user;
    
    if (!userJWT || !userJWT.id) {
      return next(createError(401, "Invalid user token"));
    }

    // Find user and check if they exist
    const user = await users.findById(userJWT.id);
    if (!user) {
      return next(createError(404, "User not found. Please log in again."));
    }

    // Initialize cart if it doesn't exist
    if (!user.cart) {
      user.cart = [];
    }

    // Validate productId
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return next(createError(400, "Invalid product ID"));
    }

    const existingCartItemIndex = user.cart.findIndex((item) =>
      item?.product?.equals(productId)
    );
    
    if (existingCartItemIndex !== -1) {
      // Product is already in the cart, update the quantity
      user.cart[existingCartItemIndex].quantity += quantity;
    } else {
      // Product is not in the cart, add it
      user.cart.push({ product: productId, quantity });
    }
    
    await user.save();

    return res
      .status(200)
      .json({ message: "Product added to cart successfully", user });
  } catch (err) {
    console.error('Add to cart error:', err);
    next(err);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userJWT = req.user;
    const user = await users.findById(userJWT.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const productIndex = user.cart.findIndex((item) =>
      item.product.equals(productId)
    );
    if (productIndex !== -1) {
      if (quantity && quantity > 0) {
        user.cart[productIndex].quantity -= quantity;
        if (user.cart[productIndex].quantity <= 0) {
          user.cart.splice(productIndex, 1);
        }
      } else {
        user.cart.splice(productIndex, 1);
      }

      await user.save();
      return res
        .status(200)
        .json({ message: "Product quantity updated in cart", user });
    } else {
      return next(createError(404, "Product not found in the user's cart"));
    }
  } catch (err) {
    next(err);
  }
};

export const getAllCartItems = async (req, res, next) => {
  try {
    const userJWT = req.user;
    
    if (!userJWT || !userJWT.id) {
      return next(createError(401, "Invalid user token"));
    }

    const user = await users.findById(userJWT.id).populate({
      path: "cart.product",
      model: "Products",
    });

    if (!user) {
      return next(createError(404, "User not found. Please log in again."));
    }

    // Initialize cart if it doesn't exist
    if (!user.cart) {
      user.cart = [];
      await user.save();
    }

    return res.status(200).json(user.cart);
  } catch (err) {
    console.error('Get cart items error:', err);
    next(err);
  }
};

// Order

export const placeOrder = async (req, res, next) => {
  try {
    const { products, address, totalAmount } = req.body;
    
    // Validate products array structure
    if (!Array.isArray(products) || products.length === 0) {
      return next(createError(400, "Invalid products data"));
    }

    // Validate each product has required fields
    for (const item of products) {
      if (!item.product || !item.quantity || item.quantity < 1) {
        return next(createError(400, "Invalid product data structure"));
      }
    }

    const userJWT = req.user;
    const user = await users.findById(userJWT.id).populate('cart.product');
    
    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Validate that order products match cart
    if (user.cart.length !== products.length) {
      return next(createError(400, "Order products do not match cart"));
    }

    // Validate each product in order exists in cart
    for (const orderItem of products) {
      const cartItem = user.cart.find(item => 
        item.product._id.toString() === orderItem.product.toString()
      );
      if (!cartItem || cartItem.quantity < orderItem.quantity) {
        return next(createError(400, "Invalid product quantities in order"));
      }
    }

    // Convert totalAmount to Decimal128
    const decimalTotal = new mongoose.Types.Decimal128(totalAmount.toString());

    const order = new Orders({
      products,
      user: user._id,
      total_amount: decimalTotal,
      address: address || "",
    });
    
    await order.save();

    // Clear the user's cart
    user.cart = [];
    await user.save();

    // Populate order with product details
    const populatedOrder = await order.populate('products.product');

    return res
      .status(200)
      .json({ 
        message: "Order placed successfully", 
        order: populatedOrder
      });
  } catch (err) {
    console.error('Place order error:', err);
    next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const user = req.user;
    const orders = await Orders.find({ user: user.id })
      .populate({
        path: 'products.product',
        model: 'Products',
        select: 'title img price name'
      })
      .sort({ createdAt: -1 }); // Sort by newest first
    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

//Favourite

export const addToFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userJWT = req.user;
    const user = await users.findById(userJWT.id);

    if (!user.favourites.includes(productId)) {
      user.favourites.push(productId);
      await user.save();
    }

    return res
      .status(200)
      .json({ message: "Product added to favorites successfully", user });
  } catch (err) {
    next(err);
  }
};

export const removeFromFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userJWT = req.user;
    
    if (!productId) {
      return next(createError(400, "Product ID is required"));
    }

    const user = await users.findById(userJWT.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Filter out null values and the target product ID
    user.favourites = user.favourites.filter(
      (fav) => fav && fav.toString() === productId.toString()
    );
    
    await user.save();
    return res
      .status(200)
      .json({ message: "Product removed from favorites successfully", user });
  } catch (err) {
    next(err);
  }
};

export const getUserFavourites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await users.findById(userId).populate("favourites").exec();

    if (!user) {
      return next(createError(404, "User not found"));
    }

    return res.status(200).json(user.favourites);
  } catch (err) {
    next(err);
  }
};
