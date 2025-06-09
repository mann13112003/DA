const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const adminRoute = require("./routers/admin.js");
const dotenv = require("dotenv");
const connectDB = require("./config/connectDB.js");
const userRoute = require("./routers/users.js");
const pestDetectionRoute = require("./routers/pestDetection.js");
const cors = require("cors");
const fileUpload = require("express-fileupload");

dotenv.config();

let app = express();
// Sử dụng express json và urlencoded thay cho body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Chỉ cho phép frontend truy cập
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Cho phép gửi cookie (nếu cần)
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Serve static files from public directory
app.use(express.static('public'));

adminRoute(app);
userRoute(app);
pestDetectionRoute(app);

connectDB();

let port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log("Backend is running on the port: " + port);
});
