var express = require("express");
var router = express.Router();

const Razorpay = require("razorpay");
const request = require("request");

const keys = require("../keys");
const shortid = require("shortid");

const razorpay = new Razorpay({
  key_id: "rzp_test_8TEr0yyWpFNHN6",
  key_secret: "jAUhJwHtlmQ85iQKJyhADjeG",
});
router.get("/order/:amount", (req, res) => {
  try {
    const options = {
      amount: +(parseInt(req.params.amount) * 100),
      currency: "INR",
      receipt: "receipt#1",
      payment_capture: 1, //1
    };
    razorInstance.orders.create(options, async function (err, order) {
      if (err) {
        return res.status(500).json({
          message: "Something error!s",
        });
      }
      return res.status(200).json(order);
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something error!s",
    });
  }
});

router.post("/capture/:paymentId/:amount", (req, res) => {
  console.log(req.params);
  try {
    return request(
      {
        method: "POST",
        url: `https://${keys.razorIdkey}:${keys.razorIdSecret}@api.razorpay.com/v1/payments/${req.params.paymentId}/capture`,
        form: {
          amount: +req.params.amount * 100,
          currency: "INR",
        },
      },
      async function (err, response, body) {
        console.log(body);
        if (err) {
          return res.status(500).json({
            message: "Something error!s",
          });
        }
        return res.status(200).json(body);
      }
    );
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/paymentgateway", async (req, res) => {
  const payment_capture = 1;
  const amount = +req.body.amount;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    return res.status(200).json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error });
  }
});

module.exports = router;
