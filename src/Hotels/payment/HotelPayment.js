import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import logo from "../../images/logo.png";
import Axios from "axios";

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

  // const loadScript = (src) => {
  //   return new Promise((resovle) => {
  //     const script = document.createElement("script");
  //     script.src = src;

  //     script.onload = () => {
  //       resovle(true);
  //     };

  //     script.onerror = () => {
  //       resovle(false);
  //     };

  //     document.body.appendChild(script);
  //   });
  // };

  // const displayRazorpay = async () => {
  //   // const res = await loadScript(
  //   //   "https://checkout.razorpay.com/v1/checkout.js"
  //   // );

  //   // if (!res) {
  //   //   alert("You are offline... Failed to load Razorpay SDK");
  //   //   return;
  //   // }
  //   console.log("hey hotel payment");
  //   const API_URL = `http://localhost:8000/razorpay/`;
  //   const orderUrl = `${API_URL}order/${props.location.state.amount}`;
  //   const response = await Axios.get(orderUrl);
  //   const { data } = response;
  //   console.log("App -> razorPayPaymentHandler -> data", data);
  //   // const response = await razorpay.orders.create(options);

  //   const options = {
  //     key: "rzp_test_8TEr0yyWpFNHN6",
  //     currency: props.location.state.currency,
  //     amount: +(props.location.state.amount * 100),
  //     order_id: data.id,
  //     name: "Travel Vougues",
  //     description: "Hey,make Secure Payment",
  //     image: logo,
  //     handler: async function (response) {
  //       try {
  //         const paymentId = response.razorpay_payment_id;
  //         const url = `${API_URL}capture/${paymentId}/${
  //           +props.location.state.amount * 100
  //         }`;
  //         const captureResponse = await Axios.post(url, {});
  //         const successObj = JSON.parse(captureResponse.data);
  //         const captured = successObj.captured;
  //         console.log("App -> razorPayPaymentHandler -> captured", successObj);
  //         if (captured) {
  //           console.log("success");
  //         }
  //       } catch (err) {
  //         console.log(err);
  //       }
  //       console.log(response);
  //       // alert(response.razorpay_payment_id);
  //       alert(response.razorpay_order_id);
  //       // alert(response.razorpay_signature);
  //     },
  //     prefill: {
  //       email: props.location.state.email,
  //       contact: props.location.state.phone_number,
  //     },
  //   };

  //   const paymentObject = new window.Razorpay(options);
  //   paymentObject.on("payment.failed", function (response) {
  //     alert(response.error.code);
  //     alert(response.error.description);
  //     alert(response.error.source);
  //     alert(response.error.step);
  //     alert(response.error.reason);
  //     alert(response.error.metadata.order_id);
  //     alert(response.error.metadata.payment_id);
  //   });
  //   paymentObject.open();
  // };

  const displayRazorpay = async () => {
    const response = await fetch(
      "http://localhost:8000/razorpay/paymentgateway",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: props.location.state.amount }),
      }
    );
    const data = await response.json();
    console.log(data);

    const options = {
      key: "rzp_test_8TEr0yyWpFNHN6",
      currency: data.currency,
      amount: data.amount,
      name: "QuickAI",
      description: "Wallet Transaction",
      // image: "http://localhost:1337/logo.png",
      order_id: data.id,
      handler: function (response) {
        alert("PAYMENT ID ::" + response.razorpay_payment_id);
        alert("ORDER ID :: " + response.razorpay_order_id);
        alert(JSON.stringify(response));
        console.log("hello" + response);
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
