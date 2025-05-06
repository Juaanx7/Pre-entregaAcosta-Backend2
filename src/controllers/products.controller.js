import Product from "../dao/models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, category, thumbnails } = req.body;
    const newProduct = new Product({ title, description, price, stock, category, thumbnails });
    await newProduct.save();
    res.status(201).json({ message: "Producto creado con éxito", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error al crear producto", error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener producto", error: error.message });
  }
};