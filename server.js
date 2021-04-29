require("dotenv").config();

const express = require("express");
const app = express();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo")(session);

// Port
const PORT = process.env.PORT || 3000;

// Database Connection
const url = "mongodb://localhost/pizza";
mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});
const connection = mongoose.connection;
connection
  .once("open", () => {
    console.log(`Database Connected 🥳🥳🥳🥳`);
  })
  .catch((err) => {
    console.log(`Connection Failed ☹️☹️☹️☹️: ${err}`);
  });

// Session Store
let mongoStore = new MongoDbStore({
  mongooseConnection: connection,
  collection: "sessions",
});

// Session Config
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
  })
);

// Flash Middleware
app.use(flash());

// Assets / Serve Static Files
app.use(express.static("public"));

// Json Middleware
app.use(express.json());

// Global Middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  // res.locals.user = req.user;
  next();
});

// Set Template Engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// Import Routes / Set Routes / Require Routes
require("./routes/web")(app);

// Listening to Server
app.listen(PORT, () => {
  console.log(`Server Started on http://localhost:${PORT}`);
});
