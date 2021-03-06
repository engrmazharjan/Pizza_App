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
const passport = require("passport");
const Emitter = require("events");

// Port
const PORT = process.env.PORT || 3000;

// Database Connection
mongoose.connect(process.env.MONGO_CONNECTION_URL, {
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

// Event Emitter
const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);

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

// Passport Config
const passportInit = require("./app/config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

// Flash Middleware
app.use(flash());

// Assets / Serve Static Files
app.use(express.static("public"));

// Middleware
app.use(express.urlencoded({ extended: false }));

// Json Middleware
app.use(express.json());

// Global Middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

// Set Template Engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// Import Routes / Set Routes / Require Routes
require("./routes/web")(app);

// Error / 404 Page
app.use((req, res) => {
  res.status(404).render("errors/404");
});

// Listening to Server
const server = app.listen(PORT, () => {
  console.log(`Server Started on http://localhost:${PORT}`);
});

// Socket
const io = require("socket.io")(server);
io.on("connection", (socket) => {
  // Join
  // console.log(socket.id); // Socket Id
  socket.on("join", (roomName) => {
    // console.log(roomName);
    socket.join(roomName);
  });
});

eventEmitter.on("orderUpdated", (data) => {
  io.to(`order_${data.id}`).emit("orderUpdated", data);
});

eventEmitter.on("orderPlaced", (data) => {
  io.to("adminRoom").emit("orderPlaced", data);
});
