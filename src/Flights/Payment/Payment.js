import React,{useEffect,useState} from 'react'
import $ from 'jquery'
import Axios from 'axios'
function Payment(props) {

    const [amount,setAmount]=useState(props.location.state.amount)
    const[email,setEmail]=useState(props.location.state.email)
    const[number,setNumber]=useState(props.location.state.number)
    useEffect(()=>{
        $(function () {
          $(".dropdown li").on('mouseenter mouseleave', function (e) {
          if ($(window).width() > 991) {
            console.log("called")
                  var elm = $('.dropdown-menu', this);
                  if(elm.length>0)
                  {
                  var off = elm.offset();
                  var l = off.left;
                   var w = elm.width();
             var docW = $(window).width();
            var isEntirelyVisible = (l + w <= docW);
                  if (!isEntirelyVisible) {
              $(elm).addClass('dropdown-menu-right');
                  } 
                  else {
                      $(elm).removeClass('dropdown-menu-right');
                  }
                }
                else{
                  
                }
            }
          });
      });
      },[])
  
        
      useEffect(()=>{
        
        const script = document.createElement("script");
        script.async = true;
        script.src = window.location.origin + '/js/theme.js';
        document.body.appendChild(script);
      },[])

      


      const razorPayPaymentHandler=async()=> {
        console.log("hey")
        const API_URL = `http://localhost:8000/razorpay/`
        const orderUrl = `${API_URL}order/${amount}`;
        const response = await Axios.get(orderUrl);
        const { data } = response;
        console.log("App -> razorPayPaymentHandler -> data", data)
        
        const options = {
          key: 'rzp_live_kkicnBJoqVlLOQ',
          name: "Travel Vougues",
          description: "Hey,make Secure Payment",
          prefill: {
            "email": email,
            "contact": number
        },
          order_id: data.id,
          handler: async (response) => {
            try {
             const paymentId = response.razorpay_payment_id;
             const url = `${API_URL}capture/${paymentId}`;
             const captureResponse = await Axios.post(url, {})
             const successObj = JSON.parse(captureResponse.data)
             const captured = successObj.captured;
             console.log("App -> razorPayPaymentHandler -> captured", successObj)
             if(captured){
                 console.log('success')
             }
             
            } catch (err) {
              console.log(err);
            }
          },
          theme: {
            color: "#686CFD",
          },
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      }

    return (
        <>
        <div id="main-wrapper">

  <header id="header">
    <div class="container">
      <div class="header-row">
        <div class="header-column justify-content-start"> 
          
          <div class="logo">
          	<a href="index-2.html" title="Quickai - HTML Template"><img src="images/logo.png" alt="Quickai" width="127" height="29" /></a>
          </div>
          
        </div>
        
        <div class="header-column justify-content-end">
        
          <nav class="primary-menu navbar navbar-expand-lg">
            <div id="header-nav" class="collapse navbar-collapse">
              <ul class="navbar-nav">
                <li class="dropdown"> <a class="dropdown-toggle" href="#">Home</a>
                  <ul class="dropdown-menu">
                    <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Index 1</a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="index-2.html">Recharge or Bill Payment</a></li>
                        <li><a class="dropdown-item" href="booking-hotels.html">Booking</a></li>
                      </ul>
                    </li>
                    <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Index 2</a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="index-3.html">Recharge or Bill Payment</a></li>
                        <li><a class="dropdown-item" href="booking-hotels-2.html">Booking</a></li>
                      </ul>
                    </li>
                    <li><a class="dropdown-item" href="index-4.html">Index 3 - (Recharge & Bill)</a></li>
                    <li><a class="dropdown-item" href="index-5.html">Index 4 - (Booking)</a></li>
                    <li><a class="dropdown-item" href="index-6.html">Index 5 - (Recharge & Bill)</a></li>
                    <li><a class="dropdown-item" href="index-7.html">Index 6 - (Booking)</a></li>
                    <li><a class="dropdown-item" href="index-8.html">Index 7 - (Recharge & Bill)</a></li>
                    <li><a class="dropdown-item" href="index-9.html">Index 8 - (Booking)</a></li>
                    <li><a class="dropdown-item" href="index-10.html">Index 9 - (Booking)</a></li>
                    <li><a class="dropdown-item" href="index-11.html">Index 10 - (Recharge & Bill)</a></li>
                    <li><a class="dropdown-item" href="index-12.html">Index 11 - (Mobile Top-Up)</a></li>
                  </ul>
                </li>
                <li class="dropdown"> <a class="dropdown-toggle" href="#">Recharge & Bill Payment</a>
                  <ul class="dropdown-menu dropdown-menu-sm">
                    <li>
                      <div class="row">
                        <div class="col-lg-6">
                          <ul class="dropdown-mega-submenu">
                            <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Mobile</a>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="index-2.html">Layout 1</a></li>
                                <li><a class="dropdown-item" href="index-3.html">Layout 2</a></li>
                              </ul>
                            </li>
                            <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">DTH</a>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="recharge-bill-dth.html">Layout 1</a></li>
                                <li><a class="dropdown-item" href="recharge-bill-dth-2.html">Layout 2</a></li>
                              </ul>
                            </li>
                            <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Data Card</a>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="recharge-bill-datacard.html">Layout 1</a></li>
                                <li><a class="dropdown-item" href="recharge-bill-datacard-2.html">Layout 2</a></li>
                              </ul>
                            </li>
                            <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Broadband</a>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="recharge-bill-broadband.html">Layout 1</a></li>
                                <li><a class="dropdown-item" href="recharge-bill-broadband-2.html">Layout 2</a></li>
                              </ul>
                            </li>
                            <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Landline</a>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="recharge-bill-landline.html">Layout 1</a></li>
                                <li><a class="dropdown-item" href="recharge-bill-landline-2.html">Layout 2</a></li>
                              </ul>
                            </li>
                            <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Cable TV</a>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="recharge-bill-cabletv.html">Layout 1</a></li>
                                <li><a class="dropdown-item" href="recharge-bill-cabletv-2.html">Layout 2</a></li>
                              </ul>
                            </li>
                            <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Electricity</a>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="recharge-bill-electricity.html">Layout 1</a></li>
                                <li><a class="dropdown-item" href="recharge-bill-electricity-2.html">Layout 2</a></li>
                              </ul>
                            </li>
                            <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Metro</a>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="recharge-bill-metro.html">Layout 1</a></li>
                                <li><a class="dropdown-item" href="recharge-bill-metro-2.html">Layout 2</a></li>
                              </ul>
                            </li>
                            <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Gas</a>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="recharge-bill-gas.html">Layout 1</a></li>
                                <li><a class="dropdown-item" href="recharge-bill-gas-2.html">Layout 2</a></li>
                              </ul>
                            </li>
                            <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Water</a>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="recharge-bill-water.html">Layout 1</a></li>
                                <li><a class="dropdown-item" href="recharge-bill-water-2.html">Layout 2</a></li>
                              </ul>
                            </li>
                          </ul>
                        </div>
                        <div class="col-lg-6">
                          <ul class="dropdown-mega-submenu">
                            <li><a class="dropdown-item" href="recharge-order.html">Order</a></li>
                            <li><a class="dropdown-item" href="recharge-order-summary.html">Order Summary</a></li>
                            <li><a class="dropdown-item" href="recharge-payment.html">Payment</a></li>
                            <li><a class="dropdown-item" href="recharge-payment-success.html">Payment Success</a></li>
                            <li><a class="dropdown-item" href="recharge-plans.html">Recharge - Plans</a></li>
                            <li><a class="dropdown-item" href="recharge-plans-2.html">Recharge - Plans 2</a></li>
                            <li><a class="dropdown-item" href="recharge-plans-3.html">Recharge - Plans 3</a></li>
                            <li><a class="dropdown-item" href="recharge-invoice.html" target="_blank">Invoice</a></li>
                            <li><a class="dropdown-item" href="email-template/recharge-email-template/index.html" target="_blank">Email Template</a></li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
                <li class="dropdown dropdown-mega"> <a class="dropdown-toggle" href="#">Booking</a>
                  <ul class="dropdown-menu">
                    <li>
                      <div class="row">
                        <div class="col-lg"> <span class="sub-title">Hotels</span>
                          <ul class="dropdown-mega-submenu">
                            <li><a class="dropdown-item" href="booking-hotels.html">Home Layout 1</a></li>
                            <li><a class="dropdown-item" href="booking-hotels-2.html">Home Layout 2</a></li>
                            <li><a class="dropdown-item" href="booking-hotels-list.html">Hotel List</a></li>
                            <li><a class="dropdown-item" href="booking-hotels-grid.html">Hotel Grid</a></li>
                            <li><a class="dropdown-item" href="booking-hotels-details.html">Hotel Details</a></li>
                            <li><a class="dropdown-item" target="_blank" href="booking-hotels-invoice.html">Invoice</a></li>
                            <li><a class="dropdown-item" target="_blank" href="email-template/hotel-email-template/index.html">Email Template</a></li>
                          </ul>
                        </div>
                        <div class="col-lg"> <span class="sub-title">Flights</span>
                          <ul class="dropdown-mega-submenu">
                            <li><a class="dropdown-item" href="booking-flights.html">Home Layout 1</a></li>
                            <li><a class="dropdown-item" href="booking-flights-2.html">Home Layout 2</a></li>
                            <li><a class="dropdown-item" href="booking-flights-one-way.html">One Way Trip List</a></li>
                            <li><a class="dropdown-item" href="booking-flights-round-trip.html">Round Trip List</a></li>
                            <li><a class="dropdown-item" href="booking-flights-confirm-details.html">Confirm Details</a></li>
                            <li><a class="dropdown-item" target="_blank" href="booking-flights-itinerary.html">Itinerary</a></li>
                            <li><a class="dropdown-item" target="_blank" href="booking-flights-invoice.html">Invoice</a></li>
                            <li><a class="dropdown-item" target="_blank" href="email-template/flight-email-template/index.html">Email Template</a></li>
                          </ul>
                        </div>
                        <div class="col-lg"> <span class="sub-title">Trains</span>
                          <ul class="dropdown-mega-submenu">
                            <li><a class="dropdown-item" href="booking-trains.html">Home Layout 1</a></li>
                            <li><a class="dropdown-item" href="booking-trains-2.html">Home Layout 2</a></li>
                            <li><a class="dropdown-item" href="booking-trains-list.html">Trains List</a></li>
                            <li><a class="dropdown-item" href="booking-trains-confirm-details.html">Confirm Details</a></li>
                            <li><a class="dropdown-item" target="_blank" href="booking-trains-invoice.html">Invoice</a></li>
                            <li><a class="dropdown-item" target="_blank" href="email-template/train-email-template/index.html">Email Template</a></li>
                          </ul>
                        </div>
                        <div class="col-lg"> <span class="sub-title">Bus</span>
                          <ul class="dropdown-mega-submenu">
                            <li><a class="dropdown-item" href="booking-bus.html">Home Layout 1</a></li>
                            <li><a class="dropdown-item" href="booking-bus-2.html">Home Layout 2</a></li>
                            <li><a class="dropdown-item" href="booking-bus-list.html">Bus List</a></li>
                            <li><a class="dropdown-item" href="booking-bus-confirm-details.html">Confirm Details</a></li>
                            <li><a class="dropdown-item" target="_blank" href="booking-bus-invoice.html">Invoice</a></li>
                            <li><a class="dropdown-item" target="_blank" href="email-template/bus-email-template/index.html">Email Template</a></li>
                          </ul>
                        </div>
                        <div class="col-lg"> <span class="sub-title">Cars</span>
                          <ul class="dropdown-mega-submenu">
                            <li><a class="dropdown-item" href="booking-cars.html">Home Layout 1</a></li>
                            <li><a class="dropdown-item" href="booking-cars-2.html">Home Layout 2</a></li>
                            <li><a class="dropdown-item" href="booking-cars-list.html">Cars List</a></li>
                            <li><a class="dropdown-item" href="booking-cars-grid.html">Cars Grid</a></li>
                            <li><a class="dropdown-item" href="booking-cars-grid-2.html">Cars Grid 2</a></li>
                            <li><a class="dropdown-item" href="booking-cars-details.html">Car Details</a></li>
                            <li><a class="dropdown-item" target="_blank" href="booking-cars-invoice.html">Invoice</a></li>
                            <li><a class="dropdown-item" target="_blank" href="email-template/car-email-template/index.html">Email Template</a></li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
                <li class="dropdown"> <a class="dropdown-toggle" href="#">Features</a>
                  <ul class="dropdown-menu">
                    <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Headers</a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="index-2.html">Light Version (Default)</a></li>
                        <li><a class="dropdown-item" href="index-5.html">Dark Version</a></li>
                        <li><a class="dropdown-item" href="index-6.html">Primary Version</a></li>
                        <li><a class="dropdown-item" href="index-9.html">Transparent</a></li>
                        <li><a class="dropdown-item" href="feature-page-header-custom-background-with-transparent-header.html">Transparent with border</a></li>
                      </ul>
                    </li>
                    <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Navigation DropDown</a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="index-2.html">Light Version (Default)</a></li>
                        <li><a class="dropdown-item" href="index-4.html">Dark Version</a></li>
                        <li><a class="dropdown-item" href="index-7.html">Primary Version</a></li>
                      </ul>
                    </li>
                    <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Page Headers</a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="feature-page-header-left-alignment.html">Left Alignment</a></li>
                        <li><a class="dropdown-item" href="feature-page-header-center-alignment.html">Center Alignment</a></li>
                        <li><a class="dropdown-item" href="feature-page-header-light.html">Light Version</a></li>
                        <li><a class="dropdown-item" href="feature-page-header-dark.html">Dark Version</a></li>
                        <li><a class="dropdown-item" href="feature-page-header-primary.html">Primary Version</a></li>
                        <li><a class="dropdown-item" href="feature-page-header-custom-background.html">Custom Background</a></li>
                        <li><a class="dropdown-item" href="feature-page-header-custom-background-with-transparent-header.html">Custom Background 2</a></li>
                      </ul>
                    </li>
                    <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Footer</a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="index-2.html">Light Version Default</a></li>
                        <li><a class="dropdown-item" href="index-8.html">Alternate Version</a></li>
                        <li><a class="dropdown-item" href="feature-footer-dark.html">Dark Version</a></li>
                        <li><a class="dropdown-item" href="feature-footer-primary.html">Primary Version</a></li>
                      </ul>
                    </li>
                    <li><a class="dropdown-item" href="feature-layout-boxed.html">Layout Boxed</a></li>
                  </ul>
                </li>
                <li class="dropdown active"> <a class="dropdown-toggle" href="#">Pages</a>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="about-us.html">About Us</a></li>
                    <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Login/Signup</a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="login-signup.html">Page</a></li>
                        <li><a class="dropdown-item" data-toggle="modal" data-target="#login-signup" href="#">Dialog Popup</a></li>
                      </ul>
                    </li>
                    <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">My Profile</a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="profile.html">Personal Information</a></li>
                        <li><a class="dropdown-item" href="profile-favourites.html">Favourites</a></li>
                        <li><a class="dropdown-item" href="profile-cards.html">Credit or Debit Cards</a></li>
                        <li><a class="dropdown-item" href="profile-notifications.html">Notifications</a></li>
                        <li><a class="dropdown-item" href="profile-orders-history.html">Orders History</a></li>
                        <li><a class="dropdown-item" href="profile-password.html">Change Password</a></li>
                      </ul>
                    </li>
                    <li><a class="dropdown-item" href="payment.html">Payment</a></li>
                    <li><a class="dropdown-item" href="payment-2.html">Payment 2</a></li>
                    <li><a class="dropdown-item" href="help.html">Help</a></li>
                    <li><a class="dropdown-item" href="faq.html">Faq</a></li>
                    <li><a class="dropdown-item" href="support.html">Support</a></li>
                    <li><a class="dropdown-item" href="contact-us.html">Contact Us</a></li>
                    <li><a class="dropdown-item" href="elements.html">Elements</a></li>
                    <li><a class="dropdown-item" href="elements-2.html">Elements 2</a></li>
                  </ul>
                </li>
                <li class="login-signup ml-lg-2"><a class="pl-lg-4 pr-0" data-toggle="modal" data-target="#login-signup" href="#" title="Login / Sign up">Login / Sign up <span class="d-none d-lg-inline-block"><i class="fas fa-user"></i></span></a></li>
              </ul>
            </div>
          </nav>  
          
        </div>
        
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#header-nav"> <span></span> <span></span> <span></span> </button>
      </div>
    </div>
  </header>
  
    <section class="page-header page-header-text-light bg-secondary">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h1>Payment</h1>
          </div>
          <div class="col-md-4">
            <ul class="breadcrumb justify-content-start justify-content-md-end mb-0">
              <li><a href="index-2.html">Home</a></li>
              <li class="active">Payment</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  <div id="content">
    <div class="container">
      <div class="bg-light shadow-md rounded">
        <div class="row align-items-center p-4">
          <div class="col-md-6">
            <h2 class="text-primary d-flex align-items-center m-0"><span class="text-3 text-dark mr-1">Total Payable Amount: </span>₹{amount}</h2>
          </div>
        </div>
        <hr class="m-0"/>
        <div class="p-4">
          <h3 class="text-6 mb-4">Payment Details</h3>
          <div class="row">
            
            <div class="col-md-8 col-lg-9">
              <div class="tab-content my-3" id="myTabContentVertical">
                <div class="tab-pane fade show active" id="firstTab" role="tabpanel" aria-labelledby="first-tab">
                  <div class="row">
                    <div class="col-lg-8">
                        <div class="form-group">
						<label for="cardNumber">Amount</label>
                        <p>₹{amount}</p>
                        </div>
                        <div class="form-row">
                          
                          <div class="col-lg-12">
                            <div class="form-group">
							<label for="cvvNumber">Email</label>
                              <input type="email" class="form-control" data-bv-field="cvvnumber" id="cvvNumber" required placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                            </div>
                          </div>
                        </div>
                        <div class="form-group">
						<label for="cardHolderName">Phone Number</label>
                          <input type="text" class="form-control" data-bv-field="cardholdername" value={number} onChange={(e)=>setNumber(e.target.value)} id="cardHolderName" required placeholder="Card Holder Name"/>
                        </div>
                         <button class="btn btn-primary" type="submit"  onClick={razorPayPaymentHandler}>Checkout</button>
                      
                    </div>
                    <div class="col-lg-4 mt-lg-0 mt-4">
                      <p>We Accept:</p>
                      <ul class="payments-types mb-3">
                        <li><a href="#" target="_blank"> <img data-toggle="tooltip" src="images/payment/visa.png" alt="visa" title="Visa"/></a></li>
                        <li><a href="#" target="_blank"> <img data-toggle="tooltip" src="images/payment/discover.png" alt="discover" title="Discover"/></a></li>
                        <li><a href="#" target="_blank"> <img data-toggle="tooltip" src="images/payment/american.png" alt="american express" title="American Express"/></a></li>
                        <li><a href="#" target="_blank"> <img data-toggle="tooltip" src="images/payment/mastercard.png" alt="discover" title="Discover"/></a></li>
                      </ul>
                      <div class="bg-light-2 p-3">
                        <p class="mb-2">We value your Privacy.</p>
                        <p class="text-1 mb-0">We will not sell or distribute your contact information. Read our <a href="#">Privacy Policy</a>.</p>
                        <hr/>
                        <p class="mb-2">Billing Enquiries</p>
                        <p class="text-1 mb-0">Do not hesitate to reach our <a href="#">support team</a> if you have any queries.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <footer id="footer">
    <section class="section bg-light shadow-md pt-4 pb-3">
      <div class="container">
        <div class="row">
          <div class="col-sm-6 col-md-3">
            <div class="featured-box text-center">
              <div class="featured-box-icon"> <i class="fas fa-lock"></i> </div>
              <h4>100% Secure Payments</h4>
              <p>Moving your card details to a much more secured place.</p>
            </div>
          </div>
          <div class="col-sm-6 col-md-3">
            <div class="featured-box text-center">
              <div class="featured-box-icon"> <i class="fas fa-thumbs-up"></i> </div>
              <h4>Trust pay</h4>
              <p>100% Payment Protection. Easy Return Policy.</p>
            </div>
          </div>
          <div class="col-sm-6 col-md-3">
            <div class="featured-box text-center">
              <div class="featured-box-icon"> <i class="fas fa-bullhorn"></i> </div>
              <h4>Refer & Earn</h4>
              <p>Invite a friend to sign up and earn up to $100.</p>
            </div>
          </div>
          <div class="col-sm-6 col-md-3">
            <div class="featured-box text-center">
              <div class="featured-box-icon"> <i class="far fa-life-ring"></i> </div>
              <h4>24X7 Support</h4>
              <p>We're here to help. Have a query and need help ? <a href="#">Click here</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-4 mb-3 mb-md-0">
          <p>Payment</p>
          <ul class="payments-types">
            <li><a href="#" target="_blank"> <img data-toggle="tooltip" src="images/payment/visa.png" alt="visa" title="Visa"/></a></li>
            <li><a href="#" target="_blank"> <img data-toggle="tooltip" src="images/payment/discover.png" alt="discover" title="Discover"/></a></li>
            <li><a href="#" target="_blank"> <img data-toggle="tooltip" src="images/payment/paypal.png" alt="paypal" title="PayPal"/></a></li>
            <li><a href="#" target="_blank"> <img data-toggle="tooltip" src="images/payment/american.png" alt="american express" title="American Express"/></a></li>
            <li><a href="#" target="_blank"> <img data-toggle="tooltip" src="images/payment/mastercard.png" alt="discover" title="Discover"/></a></li>
          </ul>
        </div>
        <div class="col-md-4 mb-3 mb-md-0">
          <p>Subscribe</p>
          <div class="input-group newsletter">
            <input class="form-control" placeholder="Your Email Address" name="newsletterEmail" id="newsletterEmail" type="text"/>
            <span class="input-group-append">
            <button class="btn btn-secondary" type="submit">Subscribe</button>
            </span> </div>
        </div>
        <div class="col-md-4 d-flex align-items-md-end flex-column">
          <p>Keep in touch</p>
          <ul class="social-icons">
            <li class="social-icons-facebook"><a data-toggle="tooltip" href="http://www.facebook.com/" target="_blank" title="Facebook"><i class="fab fa-facebook-f"></i></a></li>
            <li class="social-icons-twitter"><a data-toggle="tooltip" href="http://www.twitter.com/" target="_blank" title="Twitter"><i class="fab fa-twitter"></i></a></li>
            <li class="social-icons-google"><a data-toggle="tooltip" href="http://www.google.com/" target="_blank" title="Google"><i class="fab fa-google"></i></a></li>
            <li class="social-icons-linkedin"><a data-toggle="tooltip" href="http://www.linkedin.com/" target="_blank" title="Linkedin"><i class="fab fa-linkedin-in"></i></a></li>
            <li class="social-icons-youtube"><a data-toggle="tooltip" href="http://www.youtube.com/" target="_blank" title="Youtube"><i class="fab fa-youtube"></i></a></li>
            <li class="social-icons-instagram"><a data-toggle="tooltip" href="http://www.instagram.com/" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="footer-copyright">
        <ul class="nav justify-content-center">
          <li class="nav-item"> <a class="nav-link active" href="#">About Us</a> </li>
          <li class="nav-item"> <a class="nav-link" href="#">Faq</a> </li>
          <li class="nav-item"> <a class="nav-link" href="#">Contact</a> </li>
          <li class="nav-item"> <a class="nav-link" href="#">Support</a> </li>
          <li class="nav-item"> <a class="nav-link" href="#">Terms of Use</a> </li>
          <li class="nav-item"> <a class="nav-link" href="#">Privacy Policy</a> </li>
        </ul>
        <p class="copyright-text">Copyright © 2018 <a href="#">Quickai</a>. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
  
</div>

<a id="back-to-top" data-toggle="tooltip" title="Back to Top" href="javascript:void(0)"><i class="fa fa-chevron-up"></i></a>

<div id="login-signup" class="modal fade" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content p-sm-3">
      <div class="modal-body">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button>
        <ul class="nav nav-tabs" role="tablist">
          <li class="nav-item"> <a id="login-tab" class="nav-link active text-4" data-toggle="tab" href="#login" role="tab" aria-controls="login" aria-selected="true">Login</a> </li>
          <li class="nav-item"> <a id="signup-tab" class="nav-link text-4" data-toggle="tab" href="#signup" role="tab" aria-controls="signup" aria-selected="false">Sign Up</a> </li>
        </ul>
        <div class="tab-content pt-4">
          <div class="tab-pane fade show active" id="login" role="tabpanel" aria-labelledby="login-tab">
            <form id="loginForm" method="post">
              <div class="form-group">
                <input type="email" class="form-control" id="loginMobile" required placeholder="Mobile or Email ID"/>
              </div>
              <div class="form-group">
                <input type="password" class="form-control" id="loginPassword" required placeholder="Password"/>
              </div>
              <div class="row mb-4">
                <div class="col-sm">
                  <div class="form-check custom-control custom-checkbox">
                    <input id="remember-me" name="remember" class="custom-control-input" type="checkbox"/>
                    <label class="custom-control-label" for="remember-me">Remember Me</label>
                  </div>
                </div>
                <div class="col-sm text-right"> <a class="justify-content-end" href="#">Forgot Password ?</a> </div>
              </div>
              <button class="btn btn-primary btn-block" type="submit">Login</button>
            </form>
          </div>
          <div class="tab-pane fade" id="signup" role="tabpanel" aria-labelledby="signup-tab">
            <form id="signupForm" method="post">
              <div class="form-group">
                <input type="text" class="form-control" data-bv-field="number" id="signupEmail" required placeholder="Email ID"/>
              </div>
              <div class="form-group">
                <input type="text" class="form-control" id="signupMobile" required placeholder="Mobile Number"/>
              </div>
              <div class="form-group">
                <input type="password" class="form-control" id="signuploginPassword" required placeholder="Password"/>
              </div>
              <button class="btn btn-primary btn-block" type="submit">Signup</button>
            </form>
          </div>
          <div class="d-flex align-items-center my-4">
            <hr class="flex-grow-1"/>
            <span class="mx-2">OR</span>
            <hr class="flex-grow-1"/>
          </div>
          <div class="row">
            <div class="col-12 mb-3">
              <button type="button" class="btn btn-block btn-outline-primary">Login with Facebook</button>
            </div>
            <div class="col-12">
              <button type="button" class="btn btn-block btn-outline-danger">Login with Google</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</>
    )
}

export default Payment
