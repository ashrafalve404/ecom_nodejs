const db = require("../models/db");

const OrderController = {
  getAll: (req, res) => {
    try {
      const userId = req.user.id;
      const orders = db.prepare(`
        SELECT o.*, 
          GROUP_CONCAT(oi.product_name || ' x' || oi.quantity) as items_summary,
          COUNT(oi.id) as item_count,
          u.name as user_name, u.email as user_email
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.user_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `).all(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllAdmin: (req, res) => {
    try {
      const orders = db.prepare(`
        SELECT o.*, 
          u.name as user_name, u.email as user_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `).all();
      
      const ordersWithItems = orders.map(order => {
        const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(order.id);
        return { ...order, items };
      });
      
      res.json(ordersWithItems);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: (req, res) => {
    try {
      const userId = req.user.id;
      const order = db.prepare("SELECT * FROM orders WHERE id = ? AND user_id = ?").get(req.params.id, userId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(req.params.id);
      res.json({ ...order, items });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: (req, res) => {
    try {
      const { items, customer_name, customer_email, customer_phone, shipping_address } = req.body;
      const userId = req.user.id;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Invalid order items" });
      }

      const getProduct = db.prepare("SELECT * FROM products WHERE id = ?");
      const updateStock = db.prepare("UPDATE products SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");

      let total = 0;
      const orderItems = [];

      for (const item of items) {
        const product = getProduct.get(item.productId);
        if (!product || product.stock < item.quantity) {
          return res.status(400).json({ error: `Product ${item.productId} not available` });
        }
        updateStock.run(item.quantity, item.productId);
        total += product.price * item.quantity;
        orderItems.push({
          productId: item.productId,
          name: product.name,
          quantity: item.quantity,
          price: product.price
        });
      }

      const insertOrder = db.prepare(
        "INSERT INTO orders (user_id, total, status, customer_name, customer_email, customer_phone, shipping_address) VALUES (?, ?, ?, ?, ?, ?, ?)"
      );
      const result = insertOrder.run(userId, total, "pending", customer_name || "", customer_email || "", customer_phone || "", shipping_address || "");

      const insertItem = db.prepare(
        "INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)"
      );
      for (const item of orderItems) {
        insertItem.run(result.lastInsertRowid, item.productId, item.name, item.quantity, item.price);
      }

      const newOrder = db.prepare("SELECT * FROM orders WHERE id = ?").get(result.lastInsertRowid);
      res.status(201).json({ ...newOrder, items: orderItems });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateStatus: (req, res) => {
    try {
      const { status } = req.body;
      const result = db.prepare(
        "UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
      ).run(status, req.params.id);

      if (result.changes === 0) {
        return res.status(404).json({ error: "Order not found" });
      }

      const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id);
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: (req, res) => {
    try {
      const orderId = req.params.id;
      
      db.prepare("DELETE FROM order_items WHERE order_id = ?").run(orderId);
      const result = db.prepare("DELETE FROM orders WHERE id = ?").run(orderId);

      if (result.changes === 0) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json({ message: "Order deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getStats: (req, res) => {
    try {
      const totalOrders = db.prepare("SELECT COUNT(*) as count FROM orders").get().count;
      const totalRevenue = db.prepare("SELECT COALESCE(SUM(total), 0) as total FROM orders").get().total;
      const totalProducts = db.prepare("SELECT COUNT(*) as count FROM products").get().count;
      const lowStock = db.prepare("SELECT COUNT(*) as count FROM products WHERE stock < 10").get().count;
      
      res.json({
        totalOrders,
        totalRevenue,
        totalProducts,
        lowStock
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = OrderController;
