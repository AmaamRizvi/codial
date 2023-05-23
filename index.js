const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require('./config/passport-jws-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const customMware = require("./config/middleware");

const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer); 
chatServer.listen(5000);
console.log('chatserver is on over 5000 port');

chatServer.prependListener("request", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
});

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static("./assets"));
app.use("/uploads", express.static(__dirname + "/uploads"));

//use of layouts
app.use(expressLayouts);

//extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.use(express.static("assets"));

//set up view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//mongo store is used to store the session in db

app.use(
  session({
    name: "codial",
    secret: "blahsometing",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 1000,
    },
    store: new MongoStore(
      {
        uri: "mongodb://127.0.0.1:27017/codial_development",
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongo setup ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }

  console.log(`Server is running on port: ${port}`);
});
