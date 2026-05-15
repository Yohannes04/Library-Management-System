require('dotenv').config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const { testConnection } = require("./src/config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Library Management Backend Running");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
