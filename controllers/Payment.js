const users = require("../models/User");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const stripe = require("stripe")(
  "sk_test_51NwWcGSHxOErLjIvk6UT9eTiI8ILZiSGlsZCoeVZbnlZsb5jgZZk1Vy56pl3Um20OVYBIctdnw6Bwm42hwEeLvqf007Inp1XLn"
);

require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

exports.payment = async (req, res, next) => {
  console.log(process.env.STRIPEKEY);
  try {
    console.log("List of Products:");
    const products = await stripe.products.list();

    // products.data.forEach((product) => {
    //   console.log(product);
    //   console.log(`Product ID: ${product.id}`);
    //   console.log(`Product Name: ${product.name}`);
    //   console.log(`Description: ${product.description}`);
    //   console.log(`Price: ${product.price}`);
    //   console.log("------------------------");
    // });
    // const product = await stripe.products.retrieve("prod_Ok0iH950W5Lpln");
    // const price = await stripe.prices.retrieve(product.default_price);
    // console.log("Product Name:", product.name);
    // console.log("Price Amount:", price.unit_amount / 100, "Rs");
    // Commented out session creation

    const session = await stripe.checkout.sessions.create({
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/failure",
      line_items: [{ price: "price_1NwWhGSHxOErLjIv0fFc9t6J", quantity: 2 }],
      mode: "payment",
    });
    res.json({ url: session.url });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Payment Failure", errorMessage: error.message });
  }
};

const endpointSecret = "whsec_0fe03ac1006f63c9d8f103e89abd4a7240841e5a9b6846fc4600540727e770e7";

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  console.log("object")

  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      // Then define and call a function to handle the event checkout.session.completed
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});
