const express = require("express");
const cors = require("cors");
const path = require("path");
const config = require("./src/config");
const productRoutes = require("./src/routes/productRoutes");
const orderRoutes = require("./src/routes/orderRoutes");

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

<<<<<<< HEAD
app.use(express.json());

=======
>>>>>>> 8f9a892d8338df3b8805344876bf40967713147e
app.get("/", (req, res) => {
  res.json({ message: "E-commerce API", version: "1.0" });
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
