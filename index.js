const express = require("express");
const connectdatabase = require("./config/database");
const cors = require("cors");
const bodyParser = require("body-parser");
const userroutes = require("./routes/User");
const chatroutes = require("./routes/Chat");
const paymentroutes = require("./routes/Payment");
require("dotenv").config();

const universalAnalytics = require("universal-analytics");

const visitor = universalAnalytics("YourGAID", "YourClientID");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(userroutes);
app.use(chatroutes);
app.use(paymentroutes);

connectdatabase();
const PORT = process.env.PORT;
app.use((req, res, next) => {
  visitor.event("Server Interaction", "API Request").send();

  next();
});

app.post("/webhook", (request, response) => {
  let event;
  try {
    console.log(request.body);
    event = stripe.webhooks.constructEvent(
      request.body,
      "whsec_Go31njHmYhQBJNenQ7ywar64u5G8FPUl",
      "whsec_0fe03ac1006f63c9d8f103e89abd4a7240841e5a9b6846fc4600540727e770e7"
    );
    console.log("object");

    console.log("event", event);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data.object;
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  response.send();
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
