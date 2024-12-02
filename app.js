require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("morgan");
const mongoose = require("mongoose");

const app = express();

app.use((req, res, next) => {
  console.log('Request Origin:', req.headers.origin);
  console.log('Allowed Origins:', process.env.CLIENT_URL);
  next();
});


// CORS setup
const corsOptions = {
  origin: [process.env.CLIENT_URL, process.env.CLIENT_URL_2],
  credentials: true,
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE,OPTIONS",
};
app.use(cors(corsOptions));


app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));

// Your routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

//not found handler
app.use("*", (req, res, next) => {
  res.status(404).json({ message: "API not found" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Listening on Port: ${process.env.PORT} - DB Connected`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
