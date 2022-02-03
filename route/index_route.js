const express = require("express");
const route = require("express").Router();
const cookie_parser = require("cookie-parser");
const path = require("path");
route.use(
  require("express").urlencoded({
    extended: true,
  })
);
route.use(require("express").json());
route.use(cookie_parser());

route.use("/files", express.static(path.join("Files")));

const user = require("./user_route");
route.use("/user", user);

const file = require("./file_route");
route.use("/file", file);
module.exports = route;
