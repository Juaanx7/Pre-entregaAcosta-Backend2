import Cart from "../dao/models/Cart.js";
import Product from "../dao/models/Product.js";

export const createCart = async (req, res) => {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.status(201).json({ message: "Carrito creado con éxito", cart: newCart });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el carrito", error: error.message });
  }
};

export const getCartById = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id).populate("products.product");
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el carrito", error: error.message });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    const existingProduct = cart.products.find(p => p.product.toString() === productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }
    await cart.save();
    res.json({ message: "Producto agregado al carrito", cart });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar producto al carrito", error: error.message });
  }
};

export const removeProductFromCart = async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    await cart.save();
    res.json({ message: "Producto eliminado del carrito", cart });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto del carrito", error: error.message });
  }
};

export const emptyCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

    cart.products = [];
    await cart.save();
    res.json({ message: "Carrito vaciado correctamente", cart });
  } catch (error) {
    res.status(500).json({ message: "Error al vaciar el carrito", error: error.message });
  }
};