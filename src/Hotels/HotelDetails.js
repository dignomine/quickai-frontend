import React, { useEffect, useState } from "react";
import { useStateValue } from "../ContextApi/StateProvider";
import $ from "jquery";
import Pagination from "react-js-pagination";
import useLocalStorage from "react-use-localstorage";
import { CircularProgress, Modal } from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory, useParams } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const HotelDetails = () => {
  const history = useHistory();
  const [{ hotelBookingDetails }, dispatch] = useStateValue();
  const { traceid, hotelindex, hotelid } = useParams();
  const [hotelInfoResult, setHotelInfoResult] = useState([]);

  const [roomInfoResult, setRoomInfoResult] = useState([]);
  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [roomSelection, setRoomSelection] = useState([]);
  const [rooms, setRooms] = useState(0);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [roomPrice, setRoomPrice] = useState(0);
  const [localData, setLocalData] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState([]);

  const selectHotelRoom = (e) => {
    const idx = e.target.value;
    console.log(roomSelection);
    setSelectedRoom([roomSelection[0][idx]]);
    const price = roomSelection[0][idx]?.Price?.PublishedPriceRoundedOff;
    // console.log(price);
    setRoomPrice(price);
  };

  const bookNow = (e) => {
    e.preventDefault();
    const booknowObj = {
      ResultIndex: hotelindex,
      HotelCode: hotelid,
      HotelName: hotelInfoResult?.HotelDetails?.HotelName,
      GuestNationality: "IN",
      NoOfRooms: localData[0]?.NoOfRooms,
      ClientReferenceNo: 0,
      IsVoucherBooking: true,
      HotelRoomsDetails: [
        {
          RoomIndex: selectedRoom[0]?.RoomIndex,
          RoomTypeCode: selectedRoom[0]?.RoomTypeCode,
          RoomTypeName: selectedRoom[0]?.RoomTypeName,
          RatePlanCode: selectedRoom[0]?.RatePlanCode,
          BedTypeCode: null,
          SmokingPreference: selectedRoom[0]?.SmokingPreference,
          Supplements: null,
          Price: {
            CurrencyCode: selectedRoom[0]?.Price?.CurrencyCode,
            RoomPrice: selectedRoom[0]?.Price?.RoomPrice,
            Tax: selectedRoom[0]?.Price?.Tax,
            ExtraGuestCharge: selectedRoom[0]?.Price?.ExtraGuestCharge,
            ChildCharge: selectedRoom[0]?.Price?.ChildCharge,
            OtherCharges: selectedRoom[0]?.Price?.OtherCharges,
            Discount: selectedRoom[0]?.Price?.Discount,
            PublishedPrice: selectedRoom[0]?.Price?.PublishedPrice,
            PublishedPriceRoundedOff:
              selectedRoom[0]?.Price?.PublishedPriceRoundedOff,
            OfferedPrice: selectedRoom[0]?.Price?.OfferedPrice,
            OfferedPriceRoundedOff:
              selectedRoom[0]?.Price?.OfferedPriceRoundedOff,
            AgentCommission: selectedRoom[0]?.Price?.AgentCommission,
            AgentMarkUp: selectedRoom[0]?.Price?.AgentMarkUp,
            TDS: selectedRoom[0]?.Price?.TDS,
          },
        },
      ],
      EndUserIp: "192.168.10.26",
      TokenId: "dbfa92dd-75cb-4948-8718-d5794f1d3211",
      TraceId: traceid,
    };

    dispatch({
      type: "ADD_HOTEL_BOOKING_DETAILS",
      hotelBookingDetails: booknowObj,
    });
    console.log(booknowObj);
  };

  const increase = (type) => {
    switch (type) {
      case "Rooms": {
        setRooms(rooms + 1);
        break;
      }
      case "Adults": {
        setAdults((adults) => adults + 1);
        break;
      }
      default:
        setChildren((children) => children + 1);
    }
  };

  const decrease = (type) => {
    switch (type) {
      case "Rooms": {
        setRooms((rooms) => (rooms > 1 ? rooms - 1 : rooms));
        break;
      }
      case "Adults": {
        setAdults((adults) => (adults > 1 ? adults - 1 : adults));
        break;
      }
      default:
        setChildren((children) => (children >= 1 ? children - 1 : children));
    }
  };

  const hotelInfo = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        ResultIndex: +hotelindex,
        HotelCode: hotelid,
        EndUserIp: "192.168.10.26",
        TokenId: "036c48a3-4f70-49f0-bf3c-787f6e99bbf3",
        TraceId: traceid,
      }),
    };
    fetch(
      "/BookingEngineService_Hotel/hotelservice.svc/rest/GetHotelInfo/",
      requestOptions
    )
      .then((resp) => resp.json())
      .then((data) => {
        // console.log(data?.HotelInfoResult?.HotelDetails?.Attractions[0]?.Value);
        setHotelInfoResult(data.HotelInfoResult);
        document
          .getElementById("known-for")
          .insertAdjacentHTML(
            "beforeend",
            data?.HotelInfoResult?.HotelDetails?.Description
          );

        if (data?.HotelInfoResult?.HotelDetails?.Attractions)
          document
            .getElementById("tourist-attractions")
            .insertAdjacentHTML(
              "beforeend",
              data?.HotelInfoResult?.HotelDetails?.Attractions[0]?.Value
            );
      })
      .catch((err) => console.log(err));
  };

  const roomInfo = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        ResultIndex: +hotelindex,
        HotelCode: hotelid,
        EndUserIp: "192.168.10.26",
        TokenId: "036c48a3-4f70-49f0-bf3c-787f6e99bbf3",
        TraceId: traceid,
      }),
    };
    fetch(
      "/BookingEngineService_Hotel/hotelservice.svc/rest/GetHotelRoom/",
      requestOptions
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (!data) return alert("Room details not available");

        setRoomInfoResult([data?.GetHotelRoomResult]);
        setRoomSelection([data?.GetHotelRoomResult?.HotelRoomsDetails]);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("hotel-search-options"));

    if (data !== undefined) {
      setLocalData([data]);

      const checkinDate = new Date(
        data.CheckInDate.split("/").reverse().join("/")
      );
      const checkoutDate = new Date(
        data.CheckOutDate.split("/").reverse().join("/")
      );

      checkinDate.setDate(checkinDate.getDate() + 1);
      checkoutDate.setDate(checkoutDate.getDate() + 1);
      const defaultCheckinValue = checkinDate.toISOString().substring(0, 10);
      const defaultCheckoutValue = checkoutDate.toISOString().substring(0, 10);

      setCheckinDate(defaultCheckinValue);
      setCheckoutDate(defaultCheckoutValue);
      setRooms(data?.NoOfRooms);
      setAdults(data?.RoomGuests[0]?.NoOfAdults);
      setChildren(data?.RoomGuests[0]?.NoOfChild);
    }
  }, []);

  // useEffect(() => {
  //   console.log(localData[0]);
  // }, [localData]);

  useEffect(() => {
    // console.log(traceid, hotelindex, hotelid);
    hotelInfo();
    roomInfo();
  }, []);

  useEffect(() => {
    $(function () {
      $(".dropdown li").on("mouseenter mouseleave", function (e) {
        if ($(window).width() > 991) {
          var elm = $(".dropdown-menu", this);
          if (elm.length > 0) {
            var off = elm.offset();
            var l = off.left;
            var w = elm.width();
            var docW = $(window).width();
            var isEntirelyVisible = l + w <= docW;
            if (!isEntirelyVisible) {
              $(elm).addClass("dropdown-menu-right");
            } else {
              $(elm).removeClass("dropdown-menu-right");
            }
          } else {
          }
        }
      });
    });
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = window.location.origin + "/js/theme.js";
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <div id="main-wrapper">
        <header id="header">
          <div class="container">
            <div class="header-row">
              <div class="header-column justify-content-start">
                <div class="logo me-2 me-lg-3">
                  {" "}
                  <a
                    href="index.html"
                    class="d-flex"
                    title="Quickai - HTML Template"
                  >
                    <img src="images/logo.png" alt="Quickai" />
                  </a>{" "}
                </div>
              </div>
              <div class="header-column justify-content-end">
                <nav class="primary-menu navbar navbar-expand-lg">
                  <div id="header-nav" class="collapse navbar-collapse">
                    <ul class="navbar-nav">
                      <li class="dropdown">
                        {" "}
                        <a class="dropdown-toggle" href="#">
                          Home
                        </a>
                        <ul class="dropdown-menu">
                          <li class="dropdown">
                            <a class="dropdown-item dropdown-toggle" href="#">
                              Index 1
                            </a>
                            <ul class="dropdown-menu">
                              <li>
                                <a class="dropdown-item" href="index.html">
                                  Recharge or Bill Payment
                                </a>
                              </li>
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="booking-hotels.html"
                                >
                                  Booking
                                </a>
                              </li>
                            </ul>
                          </li>
                          <li class="dropdown">
                            <a class="dropdown-item dropdown-toggle" href="#">
                              Index 2
                            </a>
                            <ul class="dropdown-menu">
                              <li>
                                <a class="dropdown-item" href="index-2.html">
                                  Recharge or Bill Payment
                                </a>
                              </li>
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="booking-hotels-2.html"
                                >
                                  Booking
                                </a>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <a class="dropdown-item" href="index-3.html">
                              Index 3 - (Recharge & Bill)
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="index-4.html">
                              Index 4 - (Booking)
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="index-5.html">
                              Index 5 - (Recharge & Bill)
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="index-6.html">
                              Index 6 - (Booking)
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="index-7.html">
                              Index 7 - (Recharge & Bill)
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="index-8.html">
                              Index 8 - (Booking)
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="index-9.html">
                              Index 9 - (Booking)
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="index-10.html">
                              Index 10 - (Recharge & Bill)
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="index-11.html">
                              Index 11 - (Mobile Top-Up)
                            </a>
                          </li>
                        </ul>
                      </li>
                      <li class="dropdown">
                        {" "}
                        <a class="dropdown-toggle" href="#">
                          Recharge & Bill Payment
                        </a>
                        <ul class="dropdown-menu dropdown-menu-sm">
                          <li>
                            <div class="row">
                              <div class="col-lg-6">
                                <ul class="dropdown-mega-submenu">
                                  <li class="dropdown">
                                    <a
                                      class="dropdown-item dropdown-toggle"
                                      href="#"
                                    >
                                      Mobile
                                    </a>
                                    <ul class="dropdown-menu">
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          href="index.html"
                                        >
                                          Layout 1
                                        </a>
                                      </li>
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          href="index-2.html"
                                        >
                                          Layout 2
                                        </a>
                                      </li>
                                    </ul>
                                  </li>
                                  <li class="dropdown">
                                    <a
                                      class="dropdown-item dropdown-toggle"
                                      href="#"
                                    >
                                      DTH
                                    </a>
                                    <ul class="dropdown-menu">
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          href="recharge-bill-dth.html"
                                        >
                                          Layout 1
                                        </a>
                                      </li>
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          href="recharge-bill-dth-2.html"
                                        >
                                          Layout 2
                                        </a>
                                      </li>
                                    </ul>
                                  </li>
                                  <li class="dropdown">
                                    <a
                                      class="dropdown-item dropdown-toggle"
                                      href="#"
                                    >
                                      Data Card
                                    </a>
                                    <ul class="dropdown-menu">
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          href="recharge-bill-datacard.html"
                                        >
                                          Layout 1
                                        </a>
                                      </li>
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          href="recharge-bill-datacard-2.html"
                                        >
                                          Layout 2
                                        </a>
                                      </li>
                                    </ul>
                                  </li>
                                  <li class="dropdown">
                                    <a
                                      class="dropdown-item dropdown-toggle"
                                      href="#"
                                    >
                                      Broadband
                                    </a>
                                    <ul class="dropdown-menu">
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          href="recharge-bill-broadband.html"
                                        >
                                          Layout 1
                                        </a>
                                      </li>
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          href="recharge-bill-broadband-2.html"
                                        >
                                          Layout 2
                                        </a>
                                      </li>
                                    </ul>
                                  </li>
                                  <li class="dropdown">
                                    <a
                                      class="dropdown-item dropdown-toggle"
                                      href="#"
                                    >
                                      Landline
                                    </a>
                                    <ul class="dropdown-menu">
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          href="recharge-bill-landline.html"
                                        >
                                          Layout 1
                                        </a>
                                      </li>
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          href="recharge-bill-landline-2.html"
                                        >
                                          Layout 2
                                        </a>
                                      </li>
                                    </ul>
                                  </li>
                                  <li class="dropdown">
                                    <a
                                      class="dropdown-item dropdown-toggle"
                                      href="#"
                                    >
                                      Cable TV
                                    </a>
                                    <ul class="dropdown-menu">
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          href="recharge-bill-cabletv.html"
                                        >
                                          Layout 1
                                        </a>
                                      </li>
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          href="recharge-bill-cabletv-2.html"
                                        >
                                          Layout 2
                                        </a>
                                      </li>
                                    </ul>
                                  </li>
                                  <li class="dropdown">
                                    <a
                                      class="dropdown-item dropdown-toggle"
                                      href="#"
                                    >
                                      Electricity
                                    </a>
                                    <ul class="dropdown-menu">
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          href="recharge-bill-electricity.html"
                                        >
                                          Layout 1
                                        </a>
                                      </li>
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          href="recharge-bill-electricity-2.html"
                                        >
                                          Layout 2
                                        </a>
                                      </li>
                                    </ul>
                                  </li>
                                  <li class="dropdown">
                                    <a
                                      class="dropdown-item dropdown-toggle"
                                      href="#"
                                    >
                                      Metro
                                    </a>
                                    <ul class="dropdown-menu">
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          href="recharge-bill-metro.html"
                                        >
                                          Layout 1
                                        </a>
                                      </li>
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          href="recharge-bill-metro-2.html"
                                        >
                                          Layout 2
                                        </a>
                                      </li>
                                    </ul>
                                  </li>
                                  <li class="dropdown">
                                    <a
                                      class="dropdown-item dropdown-toggle"
                                      href="#"
                                    >
                                      Gas
                                    </a>
                                    <ul class="dropdown-menu">
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          href="recharge-bill-gas.html"
                                        >
                                          Layout 1
                                        </a>
                                      </li>
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          href="recharge-bill-gas-2.html"
                                        >
                                          Layout 2
                                        </a>
                                      </li>
                                    </ul>
                                  </li>
                                  <li class="dropdown">
                                    <a
                                      class="dropdown-item dropdown-toggle"
                                      href="#"
                                    >
                                      Water
                                    </a>
                                    <ul class="dropdown-menu">
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          href="recharge-bill-water.html"
                                        >
                                          Layout 1
                                        </a>
                                      </li>
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          href="recharge-bill-water-2.html"
                                        >
                                          Layout 2
                                        </a>
                                      </li>
                                    </ul>
                                  </li>
                                </ul>
                              </div>
                              <div class="col-lg-6">
                                <ul class="dropdown-mega-submenu">
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="recharge-order.html"
                                    >
                                      Order
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="recharge-order-summary.html"
                                    >
                                      Order Summary
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="recharge-payment.html"
                                    >
                                      Payment
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="recharge-payment-success.html"
                                    >
                                      Payment Success
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="recharge-plans.html"
                                    >
                                      Recharge - Plans
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="recharge-plans-2.html"
                                    >
                                      Recharge - Plans 2
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="recharge-plans-3.html"
                                    >
                                      Recharge - Plans 3
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="recharge-invoice.html"
                                      target="_blank"
                                    >
                                      Invoice
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="email-template/recharge-email-template/index.html"
                                      target="_blank"
                                    >
                                      Email Template
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </li>
                      <li class="dropdown dropdown-mega active">
                        {" "}
                        <a class="dropdown-toggle" href="#">
                          Booking
                        </a>
                        <ul class="dropdown-menu">
                          <li>
                            <div class="row">
                              <div class="col-lg">
                                {" "}
                                <span class="sub-title">Hotels</span>
                                <ul class="dropdown-mega-submenu">
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-hotels.html"
                                    >
                                      Home Layout 1
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-hotels-2.html"
                                    >
                                      Home Layout 2
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-hotels-list.html"
                                    >
                                      Hotel List
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-hotels-grid.html"
                                    >
                                      Hotel Grid
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-hotels-details.html"
                                    >
                                      Hotel Details
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-hotels-confirm-details.html"
                                    >
                                      Hotel Confirm Details
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      target="_blank"
                                      href="booking-hotels-invoice.html"
                                    >
                                      Invoice
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      target="_blank"
                                      href="email-template/hotel-email-template/index.html"
                                    >
                                      Email Template
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <div class="col-lg">
                                {" "}
                                <span class="sub-title">Flights</span>
                                <ul class="dropdown-mega-submenu">
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-flights.html"
                                    >
                                      Home Layout 1
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-flights-2.html"
                                    >
                                      Home Layout 2
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-flights-one-way.html"
                                    >
                                      One Way Trip List
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-flights-round-trip.html"
                                    >
                                      Round Trip List
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-flights-confirm-details.html"
                                    >
                                      Confirm Details
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      target="_blank"
                                      href="booking-flights-itinerary.html"
                                    >
                                      Itinerary
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      target="_blank"
                                      href="booking-flights-invoice.html"
                                    >
                                      Invoice
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      target="_blank"
                                      href="email-template/flight-email-template/index.html"
                                    >
                                      Email Template
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <div class="col-lg">
                                {" "}
                                <span class="sub-title">Trains</span>
                                <ul class="dropdown-mega-submenu">
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-trains.html"
                                    >
                                      Home Layout 1
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-trains-2.html"
                                    >
                                      Home Layout 2
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-trains-list.html"
                                    >
                                      Trains List
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-trains-confirm-details.html"
                                    >
                                      Confirm Details
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      target="_blank"
                                      href="booking-trains-invoice.html"
                                    >
                                      Invoice
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      target="_blank"
                                      href="email-template/train-email-template/index.html"
                                    >
                                      Email Template
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <div class="col-lg">
                                {" "}
                                <span class="sub-title">Bus</span>
                                <ul class="dropdown-mega-submenu">
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-bus.html"
                                    >
                                      Home Layout 1
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-bus-2.html"
                                    >
                                      Home Layout 2
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-bus-list.html"
                                    >
                                      Bus List
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-bus-confirm-details.html"
                                    >
                                      Confirm Details
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      target="_blank"
                                      href="booking-bus-invoice.html"
                                    >
                                      Invoice
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      target="_blank"
                                      href="email-template/bus-email-template/index.html"
                                    >
                                      Email Template
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <div class="col-lg">
                                {" "}
                                <span class="sub-title">Cars</span>
                                <ul class="dropdown-mega-submenu">
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-cars.html"
                                    >
                                      Home Layout 1
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-cars-2.html"
                                    >
                                      Home Layout 2
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-cars-list.html"
                                    >
                                      Cars List
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-cars-grid.html"
                                    >
                                      Cars Grid
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-cars-grid-2.html"
                                    >
                                      Cars Grid 2
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="booking-cars-details.html"
                                    >
                                      Car Details
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      target="_blank"
                                      href="booking-cars-invoice.html"
                                    >
                                      Invoice
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      target="_blank"
                                      href="email-template/car-email-template/index.html"
                                    >
                                      Email Template
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </li>
                      <li class="dropdown">
                        {" "}
                        <a class="dropdown-toggle" href="#">
                          Features
                        </a>
                        <ul class="dropdown-menu">
                          <li class="dropdown">
                            <a class="dropdown-item dropdown-toggle" href="#">
                              Headers
                            </a>
                            <ul class="dropdown-menu">
                              <li>
                                <a class="dropdown-item" href="index.html">
                                  Light Version (Default)
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="index-7.html">
                                  Left Navigation (Alternate)
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="index-4.html">
                                  Dark Version
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="index-5.html">
                                  Primary Version
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="index-8.html">
                                  Transparent
                                </a>
                              </li>
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="feature-page-header-custom-background-with-transparent-header.html"
                                >
                                  Transparent with border
                                </a>
                              </li>
                            </ul>
                          </li>
                          <li class="dropdown">
                            <a class="dropdown-item dropdown-toggle" href="#">
                              Navigation DropDown
                            </a>
                            <ul class="dropdown-menu">
                              <li>
                                <a class="dropdown-item" href="index.html">
                                  Light Version (Default)
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="index-3.html">
                                  Dark Version
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="index-6.html">
                                  Primary Version
                                </a>
                              </li>
                            </ul>
                          </li>
                          <li class="dropdown">
                            <a class="dropdown-item dropdown-toggle" href="#">
                              Page Headers
                            </a>
                            <ul class="dropdown-menu">
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="feature-page-header-left-alignment.html"
                                >
                                  Left Alignment
                                </a>
                              </li>
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="feature-page-header-center-alignment.html"
                                >
                                  Center Alignment
                                </a>
                              </li>
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="feature-page-header-light.html"
                                >
                                  Light Version
                                </a>
                              </li>
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="feature-page-header-dark.html"
                                >
                                  Dark Version
                                </a>
                              </li>
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="feature-page-header-primary.html"
                                >
                                  Primary Version
                                </a>
                              </li>
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="feature-page-header-custom-background.html"
                                >
                                  Custom Background
                                </a>
                              </li>
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="feature-page-header-custom-background-with-transparent-header.html"
                                >
                                  Custom Background 2
                                </a>
                              </li>
                            </ul>
                          </li>
                          <li class="dropdown">
                            <a class="dropdown-item dropdown-toggle" href="#">
                              Footer
                            </a>
                            <ul class="dropdown-menu">
                              <li>
                                <a class="dropdown-item" href="index.html">
                                  Light Version Default
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="index-7.html">
                                  Alternate Version
                                </a>
                              </li>
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="feature-footer-dark.html"
                                >
                                  Dark Version
                                </a>
                              </li>
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="feature-footer-primary.html"
                                >
                                  Primary Version
                                </a>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <a
                              class="dropdown-item"
                              href="feature-layout-boxed.html"
                            >
                              Layout Boxed
                            </a>
                          </li>
                        </ul>
                      </li>
                      <li class="dropdown">
                        {" "}
                        <a class="dropdown-toggle" href="#">
                          Blog
                        </a>
                        <ul class="dropdown-menu">
                          <li>
                            <a class="dropdown-item" href="blog.html">
                              Blog Standard
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="blog-grid.html">
                              Blog Grid
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="blog-list.html">
                              Blog List
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="blog-single.html">
                              Blog Single Right Sidebar
                            </a>
                          </li>
                          <li>
                            <a
                              class="dropdown-item"
                              href="blog-single-left-sidebar.html"
                            >
                              Blog Single Left Sidebar
                            </a>
                          </li>
                        </ul>
                      </li>
                      <li class="dropdown">
                        {" "}
                        <a class="dropdown-toggle" href="#">
                          Pages
                        </a>
                        <ul class="dropdown-menu">
                          <li>
                            <a class="dropdown-item" href="about-us.html">
                              About Us
                            </a>
                          </li>
                          <li class="dropdown">
                            <a class="dropdown-item dropdown-toggle" href="#">
                              Login/Signup
                            </a>
                            <ul class="dropdown-menu">
                              <li>
                                <a class="dropdown-item" href="login.html">
                                  Login
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="signup.html">
                                  Sign Up
                                </a>
                              </li>
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="forgot-password.html"
                                >
                                  Forgot Password
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item" href="otp.html">
                                  OTP - One Time Password
                                </a>
                              </li>
                            </ul>
                          </li>
                          <li class="dropdown">
                            <a class="dropdown-item dropdown-toggle" href="#">
                              My Profile
                            </a>
                            <ul class="dropdown-menu">
                              <li>
                                <a class="dropdown-item" href="profile.html">
                                  Personal Information
                                </a>
                              </li>
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="profile-favourites.html"
                                >
                                  Favourites
                                </a>
                              </li>
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="profile-cards.html"
                                >
                                  Credit or Debit Cards
                                </a>
                              </li>
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="profile-notifications.html"
                                >
                                  Notifications
                                </a>
                              </li>
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="profile-orders-history.html"
                                >
                                  Orders History
                                </a>
                              </li>
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="profile-password.html"
                                >
                                  Change Password
                                </a>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <a class="dropdown-item" href="payment.html">
                              Payment
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="payment-2.html">
                              Payment 2
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="help.html">
                              Help
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="faq.html">
                              Faq
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="support.html">
                              Support
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="contact-us.html">
                              Contact Us
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="404.html">
                              404
                            </a>
                          </li>
                          <li>
                            <a
                              class="dropdown-item"
                              href="coming-soon.html"
                              target="_blank"
                            >
                              Coming Soon
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="elements.html">
                              Elements
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="elements-2.html">
                              Elements 2
                            </a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </nav>

                <button
                  class="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#header-nav"
                >
                  {" "}
                  <span></span> <span></span> <span></span>{" "}
                </button>
                <div class="vr mx-2 h-25 my-auto"></div>

                <nav class="login-signup navbar navbar-expand">
                  <ul class="navbar-nav">
                    <li class="profile">
                      <a
                        class="pe-0"
                        data-bs-toggle="modal"
                        data-bs-target="#login-modal"
                        href="#"
                        title="Login / Sign up"
                      >
                        <span class="d-none d-sm-inline-block">
                          Login / Sign up
                        </span>{" "}
                        <span class="user-icon ms-sm-2">
                          <i class="fas fa-user"></i>
                        </span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </header>

        <section class="page-header page-header-dark bg-secondary">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-md-8">
                <h1 class="d-flex flex-wrap align-items-center mb-1">
                  {hotelInfoResult?.HotelDetails?.HotelName}{" "}
                </h1>
                <p class="opacity-8 mb-0">
                  <i class="fas fa-map-marker-alt"></i>{" "}
                  {hotelInfoResult?.HotelDetails?.Address}
                </p>
              </div>
              <div class="col-md-4">
                <ul class="breadcrumb justify-content-start justify-content-md-end mb-0">
                  <li>
                    <a href="index.html">Home</a>
                  </li>
                  <li>
                    <a href="booking-hotels.html">Hotels</a>
                  </li>
                  <li class="active">Hotel Detail</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div id="content">
          <div class="container">
            <div class="row">
              <div class="col-lg-8">
                <div class="bg-white shadow-md rounded p-3 p-sm-4 confirm-details">
                  {/* <div
                    class="owl-carousel owl-theme single-slider mb-3"
                    data-animateout="fadeOut"
                    data-animatein="fadeIn"
                    data-autoplay="true"
                    data-loop="true"
                    data-autoheight="true"
                    data-nav="true"
                    data-items="1"
                  > */}
                  <Carousel>
                    {hotelInfoResult?.HotelDetails?.Images?.length > 0 &&
                      hotelInfoResult?.HotelDetails?.Images?.map(
                        (images, idx) => {
                          return (
                            <div key={idx} style={{ height: "500px" }}>
                              <img
                                class="img-fluid"
                                src={images}
                                alt="Hotel photo"
                                style={{ height: "100%", objectFit: "contain" }}
                              />
                            </div>
                          );
                        }
                      )}
                  </Carousel>
                  {/* <div class="item">
                      <a href="#">
                        <img class="img-fluid" src={hotel1} alt="Hotel photo" />
                      </a>
                    </div>
                    <div class="item">
                      <a href="#">
                        <img
                          class="img-fluid"
                          src={hotelRoom1}
                          alt="Standard Room photo"
                        />
                      </a>
                    </div> */}
                  {/* <div class="item">
                      <a href="#">
                        <img
                          class="img-fluid"
                          src={hotelRoom2}
                          alt="Deluxe Room photo"
                        />
                      </a>
                    </div> */}
                  {/* <div class="item">
                      <a href="#">
                        <img
                          class="img-fluid"
                          src={hotelRoom3}
                          alt="Premium Room photo"
                        />
                      </a>
                    </div> */}
                  {/* </div> */}

                  <nav
                    id="navbar-sticky"
                    class="bg-white pb-2 mb-2 sticky-top smooth-scroll"
                  >
                    <ul class="nav nav-tabs">
                      <li class="nav-item">
                        {" "}
                        <a
                          class="nav-link active text-nowrap"
                          href="#known-for"
                        >
                          Known For
                        </a>{" "}
                      </li>
                      <li class="nav-item">
                        {" "}
                        <a class="nav-link" href="#choose-room">
                          Choose Room
                        </a>{" "}
                      </li>
                      <li class="nav-item">
                        {" "}
                        <a class="nav-link" href="#amenities">
                          Amenities
                        </a>{" "}
                      </li>
                      <li class="nav-item">
                        {" "}
                        <a class="nav-link" href="#reviews">
                          Reviews
                        </a>{" "}
                      </li>
                      <li class="nav-item">
                        {" "}
                        <a class="nav-link" href="#hotel-policy">
                          Hotel Policy
                        </a>{" "}
                      </li>
                    </ul>
                  </nav>

                  <p id="known-for"></p>
                  <div class="row">
                    <div class="col-12 col-sm-6">
                      <ul class="simple-ul">
                        {hotelInfoResult?.HotelDetails?.HotelFacilities
                          ?.length > 0 &&
                          hotelInfoResult?.HotelDetails?.HotelFacilities?.map(
                            (facilities) => {
                              return <li>{facilities}</li>;
                            }
                          )}
                      </ul>
                    </div>
                    {/* <div class="col-12 col-sm-6">
                      <ul class="simple-ul">
                        <li>Libero massa dapibus dui, eu</li>
                        <li>Celerisque nec, rhoncus eget</li>
                        <li>Praesent vitae dui</li>
                        <li>Ut euismod, turpis sollicitudin</li>
                      </ul>
                    </div>
                    <div class="col-12 col-sm-6">
                      <ul class="simple-ul">
                        <li>Libero massa dapibus dui, eu</li>
                        <li>Celerisque nec, rhoncus eget</li>
                        <li>Praesent vitae dui</li>
                        <li>Ut euismod, turpis sollicitudin</li>
                      </ul>
                    </div> */}
                  </div>

                  <div class="row">
                    <div class="col-12 col-sm-6" id="tourist-attractions">
                      <h3>Tourist Attractions</h3>
                    </div>
                    {/* <div class="col-12 col-sm-6">
                      <ul class="simple-ul">
                        <li>Libero massa dapibus dui, eu</li>
                        <li>Celerisque nec, rhoncus eget</li>
                        <li>Praesent vitae dui</li>
                        <li>Ut euismod, turpis sollicitudin</li>
                      </ul>
                    </div>
                    <div class="col-12 col-sm-6">
                      <ul class="simple-ul">
                        <li>Libero massa dapibus dui, eu</li>
                        <li>Celerisque nec, rhoncus eget</li>
                        <li>Praesent vitae dui</li>
                        <li>Ut euismod, turpis sollicitudin</li>
                      </ul>
                    </div> */}
                  </div>

                  <hr />
                  <div class="featured-box style-1">
                    <div class="featured-box-icon text-muted">
                      {" "}
                      <i class="far fa-comments"></i>
                    </div>
                    <h3 class="fw-400 text-4 mb-1">Staff Speaks</h3>
                    <p>English, Hindi, Spanish, Arabic, Russian</p>
                  </div>

                  <hr class="mb-4" />

                  <h2 id="choose-room" class="text-6 mb-4 mt-2">
                    Choose Room
                  </h2>
                  {roomInfoResult?.length > 0 &&
                    roomInfoResult[0]?.HotelRoomsDetails?.map(
                      (hotelRoom, roomIdx) => {
                        // console.log(hotelRoom);
                        return (
                          <>
                            <div class="row g-4" key={roomIdx}>
                              <div class="col-12 col-md-5">
                                {" "}
                                <img
                                  class="img-fluid rounded align-top"
                                  src="images/brands/hotels/hotel-room-1.jpg"
                                  title="Standard Room"
                                  alt="Standard Room"
                                />{" "}
                              </div>
                              <div class="col-12 col-md-7">
                                <h4 class="text-5">
                                  {hotelRoom?.RoomTypeName}
                                </h4>
                                <ul class="list-inline mb-2">
                                  <li class="list-inline-item">
                                    <span class="me-1 text-black-50">
                                      <i class="fas fa-bed"></i>
                                    </span>{" "}
                                    King Size Bed
                                  </li>
                                  <li class="list-inline-item">
                                    <span class="me-1 text-black-50">
                                      <i class="fas fa-arrows-alt"></i>
                                    </span>{" "}
                                    3.66x3.66 sq.mtr
                                  </li>
                                </ul>
                                <div class="row text-1 mb-3">
                                  {hotelRoom?.Amenities &&
                                    hotelRoom?.Amenities.map(
                                      (amenities, idx) => {
                                        return (
                                          <div
                                            class="col-12 col-xl-12"
                                            key={idx}
                                          >
                                            <span class="text-success me-1">
                                              <i class="fas fa-check"></i>
                                            </span>
                                            {amenities}
                                          </div>
                                        );
                                      }
                                    )}
                                </div>
                                <div class="d-flex align-items-center">
                                  <div class="text-dark text-7 lh-1 fw-500 me-2 me-lg-3">
                                    ₹
                                    {hotelRoom?.Price?.PublishedPriceRoundedOff}
                                  </div>
                                  {/* <div class="d-block text-4 text-black-50 me-2 me-lg-3">
                                    <del class="d-block">$250</del>
                                  </div>
                                  <div class="text-success text-3 me-2 me-lg-3">
                                    16% Off!
                                  </div> */}
                                  <span class="text-black-50">
                                    1 Room/Night
                                  </span>{" "}
                                </div>
                                <div class="d-flex align-items-center mt-3">
                                  {" "}
                                  <a
                                    href="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#cancellation-policy"
                                  >
                                    Cancellation Policy
                                  </a>{" "}
                                  <a
                                    href=""
                                    class="btn btn-sm btn-outline-primary shadow-none ms-auto"
                                  >
                                    Select Room
                                  </a>{" "}
                                </div>
                              </div>
                            </div>
                            <hr class="my-4" />
                          </>
                        );
                      }
                    )}
                  {/* <div class="row g-4">
                    <div class="col-12 col-md-5">
                      {" "}
                      <img
                        class="img-fluid rounded align-top"
                        src="images/brands/hotels/hotel-room-1.jpg"
                        title="Standard Room"
                        alt="Standard Room"
                      />{" "}
                    </div>
                    <div class="col-12 col-md-7">
                      <h4 class="text-5">Standard Room</h4>
                      <ul class="list-inline mb-2">
                        <li class="list-inline-item">
                          <span class="me-1 text-black-50">
                            <i class="fas fa-bed"></i>
                          </span>{" "}
                          King Size Bed
                        </li>
                        <li class="list-inline-item">
                          <span class="me-1 text-black-50">
                            <i class="fas fa-arrows-alt"></i>
                          </span>{" "}
                          3.66x3.66 sq.mtr
                        </li>
                      </ul>
                      <div class="row text-1 mb-3">
                        <div class="col-6 col-xl-4">
                          <span class="text-success me-1">
                            <i class="fas fa-check"></i>
                          </span>
                          Free WiFi
                        </div>
                        <div class="col-6 col-xl-4">
                          <span class="text-success me-1">
                            <i class="fas fa-check"></i>
                          </span>
                          Television
                        </div>
                        <div class="col-6 col-xl-4">
                          <span class="text-success me-1">
                            <i class="fas fa-check"></i>
                          </span>
                          Hair Dryer
                        </div>
                        <div class="col-6 col-xl-4">
                          <span class="text-success me-1">
                            <i class="fas fa-check"></i>
                          </span>
                          Shower
                        </div>
                        <div class="col-6 col-xl-4">
                          <span class="text-success me-1">
                            <i class="fas fa-check"></i>
                          </span>
                          Tea Maker
                        </div>
                      </div>
                      <div class="d-flex align-items-center">
                        <div class="text-dark text-7 lh-1 fw-500 me-2 me-lg-3">
                          $210
                        </div>
                        <div class="d-block text-4 text-black-50 me-2 me-lg-3">
                          <del class="d-block">$250</del>
                        </div>
                        <div class="text-success text-3 me-2 me-lg-3">
                          16% Off!
                        </div>
                        <span class="text-black-50">1 Room/Night</span>{" "}
                      </div>
                      <div class="d-flex align-items-center mt-3">
                        {" "}
                        <a
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#cancellation-policy"
                        >
                          Cancellation Policy
                        </a>{" "}
                        <a
                          href=""
                          class="btn btn-sm btn-outline-primary shadow-none ms-auto"
                        >
                          Select Room
                        </a>{" "}
                      </div>
                    </div>
                  </div>
                  <hr class="my-4" />
                  <div class="row g-4">
                    <div class="col-12 col-md-5">
                      {" "}
                      <img
                        class="img-fluid rounded align-top"
                        src="images/brands/hotels/hotel-room-2.jpg"
                        title="Deluxe Room"
                        alt="Deluxe Room"
                      />{" "}
                    </div>
                    <div class="col-12 col-md-7">
                      <h4 class="text-5">Deluxe Room</h4>
                      <ul class="list-inline mb-2">
                        <li class="list-inline-item">
                          <span class="me-1 text-black-50">
                            <i class="fas fa-bed"></i>
                          </span>{" "}
                          Double Size Bed
                        </li>
                        <li class="list-inline-item">
                          <span class="me-1 text-black-50">
                            <i class="fas fa-arrows-alt"></i>
                          </span>{" "}
                          3.66x3.66 sq.mtr
                        </li>
                      </ul>
                      <div class="row text-1 mb-3">
                        <div class="col-6 col-xl-4">
                          <span class="text-success me-1">
                            <i class="fas fa-check"></i>
                          </span>
                          Air Conditioning
                        </div>
                        <div class="col-6 col-xl-4">
                          <span class="text-success me-1">
                            <i class="fas fa-check"></i>
                          </span>
                          Free WiFi
                        </div>
                        <div class="col-6 col-xl-4">
                          <span class="text-success me-1">
                            <i class="fas fa-check"></i>
                          </span>
                          Television
                        </div>
                        <div class="col-6 col-xl-4">
                          <span class="text-success me-1">
                            <i class="fas fa-check"></i>
                          </span>
                          Hair Dryer
                        </div>
                        <div class="col-6 col-xl-4">
                          <span class="text-success me-1">
                            <i class="fas fa-check"></i>
                          </span>
                          Bathtub
                        </div>
                        <div class="col-6 col-xl-4">
                          <span class="text-success me-1">
                            <i class="fas fa-check"></i>
                          </span>
                          Tea Maker
                        </div>
                      </div>
                      <div class="d-flex align-items-center">
                        <div class="text-dark text-7 lh-1 fw-500 me-2 me-lg-3">
                          $250
                        </div>
                        <div class="d-block text-4 text-black-50 me-2 me-lg-3">
                          <del class="d-block">$290</del>
                        </div>
                        <div class="text-success text-3 me-2 me-lg-3">
                          14% Off!
                        </div>
                        <span class="text-black-50">1 Room/Night</span>{" "}
                      </div>
                      <div class="d-flex align-items-center mt-3">
                        {" "}
                        <a
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#cancellation-policy"
                        >
                          Cancellation Policy
                        </a>{" "}
                        <a
                          href=""
                          class="btn btn-sm btn-outline-primary shadow-none ms-auto"
                        >
                          Select Room
                        </a>{" "}
                      </div>
                    </div>
                  </div>
                  <hr class="my-4" />
                  <div class="row g-4">
                    <div class="col-12 col-md-5">
                      {" "}
                      <img
                        class="img-fluid rounded align-top"
                        src="images/brands/hotels/hotel-room-3.jpg"
                        title="Premium Room"
                        alt="Premium Room"
                      />{" "}
                    </div>
                    <div class="col-12 col-md-7">
                      <h4 class="text-5">Premium Room</h4>
                      <ul class="list-inline mb-2">
                        <li class="list-inline-item">
                          <span class="me-1 text-black-50">
                            <i class="fas fa-bed"></i>
                          </span>{" "}
                          Triple Size Bed
                        </li>
                        <li class="list-inline-item">
                          <span class="me-1 text-black-50">
                            <i class="fas fa-arrows-alt"></i>
                          </span>{" "}
                          4.77x4.77 sq.mtr
                        </li>
                      </ul>
                      <div class="row text-1 mb-3">
                        <div class="col-6 col-xl-4">
                          <span class="text-success me-1">
                            <i class="fas fa-check"></i>
                          </span>
                          Air Conditioning
                        </div>
                        <div class="col-6 col-xl-4">
                          <span class="text-success me-1">
                            <i class="fas fa-check"></i>
                          </span>
                          Free WiFi
                        </div>
                        <div class="col-6 col-xl-4">
                          <span class="text-success me-1">
                            <i class="fas fa-check"></i>
                          </span>
                          Television
                        </div>
                        <div class="col-6 col-xl-4">
                          <span class="text-success me-1">
                            <i class="fas fa-check"></i>
                          </span>
                          Hair Dryer
                        </div>
                        <div class="col-6 col-xl-4">
                          <span class="text-success me-1">
                            <i class="fas fa-check"></i>
                          </span>
                          Bathtub
                        </div>
                        <div class="col-6 col-xl-4">
                          <span class="text-success me-1">
                            <i class="fas fa-check"></i>
                          </span>
                          Tea Maker
                        </div>
                      </div>
                      <div class="d-flex align-items-center">
                        <div class="text-dark text-7 lh-1 fw-500 me-2 me-lg-3">
                          $309
                        </div>
                        <div class="d-block text-4 text-black-50 me-2 me-lg-3">
                          <del class="d-block">$360</del>
                        </div>
                        <div class="text-success text-3 me-2 me-lg-3">
                          14% Off!
                        </div>
                        <span class="text-black-50">1 Room/Night</span>{" "}
                      </div>
                      <div class="d-flex align-items-center mt-3">
                        {" "}
                        <a
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#cancellation-policy"
                        >
                          Cancellation Policy
                        </a>{" "}
                        <a
                          href=""
                          class="btn btn-sm btn-outline-primary shadow-none ms-auto"
                        >
                          Select Room
                        </a>{" "}
                      </div>
                    </div>
                  </div> */}

                  <div
                    id="cancellation-policy"
                    class="modal fade"
                    role="dialog"
                    aria-hidden="true"
                  >
                    <div
                      class="modal-dialog modal-dialog-centered"
                      role="document"
                    >
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title">Cancellation Policy</h5>
                          <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div class="modal-body">
                          <ul>
                            <li>Non-Refundable on cancellation or No Show</li>
                            <li>
                              goCash used in the booking will be non refundable
                            </li>
                            <li>Any Add-on charges are Non-Refundable.</li>
                            <li>
                              You can not change the Check-in or Check-out date.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr class="my-4" />

                  <h2 id="amenities" class="text-6 mb-3 mt-2">
                    Amenities
                  </h2>
                  <p class="hotels-amenities-detail text-5">
                    {" "}
                    {/* {hotelInfoResult?.HotelDetails?.HotelFacilities?.length >
                      0 &&
                      hotelInfoResult?.HotelDetails?.HotelFacilities?.map(
                        (facilities) => {
                          return (
                            <span
                              class="border rounded"
                              data-bs-toggle="tooltip"
                            >
                              {facilities}
                            </span>
                          );
                        }
                      )} */}
                    {/* <span
                      class="border rounded"
                      data-bs-toggle="tooltip"
                      title="Internet/Wi-Fi"
                    >
                      <i class="fas fa-wifi"></i>
                    </span>{" "}
                    <span
                      class="border rounded"
                      data-bs-toggle="tooltip"
                      title="Restaurant"
                    >
                      <i class="fas fa-utensils"></i>
                    </span>{" "}
                    <span
                      class="border rounded"
                      data-bs-toggle="tooltip"
                      title="Bar"
                    >
                      <i class="fas fa-glass-martini"></i>
                    </span>{" "}
                    <span
                      class="border rounded"
                      data-bs-toggle="tooltip"
                      title="Swimming Pool"
                    >
                      <i class="fas fa-swimmer"></i>
                    </span>{" "}
                    <span
                      class="border rounded"
                      data-bs-toggle="tooltip"
                      title="Business Facilities"
                    >
                      <i class="fas fa-chalkboard-teacher"></i>
                    </span>{" "}
                    <span
                      class="border rounded"
                      data-bs-toggle="tooltip"
                      title="Spa"
                    >
                      <i class="fas fa-spa"></i>
                    </span>{" "}
                    <span
                      class="border rounded"
                      data-bs-toggle="tooltip"
                      title="Gym"
                    >
                      <i class="fas fa-dumbbell"></i>
                    </span>{" "} */}
                  </p>

                  <hr class="my-4" />

                  <h2 id="reviews" class="text-6 mb-3 mt-2">
                    Reviews
                  </h2>
                  <div class="row">
                    <div class="col-sm-4 col-md-3">
                      <div
                        id="review-summary"
                        class="bg-primary text-white rounded px-2 py-4 mb-4 mb-sm-0 text-center"
                      >
                        <div class="text-10 fw-600 lh-1 d-block">
                          {hotelInfoResult?.HotelDetails?.StarRating}
                        </div>
                        <div class="fw-500 text-3 my-1">Excellent</div>
                        <small class="d-block">Based on 245 reviews</small>{" "}
                      </div>
                    </div>
                    <div class="col-sm-8 col-md-9">
                      <div class="row">
                        <div class="col-8 col-sm-9 col-lg-10">
                          <div class="progress mb-3">
                            <div
                              class="progress-bar"
                              role="progressbar"
                              style={{ width: "95%" }}
                              aria-valuenow="95"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                        <div class="col-4 col-sm-3 col-lg-2">
                          <small class="fw-600 align-text-top lh-1">
                            Excellent
                          </small>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-lg-10 col-9">
                          <div class="progress mb-3">
                            <div
                              class="progress-bar"
                              role="progressbar"
                              style={{ width: "85%" }}
                              aria-valuenow="85"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                        <div class="col-lg-2 col-3">
                          <small class="fw-600 align-text-top lh-1">Good</small>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-lg-10 col-9">
                          <div class="progress mb-3">
                            <div
                              class="progress-bar"
                              role="progressbar"
                              style={{ width: "60%" }}
                              aria-valuenow="60"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                        <div class="col-lg-2 col-3">
                          <small class="fw-600 align-text-top lh-1">Fair</small>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-lg-10 col-9">
                          <div class="progress mb-3">
                            <div
                              class="progress-bar"
                              role="progressbar"
                              style={{ width: "25%" }}
                              aria-valuenow="25"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                        <div class="col-lg-2 col-3">
                          <small class="fw-600 align-text-top lh-1">Poor</small>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-10 col-9">
                          <div class="progress mb-3">
                            <div
                              class="progress-bar"
                              role="progressbar"
                              style={{ width: "0" }}
                              aria-valuenow="0"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                        <div class="col-lg-2 col-3">
                          <small class="fw-600 align-text-top lh-1">Bad</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr class="mb-4" />
                  <div class="row">
                    <div class="col-12 col-sm-3 text-center">
                      <div class="review-tumb bg-dark-5 text-light rounded-circle d-inline-block mb-2 text-center text-8">
                        R
                      </div>
                      <p class="mb-0 lh-1">Ruby Clinton</p>
                      <small>
                        <em>Jan 25, 2019</em>
                      </small>{" "}
                    </div>
                    <div class="col-12 col-sm-9 text-center text-sm-start">
                      {" "}
                      <span class="text-2">
                        {" "}
                        <i class="fas fa-star text-warning"></i>{" "}
                        <i class="fas fa-star text-warning"></i>{" "}
                        <i class="fas fa-star text-warning"></i>{" "}
                        <i class="fas fa-star text-warning"></i>{" "}
                        <i class="fas fa-star text-muted opacity-4"></i>{" "}
                      </span>
                      <p class="fw-600 mb-1">
                        Excellent hotel with great location
                      </p>
                      <p>
                        We stayed in this hotel for one night and were happy
                        that we booked this hotel. Location is excellent and
                        hotel has a lovely ambience . Rooms are very spacious
                        with a decent decor. Overall experience was good.
                      </p>
                      <hr />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 col-sm-3 text-center">
                      <div class="review-tumb text-light rounded-circle d-inline-block mb-2 text-center text-8">
                        {" "}
                        <img
                          class="rounded-circle"
                          alt=""
                          src="images/brands/hotels/tumb.jpg"
                        />{" "}
                      </div>
                      <p class="mb-0 lh-1">James Maxwell</p>
                      <small>
                        <em>Dec 19, 2018</em>
                      </small>{" "}
                    </div>
                    <div class="col-12 col-sm-9 text-center text-sm-start">
                      {" "}
                      <span class="text-2">
                        {" "}
                        <i class="fas fa-star text-warning"></i>{" "}
                        <i class="fas fa-star text-warning"></i>{" "}
                        <i class="fas fa-star text-warning"></i>{" "}
                        <i class="fas fa-star text-warning"></i>{" "}
                        <i class="fas fa-star text-warning"></i>{" "}
                      </span>
                      <p class="fw-600 mb-1">Safe for Family & Good service</p>
                      <p>
                        It was a nice experience the hotel was neat and clean.
                        Good location nice staffs. food items specially Curry
                        needs to be more tastier. this is my third stay in this
                        hotel. great experience, Safe for Family.
                      </p>
                      <hr />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 col-sm-3 text-center">
                      <div class="review-tumb bg-dark-5 text-light rounded-circle d-inline-block mb-2 text-center text-8">
                        N
                      </div>
                      <p class="mb-0 lh-1">Neil Patel</p>
                      <small>
                        <em>Nov 03, 2018</em>
                      </small>{" "}
                    </div>
                    <div class="col-12 col-sm-9 text-center text-sm-start">
                      {" "}
                      <span class="text-2">
                        {" "}
                        <i class="fas fa-star text-warning"></i>{" "}
                        <i class="fas fa-star text-warning"></i>{" "}
                        <i class="fas fa-star text-warning"></i>{" "}
                        <i class="fas fa-star text-muted opacity-4"></i>{" "}
                        <i class="fas fa-star text-muted opacity-4"></i>{" "}
                      </span>
                      <p class="fw-600 mb-1">
                        Staff is very helpful but rooms are bit small
                      </p>
                      <p>
                        Staff is very helpful and courteous but rooms are bit
                        small, smelly and you have to share your stay with
                        cockroaches.
                      </p>
                      <hr />
                    </div>
                  </div>
                  <div class="text-center">
                    {" "}
                    <a href="#" class="btn btn-sm btn-outline-dark shadow-none">
                      view more reviews
                    </a>{" "}
                  </div>
                  <h5 class="mb-3 mt-2">Write a review</h5>
                  <form>
                    <div class="mb-3">
                      <label class="form-label" for="yourName">
                        Your Name
                      </label>
                      <input
                        type="email"
                        class="form-control"
                        id="yourName"
                        required=""
                        aria-describedby="yourName"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="yourReview">
                        Your Review
                      </label>
                      <textarea
                        class="form-control"
                        rows="5"
                        id="yourReview"
                        required=""
                        placeholder="Enter Your Review"
                      ></textarea>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Rating</label>
                      <div>
                        <div class="form-check form-check-inline">
                          <input
                            id="bad"
                            name="reviewRating"
                            class="form-check-input"
                            checked=""
                            required=""
                            type="radio"
                          />
                          <label class="form-check-label" for="bad">
                            Bad
                          </label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input
                            id="poor"
                            name="reviewRating"
                            class="form-check-input"
                            checked=""
                            required=""
                            type="radio"
                          />
                          <label class="form-check-label" for="poor">
                            Poor
                          </label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input
                            id="fair"
                            name="reviewRating"
                            class="form-check-input"
                            checked=""
                            required=""
                            type="radio"
                          />
                          <label class="form-check-label" for="fair">
                            Fair
                          </label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input
                            id="good"
                            name="reviewRating"
                            class="form-check-input"
                            checked=""
                            required=""
                            type="radio"
                          />
                          <label class="form-check-label" for="good">
                            Good
                          </label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input
                            id="excellent"
                            name="reviewRating"
                            class="form-check-input"
                            checked=""
                            required=""
                            type="radio"
                          />
                          <label class="form-check-label" for="excellent">
                            Excellent
                          </label>
                        </div>
                      </div>
                    </div>
                    <button type="submit" class="btn btn-primary">
                      Submit
                    </button>
                  </form>

                  <hr class="my-4" />

                  <h2 id="hotel-policy" class="text-6 mb-3 mt-2">
                    Hotel Policy
                  </h2>
                  {hotelInfoResult?.HotelDetails?.HotelPolicy === null ? (
                    <>
                      <p>
                        The standard check-in time is 12:00 PM and the standard
                        check-out time is 11:00 AM. Early check-in or late
                        check-out is strictly subjected to availability and may
                        be chargeable by the hotel. Any early check-in or late
                        check-out request must be directed and reconfirmed with
                        hotel directly, Accommodation, 24 hours House Keeping,
                        Hot and Cold water available, Internet, Telephone.
                      </p>
                      <p>
                        Hotel Policy: Most hotels do not allow
                        unmarried/unrelated couples to check-in. This is at the
                        full discretion of the hotel management. No refund would
                        be applicable in case the hotel denies check-in under
                        such circumstances., Most hotels do not allow same
                        city/local ID Proofs for check-in. Kindly check with
                        your hotel about the same before checking in. This is at
                        full discretion of the hotel management. No refund would
                        be applicable in case the hotel denies check-in under
                        such circumstances.
                      </p>
                    </>
                  ) : (
                    hotelInfoResult?.HotelDetails?.HotelPolicy
                  )}
                </div>
              </div>

              <aside class="col-lg-4 mt-4 mt-lg-0">
                <div class="bg-white shadow-md rounded p-3 sticky-top">
                  <p class="reviews text-center">
                    {" "}
                    <span class="reviews-score rounded fw-600 text-white px-2 py-1">
                      {hotelInfoResult?.HotelDetails?.StarRating}
                    </span>{" "}
                    <span class="fw-600">Excellent</span>{" "}
                    <span class="text-black-50">(245 reviews)</span>{" "}
                  </p>
                  <hr class="mx-n3" />
                  <form id="bookingHotels" method="post">
                    <div class="row g-3">
                      <div class="col-lg-6">
                        <div class="position-relative">
                          {/* <input
                            id="hotelsCheckIn"
                            type="text"
                            class="form-control"
                            required=""
                            placeholder="Check In"
                          />
                          <span class="icon-inside">
                            <i class="far fa-calendar-alt"></i>
                          </span>{" "} */}

                          <input
                            id="hotelsCheckIn"
                            type="date"
                            class="form-control"
                            required
                            defaultValue={checkinDate}
                            placeholder="Check In"
                            onChange={(e) => {
                              const date = e.target.value;
                              const newDate = date
                                .split("-")
                                .reverse()
                                .join("/");
                              setCheckinDate(newDate);
                            }}
                          />
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="position-relative">
                          {/* <input
                            id="hotelsCheckOut"
                            type="text"
                            class="form-control"
                            required=""
                            placeholder="Check Out"
                          />
                          <span class="icon-inside">
                            <i class="far fa-calendar-alt"></i>
                          </span>{" "} */}
                          <input
                            id="hotelsCheckOut"
                            type="date"
                            class="form-control"
                            required
                            defaultValue={checkoutDate}
                            placeholder="Check Out"
                            onChange={(e) => {
                              const date = e.target.value;
                              const newDate = date.split("-").join("/");
                              setCheckoutDate(newDate);
                            }}
                          />
                        </div>
                      </div>
                      <div class="col-12">
                        <div class="travellers-class">
                          <input
                            type="text"
                            // id="hotelsTravellersClass"
                            class="travellers-class-input form-control"
                            // name="hotels-travellers-class"
                            placeholder="-"
                            value={`${rooms} Rooms / ${adults} Adults / ${children} Children`}
                            required
                            // onkeypress="return false;"
                          />
                          <span class="icon-inside">
                            <i class="fas fa-caret-down"></i>
                          </span>
                          <div
                            class="travellers-dropdown"
                            style={{ display: "none" }}
                          >
                            <div class="row align-items-center">
                              <div class="col-sm-7">
                                <p class="mb-sm-0">Rooms</p>
                              </div>
                              <div class="col-sm-5 ">
                                <div class="qty input-group">
                                  <div class="input-group-prepend">
                                    <button
                                      type="button"
                                      class="btn bg-light-4"
                                      // data-value="decrease"
                                      // data-target="#hotels-rooms"
                                      data-toggle="spinner"
                                      onClick={(e) => decrease("Rooms")}
                                    >
                                      -
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    data-ride="spinner"
                                    id="hotels-rooms"
                                    class="qty-spinner form-control"
                                    value={rooms}
                                    readOnly=""
                                  />
                                  <div class="input-group-append">
                                    <button
                                      type="button"
                                      class="btn bg-light-4"
                                      // data-value="increase"
                                      // data-target="#hotels-rooms"
                                      data-toggle="spinner"
                                      onClick={() => increase("Rooms")}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr class="mt-2 mb-4" />
                            <div class="row align-items-center">
                              <div class="col-sm-7 ">
                                <p class="mb-sm-0">
                                  Adults
                                  <small class="text-muted">(12+ yrs)</small>
                                </p>
                              </div>
                              <div class="col-sm-5 ">
                                <div class="qty input-group">
                                  <div class="input-group-prepend">
                                    <button
                                      type="button"
                                      class="btn bg-light-4"
                                      // data-value="decrease"
                                      // data-target="#adult-travellers"
                                      data-toggle="spinner"
                                      onClick={() => decrease("Adults")}
                                    >
                                      -
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    data-ride="spinner"
                                    id="adult-travellers"
                                    class="qty-spinner form-control"
                                    value={adults}
                                    readonly=""
                                  />
                                  <div class="input-group-append">
                                    <button
                                      type="button"
                                      class="btn bg-light-4"
                                      // data-value="increase"
                                      // data-target="#adult-travellers"
                                      data-toggle="spinner"
                                      onClick={() => increase("Adults")}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr class="my-2" />
                            <div class="row align-items-center">
                              <div class="col-sm-7 ">
                                <p class="mb-sm-0">
                                  Children
                                  <small class="text-muted">(1-12 yrs)</small>
                                </p>
                              </div>
                              <div class="col-sm-5">
                                <div class="qty input-group">
                                  <div class="input-group-prepend">
                                    <button
                                      type="button"
                                      class="btn bg-light-4"
                                      // data-value="decrease"
                                      // data-target="#children-travellers"
                                      data-toggle="spinner"
                                      onClick={() => decrease("Children")}
                                    >
                                      -
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    data-ride="spinner"
                                    id="children-travellers"
                                    class="qty-spinner form-control"
                                    value={children}
                                    readonly=""
                                  />
                                  <div class="input-group-append">
                                    <button
                                      type="button"
                                      class="btn bg-light-4"
                                      // data-value="increase"
                                      // data-target="#children-travellers"
                                      data-toggle="spinner"
                                      onClick={() => increase("Children")}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="d-grid mt-4">
                              <button
                                class="btn btn-primary submit-done"
                                type="button"
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-12">
                        <select
                          class="form-select form-control"
                          id="operator"
                          onChange={(e) => {
                            selectHotelRoom(e);
                          }}
                          required=""
                        >
                          {roomSelection[0]?.length > 0 &&
                            roomSelection[0]?.map((room, idx) => {
                              // console.log(room);
                              return (
                                <option value={idx}>{room.RoomTypeName}</option>
                              );
                            })}
                          {/* <option value="">Room Type</option>
                          <option>Standard Room</option>
                          <option>Deluxe Room</option>
                          <option>Premium Room</option> */}
                        </select>
                      </div>
                    </div>
                    <div class="d-flex align-items-center my-4">
                      <div class="text-dark text-8 lh-1 fw-500 me-2 me-lg-3">
                        {roomPrice === 0 ? "-" : ` ₹${roomPrice}`}
                      </div>
                      {/* <div class="d-block text-4 text-black-50 me-2 me-lg-3">
                        <del class="d-block">$250</del>
                      </div>
                      <div class="text-success text-3">16% Off!</div> */}
                      <div class="text-black-50 ms-auto">1 Room/Night</div>
                    </div>
                    <div class="d-grid">
                      <button
                        onClick={(e) => {
                          bookNow(e);
                        }}
                        class="btn btn-primary"
                        // type="submit"
                      >
                        Book Now
                      </button>
                    </div>
                  </form>
                  <p class="text-center mt-3 mb-1">
                    <span class="text-uppercase fw-700">Checkin</span> : 12:00
                    PM / <span class="text-uppercase fw-700">Checkout</span> :
                    11:00 AM
                  </p>
                  <p class="text-danger text-center mb-0">
                    <i class="far fa-clock"></i> Last Booked - 18 hours ago
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>

        <footer id="footer">
          <section class="section bg-white shadow-md pt-4 pb-3">
            <div class="container">
              <div class="row">
                <div class="col-sm-6 col-md-3">
                  <div class="featured-box text-center">
                    <div class="featured-box-icon">
                      {" "}
                      <i class="fas fa-lock"></i>{" "}
                    </div>
                    <h4>100% Secure Payments</h4>
                    <p>
                      Moving your card details to a much more secured place.
                    </p>
                  </div>
                </div>
                <div class="col-sm-6 col-md-3">
                  <div class="featured-box text-center">
                    <div class="featured-box-icon">
                      {" "}
                      <i class="fas fa-thumbs-up"></i>{" "}
                    </div>
                    <h4>Trust pay</h4>
                    <p>100% Payment Protection. Easy Return Policy.</p>
                  </div>
                </div>
                <div class="col-sm-6 col-md-3">
                  <div class="featured-box text-center">
                    <div class="featured-box-icon">
                      {" "}
                      <i class="fas fa-bullhorn"></i>{" "}
                    </div>
                    <h4>Refer & Earn</h4>
                    <p>Invite a friend to sign up and earn up to $100.</p>
                  </div>
                </div>
                <div class="col-sm-6 col-md-3">
                  <div class="featured-box text-center">
                    <div class="featured-box-icon">
                      {" "}
                      <i class="far fa-life-ring"></i>{" "}
                    </div>
                    <h4>24X7 Support</h4>
                    <p>
                      We're here to help. Have a query and need help ?{" "}
                      <a href="#">Click here</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div class="container mt-4">
            <div class="row g-4">
              <div class="col-md-4">
                <p>Payment</p>
                <ul class="payments-types">
                  <li>
                    <a href="#" target="_blank">
                      {" "}
                      <img
                        data-bs-toggle="tooltip"
                        src="images/payment/visa.png"
                        alt="visa"
                        title="Visa"
                      />
                    </a>
                  </li>
                  <li>
                    <a href="#" target="_blank">
                      {" "}
                      <img
                        data-bs-toggle="tooltip"
                        src="images/payment/discover.png"
                        alt="discover"
                        title="Discover"
                      />
                    </a>
                  </li>
                  <li>
                    <a href="#" target="_blank">
                      {" "}
                      <img
                        data-bs-toggle="tooltip"
                        src="images/payment/paypal.png"
                        alt="paypal"
                        title="PayPal"
                      />
                    </a>
                  </li>
                  <li>
                    <a href="#" target="_blank">
                      {" "}
                      <img
                        data-bs-toggle="tooltip"
                        src="images/payment/american.png"
                        alt="american express"
                        title="American Express"
                      />
                    </a>
                  </li>
                  <li>
                    <a href="#" target="_blank">
                      {" "}
                      <img
                        data-bs-toggle="tooltip"
                        src="images/payment/mastercard.png"
                        alt="discover"
                        title="Discover"
                      />
                    </a>
                  </li>
                </ul>
              </div>
              <div class="col-md-4">
                <p>Subscribe</p>
                <div class="input-group newsletter">
                  <input
                    class="form-control"
                    placeholder="Your Email Address"
                    name="newsletterEmail"
                    id="newsletterEmail"
                    type="text"
                  />
                  <button
                    class="btn btn-secondary shadow-none px-3"
                    type="submit"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
              <div class="col-md-4 d-flex align-items-md-end flex-column">
                <p>Keep in touch</p>
                <ul class="social-icons">
                  <li class="social-icons-facebook">
                    <a
                      data-bs-toggle="tooltip"
                      href="http://www.facebook.com/"
                      target="_blank"
                      title="Facebook"
                    >
                      <i class="fab fa-facebook-f"></i>
                    </a>
                  </li>
                  <li class="social-icons-twitter">
                    <a
                      data-bs-toggle="tooltip"
                      href="http://www.twitter.com/"
                      target="_blank"
                      title="Twitter"
                    >
                      <i class="fab fa-twitter"></i>
                    </a>
                  </li>
                  <li class="social-icons-google">
                    <a
                      data-bs-toggle="tooltip"
                      href="http://www.google.com/"
                      target="_blank"
                      title="Google"
                    >
                      <i class="fab fa-google"></i>
                    </a>
                  </li>
                  <li class="social-icons-linkedin">
                    <a
                      data-bs-toggle="tooltip"
                      href="http://www.linkedin.com/"
                      target="_blank"
                      title="Linkedin"
                    >
                      <i class="fab fa-linkedin-in"></i>
                    </a>
                  </li>
                  <li class="social-icons-youtube">
                    <a
                      data-bs-toggle="tooltip"
                      href="http://www.youtube.com/"
                      target="_blank"
                      title="Youtube"
                    >
                      <i class="fab fa-youtube"></i>
                    </a>
                  </li>
                  <li class="social-icons-instagram">
                    <a
                      data-bs-toggle="tooltip"
                      href="http://www.instagram.com/"
                      target="_blank"
                      title="Instagram"
                    >
                      <i class="fab fa-instagram"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="container">
            <div class="footer-copyright">
              <ul class="nav justify-content-center">
                <li class="nav-item">
                  {" "}
                  <a class="nav-link active" href="#">
                    About Us
                  </a>{" "}
                </li>
                <li class="nav-item">
                  {" "}
                  <a class="nav-link" href="#">
                    Faq
                  </a>{" "}
                </li>
                <li class="nav-item">
                  {" "}
                  <a class="nav-link" href="#">
                    Contact
                  </a>{" "}
                </li>
                <li class="nav-item">
                  {" "}
                  <a class="nav-link" href="#">
                    Support
                  </a>{" "}
                </li>
                <li class="nav-item">
                  {" "}
                  <a class="nav-link" href="#">
                    Terms of Use
                  </a>{" "}
                </li>
                <li class="nav-item">
                  {" "}
                  <a class="nav-link" href="#">
                    Privacy Policy
                  </a>{" "}
                </li>
              </ul>
              <p class="copyright-text">
                Copyright © 2022 <a href="#">Quickai</a>. All Rights Reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>

      <a
        id="back-to-top"
        data-bs-toggle="tooltip"
        title="Back to Top"
        href="javascript:void(0)"
      >
        <i class="fa fa-chevron-up"></i>
      </a>

      <div
        id="login-signup"
        class="modal fade"
        role="dialog"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content p-sm-3">
            <div class="modal-body">
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                {" "}
                <span aria-hidden="true">&times;</span>{" "}
              </button>
              <ul class="nav nav-tabs" role="tablist">
                <li class="nav-item">
                  {" "}
                  <a
                    id="login-tab"
                    class="nav-link active text-4"
                    data-toggle="tab"
                    href="#login"
                    role="tab"
                    aria-controls="login"
                    aria-selected="true"
                  >
                    Login
                  </a>{" "}
                </li>
                <li class="nav-item">
                  {" "}
                  <a
                    id="signup-tab"
                    class="nav-link text-4"
                    data-toggle="tab"
                    href="#signup"
                    role="tab"
                    aria-controls="signup"
                    aria-selected="false"
                  >
                    Sign Up
                  </a>{" "}
                </li>
              </ul>
              <div class="tab-content pt-4">
                <div
                  class="tab-pane fade show active"
                  id="login"
                  role="tabpanel"
                  aria-labelledby="login-tab"
                >
                  <form id="loginForm" method="post">
                    <div class="form-group">
                      <input
                        type="email"
                        class="form-control"
                        id="loginMobile"
                        required
                        placeholder="Mobile or Email ID"
                      />
                    </div>
                    <div class="form-group">
                      <input
                        type="password"
                        class="form-control"
                        id="loginPassword"
                        required
                        placeholder="Password"
                      />
                    </div>
                    <div class="row mb-4">
                      <div class="col-sm">
                        <div class="form-check custom-control custom-checkbox">
                          <input
                            id="remember-me"
                            name="remember"
                            class="custom-control-input"
                            type="checkbox"
                          />
                          <label class="custom-control-label" for="remember-me">
                            Remember Me
                          </label>
                        </div>
                      </div>
                      <div class="col-sm text-right">
                        {" "}
                        <a class="justify-content-end" href="#">
                          Forgot Password ?
                        </a>{" "}
                      </div>
                    </div>
                    <button class="btn btn-primary btn-block" type="submit">
                      Login
                    </button>
                  </form>
                </div>
                <div
                  class="tab-pane fade"
                  id="signup"
                  role="tabpanel"
                  aria-labelledby="signup-tab"
                >
                  <form id="signupForm" method="post">
                    <div class="form-group">
                      <input
                        type="text"
                        class="form-control"
                        data-bv-field="number"
                        id="signupEmail"
                        required
                        placeholder="Email ID"
                      />
                    </div>
                    <div class="form-group">
                      <input
                        type="text"
                        class="form-control"
                        id="signupMobile"
                        required
                        placeholder="Mobile Number"
                      />
                    </div>
                    <div class="form-group">
                      <input
                        type="password"
                        class="form-control"
                        id="signuploginPassword"
                        required
                        placeholder="Password"
                      />
                    </div>
                    <button class="btn btn-primary btn-block" type="submit">
                      Signup
                    </button>
                  </form>
                </div>
                <div class="d-flex align-items-center my-4">
                  <hr class="flex-grow-1" />
                  <span class="mx-2">OR</span>
                  <hr class="flex-grow-1" />
                </div>
                <div class="row">
                  <div class="col-12 mb-3">
                    <button
                      type="button"
                      class="btn btn-block btn-outline-primary"
                    >
                      Login with Facebook
                    </button>
                  </div>
                  <div class="col-12">
                    <button
                      type="button"
                      class="btn btn-block btn-outline-danger"
                    >
                      Login with Google
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HotelDetails;
