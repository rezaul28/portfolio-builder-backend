const express = require("express");
const app = express();
const config = require("config");
const PORT = config.get("DEV_BACKEND_PORT");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
var cors = require("cors");
const serverLive = config.get("live");
const DB_URL = serverLive ? config.get("DB_URL") : config.get("DB_URL_DEV");
const mongoose = require("mongoose");
const route = require("./route/index_route");
mongoose.connect(
  DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  async () => {
    console.log("db connected");
  }
);
app.use(cors());

const swaggerOptions = {
  swaggerDefinition: {
    basePath: "/",
    info: {
      version: "1.0.0",
      title: "Portfolio Builder",
      description: "API Documentation",
      contact: {
        name: "Rezaul Karim",
      },
      servers: ["http://localhost:5000"],
    },
  },
  apis: ["./route/*.js"],
};

var fs = require("fs");

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(route);
const server = app.listen(process.env.PORT || PORT, async () => {
  console.log("server started");
});
