const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();

app.use(express.json());
app.use(flash());

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/entities/public"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "Dipanshu",
    resave: false,
    saveUninitialized: true,
  })
);

require("./database/init")();
//{"_id":{"$oid":"630e60231063415fa2986bb8"},"title":"Vivo T1 Pro","quantity":"10","image":"","price":{"$numberLong":"100"},"description":"Blab blbagafa","rating":{"$numberLong":"4"}}
require("./entities/indexRoutes")(app);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
