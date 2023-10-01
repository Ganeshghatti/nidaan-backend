const express = require("express");
const connectdatabase = require("./config/database");
const cors = require("cors");
const bodyParser = require("body-parser");
const userroutes = require("./routes/User");
const chatroutes = require("./routes/Chat");
require("dotenv").config();

const universalAnalytics = require("universal-analytics");

const visitor = universalAnalytics("YourGAID", "YourClientID");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(userroutes);
app.use(chatroutes);

connectdatabase();
const PORT = process.env.PORT;
app.use((req, res, next) => {
  visitor.event("Server Interaction", "API Request").send();

  next();
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
