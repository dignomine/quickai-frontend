import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import logo from "../../images/logo.png";

const HotelPayment = (props) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

  // function loadScript(urlsrc) {
  //   return new Promise((resolve) => {
  //     const script = document.createElement("script");
  //     script.src = urlsrc;
  //     // iframe = document.getElementById('id_of_frame');
  //     // iframe.setAttribute('allow', "autoplay; fullscreen *;");
  //     // iframe.src = iframe.src;
  //     script.onload = () => {
  //       resolve(true);
  //     };
  //     script.onerror = () => {
  //       resolve(false);
  //     };
  //     document.body.appendChild(script);
  //   });
  // }

  // const displayRazorpay = async () => {
  //   console.log("here");
  //   const res = await loadScript(
  //     "https://checkout.razorpay.com/v1/checkout.js"
  //   );

  //   if (!res) {
  //     alert("Razorpay SDK failed to load. Are you online?");
  //     return;
  //   }

  // const options = {
  //   key: "rzp_test_8TErOyyWpFNHN6",
  //   currency: props.location.state.currency,
  //   amount: props.location.state.amount * 100,
  //   order_id: uuidv4(),
  //   name: "Pay the required amount to book Hotel",
  //   description: "Some description here will be absolutely good.",
  //   image: logo,
  //   handler: function (response) {
  //     alert(response.razorpay_payment_id);
  //     alert(response.razorpay_order_id);
  //     alert(response.razorpay_signature);
  //   },
  //   prefill: {
  //     name: props.location.state.name,
  //     email: props.location.state.email,
  //     phone_number: props.location.state.phone_number,
  //   },
  // };
  // const paymentObject = new window.Razorpay(options);
  // paymentObject.on("payment.failed", function (response) {
  //   alert(response.error.code);
  //   alert(response.error.description);
  //   alert(response.error.source);
  //   alert(response.error.step);
  //   alert(response.error.reason);
  //   alert(response.error.metadata.order_id);
  //   alert(response.error.metadata.payment_id);
  // });
  // paymentObject.open();
  // };

  const loadScript = (src) => {
    return new Promise((resovle) => {
      const script = document.createElement("script");
      script.src = src;

      script.onload = () => {
        resovle(true);
      };

      script.onerror = () => {
        resovle(false);
      };

      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("You are offline... Failed to load Razorpay SDK");
      return;
    }

    // const response = await razorpay.orders.create(options);

    const options = {
      key: "rzp_test_8TEr0yyWpFNHN6",
      currency: props.location.state.currency,
      amount: props.location.state.amount * 100,
      // order_id: uuidv4(),
      name: "Pay the required amount to book Hotel",
      description: "Some description here will be absolutely good.",
      image: logo,
      handler: function (response) {
        console.log(response);
        // alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);
      },
      prefill: {
        name: props.location.state.name,
        email: props.location.state.email,
        contact: props.location.state.phone_number,
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    paymentObject.open();
  };

  useEffect(() => {
    displayRazorpay();
  }, []);

  return <div style={{ height: "100vh", width: "100vw" }}></div>;
};

export default HotelPayment;
