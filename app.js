require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors"); 
const logger = require("morgan");
const mongoose = require("mongoose");

const app = express();

// CORS setup
const corsOptions = {
  credentials: true,
  origin: [process.env.CLIENT_URL,process.env.CLIENT_URL_2],
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
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