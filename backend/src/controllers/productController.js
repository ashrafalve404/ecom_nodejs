const db = require("../models/db");

const ProductController = {
  getAll: (req, res) => {
    try {
      const { category, search } = req.query;
      let query = "SELECT * FROM products WHERE 1=1";
      const params = [];

      if (category) {
        query += " AND category = ?";
        params.push(category);
      }

      if (search) {
        query += " AND (name LIKE ? OR description LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
      }

      query += " ORDER BY created_at DESC";
      const products = db.prepare(query).all(...params);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: (req, res) => {
    try {
      const product = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: (req, res) => {
    try {
      const { name, description, price, category, stock, image } = req.body;
      const result = db.prepare(
        "INSERT INTO products (name, description, price, category, stock, image) VALUES (?, ?, ?, ?, ?, ?)"
      ).run(name, description, price, category, stock || 0, image || "");
      
      const product = db.prepare("SELECT * FROM products WHERE id = ?").get(result.lastInsertRowid);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: (req, res) => {
    try {
      const { name, description, price, category, stock, image } = req.body;
      const result = db.prepare(
        "UPDATE products SET name = ?, description = ?, price = ?, category = ?, stock = ?, image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
      ).run(name, description, price, category, stock, image || "", req.params.id);

      if (result.changes === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      const product = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: (req, res) => {
    try {
      const result = db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
      if (result.changes === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCategories: (req, res) => {
    try {
      const categories = db.prepare("SELECT DISTINCT category FROM products WHERE category IS NOT NULL").all();
      res.json(categories.map(c => c.category));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = ProductController;
