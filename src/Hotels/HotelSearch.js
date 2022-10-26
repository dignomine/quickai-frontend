import React, { useEffect, useState, useRef } from "react";
import { useStateValue } from "../ContextApi/StateProvider";
import firebase from "firebase";
import Background from "../images/bg/image-2.jpg";
import Modal from "@material-ui/core/Modal";
import Header from "../Components/Header";
import {
  Button,
  createMuiTheme,
  Input,
  makeStyles,
  TextField,
  ThemeProvider,
  withStyles,
} from "@material-ui/core";
import "./HotelSearch.css";
import { Autocomplete } from "@material-ui/lab";
import $ from "jquery";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { ApiAuthentication } from "../utils/Authentication";
import { diff_hours } from "../utils/TimeDifference";
import { CreateDate } from "../utils/CreateDate";
// IMPORTING IMAGES
import agra from "../images/brands/hotels/agra.jpg";
import ahmedabad from "../images/brands/hotels/ahmedabad.jpg";
import bangalore from "../images/brands/hotels/bangalore.jpg";
import chennai from "../images/brands/hotels/chennai.jpg";
import hyderabad from "../images/brands/hotels/hyderabad.jpg";
import jaipur from "../images/brands/hotels/jaipur.jpg";
import kochi from "../images/brands/hotels/kochi.jpg";
import kolkata from "../images/brands/hotels/kolkata.jpg";
import mumbai from "../images/brands/hotels/mumbai.jpg";
import newdelhi from "../images/brands/hotels/newdelhi.jpg";
import cityData from "../utils/NewCityListHotel.json";
import paris from "../images/brands/hotels/paris.jpeg";

const CssTextField = withStyles({
  root: {
    "& .MuiFormLabel-root": {
      color: "#CCCCCC",
      fontWeight: 300,
    },
    "& label.Mui-focused": {
      color: "#889099",
      color: "#fff",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#889099",
      },
      "&:hover fieldset": {
        borderColor: "#889099",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#889099",
      },
    },

    "& .MuiInput-underline:after": {
      borderBottomColor: "#889099",
    },
    "& .MuiInput-underline:before": {
      borderWidth: 2,
      borderBottomColor: "#889099",
      padding: 50,
      fontSize: 30,
    },

    "& .MuiInput-underline:hover": {
      borderBottomColor: "#889099",
    },
    "& .MuiInput-focused": {
      color: "#889099",
      color: "#fff",
    },
    "& .MuiInput-input": {
      color: "#fff",
    },
  },
  textField: {
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(1),
    width: 200,
  },
})(TextField);

const muitheme = createMuiTheme({
  overrides: {
    MuiInput: {
      root: {
        fontSize: 16,
        padding: "10px 12px",
        color: "white",
      },
    },
  },
});

const HotelSearch = () => {
  const classes = makeStyles();
  const [destination, setDestination] = useState([]);
  const [destinationData, setDestinationData] = useState([]);
  const [checkoutDate, setCheckoutDate] = useState();
  const [checkinDate, setCheckinDate] = useState();
  const [rooms, setRooms] = useState(0);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [childrenAge, setChildrenAge] = useState("");

  const [{ hotelDetails }, dispatch] = useStateValue();

  const [userId, setUserId] = useState();
  const history = useHistory();
  const [TokenId, setTokenId] = useState("");
  const parentRef = useRef(null);
  const elementRef = useRef([]);

  useEffect(() => {
    let id = uuidv4();
    setUserId(id);
  }, []);

  const handleCity = (e) => {
    e.preventDefault();
    console.log(e.target.dataset.city);

    const filterData = cityData.filter(
      (city) =>
        city.CityName === e.target.dataset.city &&
        city.CountryName === e.target.dataset.country
    );
    console.log(filterData);

    const dateObject = CreateDate();
    const Today = dateObject.today.reduce((acc, date) => acc + date.value, "");
    const Tomorrow = dateObject.tomorrow.reduce(
      (acc, date) => acc + date.value,
      ""
    );
    dispatch({
      type: "CLEAR_HOTEL_LIST",
    });

    const item = {
      ...filterData[0],
      CheckInDate: Today,
      CheckOutDate: Tomorrow,
      CityId: filterData[0].DestinationId,
      PreferredCurrency: "INR",
      NoOfNights: 1,
      ResultCount: null,
      GuestNationality: "IN",
      NoOfRooms: 1,
      RoomGuests: [
        {
          NoOfAdults: 1,
          NoOfChild: 0,
          ChildAge: null,
        },
      ],
      MaxRating: 5,
      MinRating: 0,
      ReviewScore: null,
      IsNearBySearchAllowed: false,
      EndUserIp: "192.168.10.26",
      TokenId: TokenId,
    };
    dispatch({
      type: "ADD_TO_HOTEL",
      item: item,
    });
    console.log(item);
    localStorage.removeItem("hotel-search-options");
    localStorage.setItem("hotel-search-options", JSON.stringify(item));
    history.push("/hotelslist");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(destination);

    if (children > 0 && childrenAge === "") {
      return alert("Please enter children age in the children age input");
    }

    const childrenAgeArray = childrenAge.split(" ").map((age) => +age);

    const date1 = new Date(checkinDate.split("/").reverse().join("/"));
    const date2 = new Date(checkoutDate);
    if (date1 > date2)
      return alert(
        `Please enter a checkout date after the given check-in date ${checkinDate}`
      );

    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    dispatch({
      type: "CLEAR_HOTEL_LIST",
    });

    const item = {
      ...destination[0],
      CheckInDate: checkinDate,
      CheckOutDate: checkoutDate.split("/").reverse().join("/"),
      CityId: destination[0].DestinationId,
      PreferredCurrency: "INR",
      NoOfNights: diffDays,
      ResultCount: null,
      GuestNationality: "IN",
      NoOfRooms: rooms,
      RoomGuests: [
        {
          NoOfAdults: adults,
          NoOfChild: children,
          ChildAge: children === 0 ? [] : childrenAgeArray,
        },
      ],
      MaxRating: 5,
      MinRating: 0,
      ReviewScore: null,
      IsNearBySearchAllowed: false,
      EndUserIp: "192.168.10.26",
      TokenId: TokenId,
    };

    console.log(item);

    dispatch({
      type: "ADD_TO_HOTEL",
      item: item,
    });

    localStorage.removeItem("hotel-search-options");
    localStorage.setItem("hotel-search-options", JSON.stringify(item));
    history.push("/hotelslist");
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

  const onFocus = (e) => {
    e.currentTarget.type = "date";
  };

  const onBlur = (e) => {
    e.currentTarget.type = "text";
    e.currentTarget.placeholder = "Enter a Date";
  };

  const getCountryList = (Token) => {
    // TokenId: "e80c5cea-b634-422b-82fa-434ebb13ac87",
    // get country list
    // get citites and states in india
    axios
      .post(
        "/SharedServices/StaticData.svc/rest/GetDestinationSearchStaticData",
        {
          ClientId: "ApiIntegrationNew",
          EndUserIp: "192.168.10.26",
          TokenId: Token,
          CountryCode: "IN",
          SearchType: "1",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((data) => {
        console.log(data.data);
        setDestinationData(data.data.Destinations);
      })
      .catch((err) => console.error(err));
  };

  const Authentication = () => {
    fetch("/SharedServices/SharedData.svc/rest/Authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        UserName: "Vogues",
        Password: "Voguesapi@123",
        EndUserIp: "192.168.11.120",
        ClientId: "ApiIntegrationNew",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("TokenId", data.TokenId);
        setTokenId(data.TokenId);

        setDestinationData(cityData);
      })
      .catch((err) => console.error(err));
  };

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

  const checkAuthentication = async () => {
    const Token = localStorage.getItem("AuthenticationToken");
    if (Token === null || Token === undefined) {
      const data = await ApiAuthentication();
      setTokenId(data.TokenId);
      setDestinationData(cityData);
    } else {
      const TokenObj = JSON.parse(Token);

      const difference = diff_hours(new Date(TokenObj.endDate), new Date());

      console.log(difference);

      if (difference === -1) {
        console.log("In if");
        const data = await ApiAuthentication();
        setTokenId(data.TokenId);
        setDestinationData(cityData);
      } else {
        console.log("in Else");
        setTokenId(TokenObj.TokenId);
        setDestinationData(cityData);
      }
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <>
      <div id="main-wrapper">
        <Header />
        <div id="content">
          <div class="hero-wrap">
            <div
              class="hero-mask opacity-7 bg-primary"
              style={{ backgroundColor: "#df293a !important" }}
            ></div>
            <div
              class="hero-bg"
              style={{
                background: `url(${Background})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            ></div>
            <div class="hero-content d-flex fullscreen-with-header">
              <div class="container my-auto py-5">
                <div class="row g-5">
                  <div class="col-lg-6">
                    <div class="position-relative px-4 pt-3 pb-4">
                      <div class="hero-mask opacity-8 bg-dark rounded"></div>
                      <div class="hero-content">
                        <ul
                          class="nav nav-tabs nav-fill style-4 border-bottom"
                          id="myTab"
                          role="tablist"
                        >
                          {/* <li class="nav-item">
                            <a
                              class="nav-link active"
                              id="flight-tab"
                              data-bs-toggle="tab"
                              href="#flight"
                              role="tab"
                              aria-controls="flight"
                              aria-selected="true"
                            >
                              Flights
                            </a>
                          </li> */}
                          <li class="nav-item">
                            <a
                              class="nav-link"
                              id="hotels-tab"
                              data-bs-toggle="tab"
                              href="#hotels"
                              role="tab"
                              aria-controls="hotels"
                              aria-selected="true"
                            >
                              Hotels
                            </a>
                          </li>
                          {/* <li class="nav-item">
                            <a
                              class="nav-link"
                              id="trains-tab"
                              data-bs-toggle="tab"
                              href="#trains"
                              role="tab"
                              aria-controls="trains"
                              aria-selected="false"
                            >
                              Trains
                            </a>
                          </li> */}
                          {/* <li class="nav-item">
                            <a
                              class="nav-link"
                              id="bus-tab"
                              data-bs-toggle="tab"
                              href="#bus"
                              role="tab"
                              aria-controls="bus"
                              aria-selected="false"
                            >
                              Bus
                            </a>
                          </li> */}
                          {/* <li class="nav-item">
                            <a
                              class="nav-link"
                              id="car-tab"
                              data-bs-toggle="tab"
                              href="#car"
                              role="tab"
                              aria-controls="car"
                              aria-selected="false"
                            >
                              Cars
                            </a>
                          </li> */}
                        </ul>
                        <div class="tab-content pt-4" id="myTabContent">
                          <div
                            class="tab-pane fade "
                            id="flight"
                            role="tabpanel"
                            aria-labelledby="flight-tab"
                          >
                            <form
                              id="bookingFlight"
                              class="search-input-line"
                              method="post"
                            >
                              <div class="text-light mb-2">
                                <div class="form-check form-check-inline">
                                  <input
                                    id="oneway"
                                    name="flight-trip"
                                    class="form-check-input"
                                    checked=""
                                    required=""
                                    type="radio"
                                  />
                                  <label class="form-check-label" for="oneway">
                                    One Way
                                  </label>
                                </div>
                                <div class="form-check form-check-inline">
                                  <input
                                    id="roundtrip"
                                    name="flight-trip"
                                    class="form-check-input"
                                    required=""
                                    type="radio"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="roundtrip"
                                  >
                                    Round Trip
                                  </label>
                                </div>
                              </div>
                              <div class="row gy-3 gx-4">
                                <div class="col-lg-6 position-relative">
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="flightFrom"
                                    required=""
                                    placeholder="From"
                                  />
                                  <span class="icon-inside">
                                    <i class="fas fa-map-marker-alt"></i>
                                  </span>
                                </div>
                                <div class="col-lg-6 position-relative">
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="flightTo"
                                    required=""
                                    placeholder="To"
                                  />
                                  <span class="icon-inside">
                                    <i class="fas fa-map-marker-alt"></i>
                                  </span>
                                </div>
                                <div class="col-lg-6 position-relative">
                                  <input
                                    id="flightDepart"
                                    type="text"
                                    class="form-control"
                                    required=""
                                    placeholder="Depart Date"
                                  />
                                  <span class="icon-inside">
                                    <i class="far fa-calendar-alt"></i>
                                  </span>
                                </div>
                                <div class="col-lg-6 position-relative">
                                  <input
                                    id="flightReturn"
                                    type="text"
                                    class="form-control"
                                    required=""
                                    placeholder="Return Date"
                                  />
                                  <span class="icon-inside">
                                    <i class="far fa-calendar-alt"></i>
                                  </span>
                                </div>
                                <div class="col-12">
                                  <div class="travellers-class">
                                    <input
                                      type="text"
                                      id="flightTravellersClass"
                                      class="travellers-class-input form-control"
                                      name="flight-travellers-class"
                                      placeholder="Travellers, Class"
                                      readonly=""
                                      required=""
                                      onkeypress="return false;"
                                    />
                                    <a href=""></a>
                                    <span class="icon-inside">
                                      <i class="fas fa-caret-down"></i>
                                    </span>

                                    <div class="travellers-dropdown">
                                      <div class="row align-items-center">
                                        <div class="col-sm-7 col-lg-8">
                                          <p class="mb-sm-0">
                                            Adults
                                            <small class="text-muted">
                                              (12+ yrs)
                                            </small>
                                          </p>
                                        </div>
                                        <div class="col-sm-5 col-lg-4">
                                          <div class="qty input-group">
                                            <div class="input-group-prepend">
                                              <button
                                                type="button"
                                                class="btn bg-light-4"
                                                data-value="decrease"
                                                data-target="#flightAdult-travellers"
                                                data-toggle="spinner"
                                              >
                                                -
                                              </button>
                                            </div>
                                            <input
                                              type="text"
                                              data-ride="spinner"
                                              id="flightAdult-travellers"
                                              class="qty-spinner form-control"
                                              value="1"
                                              readonly=""
                                            />
                                            <div class="input-group-append">
                                              <button
                                                type="button"
                                                class="btn bg-light-4"
                                                data-value="increase"
                                                data-target="#flightAdult-travellers"
                                                data-toggle="spinner"
                                              >
                                                +
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <hr class="my-2" />
                                      <div class="row align-items-center">
                                        <div class="col-sm-7 col-lg-8">
                                          <p class="mb-sm-0">
                                            Children
                                            <small class="text-muted">
                                              (2-12 yrs)
                                            </small>
                                          </p>
                                        </div>
                                        <div class="col-sm-5 col-lg-4">
                                          <div class="qty input-group">
                                            <div class="input-group-prepend">
                                              <button
                                                type="button"
                                                class="btn bg-light-4"
                                                data-value="decrease"
                                                data-target="#flightChildren-travellers"
                                                data-toggle="spinner"
                                              >
                                                -
                                              </button>
                                            </div>
                                            <input
                                              type="text"
                                              data-ride="spinner"
                                              id="flightChildren-travellers"
                                              class="qty-spinner form-control"
                                              value="0"
                                              readonly=""
                                            />
                                            <div class="input-group-append">
                                              <button
                                                type="button"
                                                class="btn bg-light-4"
                                                data-value="increase"
                                                data-target="#flightChildren-travellers"
                                                data-toggle="spinner"
                                              >
                                                +
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <hr class="my-2" />
                                      <div class="row align-items-center">
                                        <div class="col-sm-7 col-lg-8">
                                          <p class="mb-sm-0">
                                            Infants
                                            <small class="text-muted">
                                              (Below 2 yrs)
                                            </small>
                                          </p>
                                        </div>
                                        <div class="col-sm-5 col-lg-4">
                                          <div class="qty input-group">
                                            <div class="input-group-prepend">
                                              <button
                                                type="button"
                                                class="btn bg-light-4"
                                                data-value="decrease"
                                                data-target="#flightInfants-travellers"
                                                data-toggle="spinner"
                                              >
                                                -
                                              </button>
                                            </div>
                                            <input
                                              type="text"
                                              data-ride="spinner"
                                              id="flightInfants-travellers"
                                              class="qty-spinner form-control"
                                              value="0"
                                              readonly=""
                                            />
                                            <div class="input-group-append">
                                              <button
                                                type="button"
                                                class="btn bg-light-4"
                                                data-value="increase"
                                                data-target="#flightInfants-travellers"
                                                data-toggle="spinner"
                                              >
                                                +
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <hr class="mt-2" />
                                      <div class="mb-3">
                                        <div class="form-check">
                                          <input
                                            id="flightClassEconomic"
                                            name="flight-class"
                                            class="flight-class form-check-input"
                                            value="0"
                                            checked=""
                                            required=""
                                            type="radio"
                                          />
                                          <label
                                            class="form-check-label"
                                            for="flightClassEconomic"
                                          >
                                            Economic
                                          </label>
                                        </div>
                                        <div class="form-check">
                                          <input
                                            id="flightClassPremiumEconomic"
                                            name="flight-class"
                                            class="flight-class form-check-input"
                                            value="1"
                                            required=""
                                            type="radio"
                                          />
                                          <label
                                            class="form-check-label"
                                            for="flightClassPremiumEconomic"
                                          >
                                            Premium Economic
                                          </label>
                                        </div>
                                        <div class="form-check">
                                          <input
                                            id="flightClassBusiness"
                                            name="flight-class"
                                            class="flight-class form-check-input"
                                            value="2"
                                            required=""
                                            type="radio"
                                          />
                                          <label
                                            class="form-check-label"
                                            for="flightClassBusiness"
                                          >
                                            Business
                                          </label>
                                        </div>
                                        <div class="form-check">
                                          <input
                                            id="flightClassFirstClass"
                                            name="flight-class"
                                            class="flight-class form-check-input"
                                            value="3"
                                            required=""
                                            type="radio"
                                          />
                                          <label
                                            class="form-check-label"
                                            for="flightClassFirstClass"
                                          >
                                            First Class
                                          </label>
                                        </div>
                                      </div>
                                      <div class="d-grid">
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
                                <div class="col-12 d-grid mt-4">
                                  <button class="btn btn-primary" type="submit">
                                    Search Flights
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                          <div
                            class="tab-pane fade show active"
                            id="hotels"
                            role="tabpanel"
                            aria-labelledby="hotels-tab"
                          >
                            <form
                              id="bookingHotels"
                              class="search-input-line"
                              // method="post"
                              // onSubmit={(e) => handleSubmit(e)}
                            >
                              <div class="row gy-3 gx-4">
                                <div class="col-12 position-relative">
                                  <Autocomplete
                                    loading={true}
                                    freeSolo
                                    id="combo-box-demo"
                                    options={destinationData}
                                    getOptionLabel={(option) =>
                                      `${option.CityName}, ${option.CountryName}`
                                    }
                                    onChange={(event, value) => {
                                      console.log(event.target.value, value);
                                      setDestination([value]);
                                    }}
                                    renderInput={(params) => (
                                      <>
                                        <CssTextField
                                          className={[classes.root]}
                                          value={destination}
                                          {...params}
                                          label="From"
                                          variant="standard"
                                          style={{ color: "#fff" }}
                                        />
                                      </>
                                    )}
                                  />
                                  <span class="icon-inside">
                                    <i class="fas fa-map-marker-alt"></i>
                                  </span>
                                </div>
                                <div class="col-lg-6 position-relative">
                                  <input
                                    id="hotelsCheckIn"
                                    type="date"
                                    class="form-control"
                                    required
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

                                  {/* <span class="icon-inside">
                                    <i class="far fa-calendar-alt"></i>
                                  </span> */}
                                </div>
                                <div class="col-lg-6 position-relative">
                                  <input
                                    id="hotelsCheckOut"
                                    type="date"
                                    class="form-control"
                                    required
                                    placeholder="Check Out"
                                    onChange={(e) => {
                                      const date = e.target.value;
                                      console.log(date);

                                      const newDate = date.split("-").join("/");
                                      setCheckoutDate(newDate);
                                    }}
                                  />
                                  {/* <span class="icon-inside">
                                    <i class="far fa-calendar-alt"></i>
                                  </span> */}
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
                                        <div class="col-sm-7 col-lg-8">
                                          <p class="mb-sm-0">Rooms</p>
                                        </div>
                                        <div class="col-sm-5 col-lg-4">
                                          <div class="qty input-group">
                                            <div class="input-group-prepend">
                                              <button
                                                type="button"
                                                class="btn bg-light-4"
                                                // data-value="decrease"
                                                // data-target="#hotels-rooms"
                                                data-toggle="spinner"
                                                onClick={(e) =>
                                                  decrease("Rooms")
                                                }
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
                                                onClick={() =>
                                                  increase("Rooms")
                                                }
                                              >
                                                +
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <hr class="mt-2 mb-4" />
                                      <div class="row align-items-center">
                                        <div class="col-sm-7 col-lg-8">
                                          <p class="mb-sm-0">
                                            Adults
                                            <small class="text-muted">
                                              (12+ yrs)
                                            </small>
                                          </p>
                                        </div>
                                        <div class="col-sm-5 col-lg-4">
                                          <div class="qty input-group">
                                            <div class="input-group-prepend">
                                              <button
                                                type="button"
                                                class="btn bg-light-4"
                                                // data-value="decrease"
                                                // data-target="#adult-travellers"
                                                data-toggle="spinner"
                                                onClick={() =>
                                                  decrease("Adults")
                                                }
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
                                                onClick={() =>
                                                  increase("Adults")
                                                }
                                              >
                                                +
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <hr class="my-2" />
                                      <div class="row align-items-center">
                                        <div class="col-sm-7 col-lg-8">
                                          <p class="mb-sm-0">
                                            Children
                                            <small class="text-muted">
                                              (1-12 yrs)
                                            </small>
                                          </p>
                                        </div>
                                        <div class="col-sm-5 col-lg-4">
                                          <div class="qty input-group">
                                            <div class="input-group-prepend">
                                              <button
                                                type="button"
                                                class="btn bg-light-4"
                                                // data-value="decrease"
                                                // data-target="#children-travellers"
                                                data-toggle="spinner"
                                                onClick={() =>
                                                  decrease("Children")
                                                }
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
                                                onClick={() =>
                                                  increase("Children")
                                                }
                                              >
                                                +
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {children > 0 && (
                                        <>
                                          <hr class="my-2" />
                                          <div class="row align-items-center">
                                            <div class="col-sm-5 col-lg-5">
                                              <p
                                                class="mb-sm-0"
                                                style={{
                                                  display: "flex",
                                                  flexDirection: "column",
                                                }}
                                              >
                                                Children Age
                                                <small class="text-muted">
                                                  (Enter Space separated ages)
                                                </small>
                                              </p>
                                            </div>
                                            <div class="col-sm-7 col-lg-7">
                                              <TextField
                                                style={{ width: "100%" }}
                                                id="outlined-full-width"
                                                label="Children Age"
                                                onChange={(e) =>
                                                  setChildrenAge(e.target.value)
                                                }
                                                value={childrenAge}
                                              />
                                            </div>
                                          </div>
                                        </>
                                      )}
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
                                <div class="col-12 d-grid mt-4">
                                  <button
                                    class="btn btn-primary"
                                    onClick={handleSubmit}
                                    // onClick={handleCity}
                                  >
                                    Search Hotels
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                          <div
                            class="tab-pane fade"
                            id="trains"
                            role="tabpanel"
                            aria-labelledby="trains-tab"
                          >
                            <form
                              id="bookingTrain"
                              class="search-input-line"
                              method="post"
                            >
                              <div class="row g-3">
                                <div class="col-12 position-relative">
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="trainFrom"
                                    required=""
                                    placeholder="From"
                                  />
                                  <span class="icon-inside">
                                    <i class="fas fa-map-marker-alt"></i>
                                  </span>
                                </div>
                                <div class="col-12 position-relative">
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="trainTo"
                                    required=""
                                    placeholder="To"
                                  />
                                  <span class="icon-inside">
                                    <i class="fas fa-map-marker-alt"></i>
                                  </span>
                                </div>
                                <div class="col-12 position-relative">
                                  <input
                                    id="trainDepart"
                                    type="text"
                                    class="form-control"
                                    required=""
                                    placeholder="Depart Date"
                                  />
                                  <span class="icon-inside">
                                    <i class="far fa-calendar-alt"></i>
                                  </span>
                                </div>
                                <div class="col-12">
                                  <div class="travellers-class">
                                    <input
                                      type="text"
                                      id="trainTravellersClass"
                                      class="travellers-class-input form-control"
                                      name="train-travellers-class"
                                      placeholder="Travellers, Class"
                                      required=""
                                      onkeypress="return false;"
                                    />
                                    <span class="icon-inside">
                                      <i class="fas fa-caret-down"></i>
                                    </span>

                                    <div class="travellers-dropdown">
                                      <div class="row align-items-center">
                                        <div class="col-sm-7 col-lg-8">
                                          <p class="mb-sm-0">
                                            Adults
                                            <small class="text-muted">
                                              (12+ yrs)
                                            </small>
                                          </p>
                                        </div>
                                        <div class="col-sm-5 col-lg-4">
                                          <div class="qty input-group">
                                            <div class="input-group-prepend">
                                              <button
                                                type="button"
                                                class="btn bg-light-4"
                                                data-value="decrease"
                                                data-target="#trainAdult-travellers"
                                                data-toggle="spinner"
                                              >
                                                -
                                              </button>
                                            </div>
                                            <input
                                              type="text"
                                              data-ride="spinner"
                                              id="trainAdult-travellers"
                                              class="qty-spinner form-control"
                                              value="1"
                                              readonly=""
                                            />
                                            <div class="input-group-append">
                                              <button
                                                type="button"
                                                class="btn bg-light-4"
                                                data-value="increase"
                                                data-target="#trainAdult-travellers"
                                                data-toggle="spinner"
                                              >
                                                +
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <hr class="my-2" />
                                      <div class="row align-items-center">
                                        <div class="col-sm-7 col-lg-8">
                                          <p class="mb-sm-0">
                                            Children
                                            <small class="text-muted">
                                              (2-12 yrs)
                                            </small>
                                          </p>
                                        </div>
                                        <div class="col-sm-5 col-lg-4">
                                          <div class="qty input-group">
                                            <div class="input-group-prepend">
                                              <button
                                                type="button"
                                                class="btn bg-light-4"
                                                data-value="decrease"
                                                data-target="#trainChildren-travellers"
                                                data-toggle="spinner"
                                              >
                                                -
                                              </button>
                                            </div>
                                            <input
                                              type="text"
                                              data-ride="spinner"
                                              id="trainChildren-travellers"
                                              class="qty-spinner form-control"
                                              value="0"
                                              readonly=""
                                            />
                                            <div class="input-group-append">
                                              <button
                                                type="button"
                                                class="btn bg-light-4"
                                                data-value="increase"
                                                data-target="#trainChildren-travellers"
                                                data-toggle="spinner"
                                              >
                                                +
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <hr class="my-2" />
                                      <div class="row align-items-center">
                                        <div class="col-sm-7 col-lg-8">
                                          <p class="mb-sm-0">
                                            Infants
                                            <small class="text-muted">
                                              (Below 2 yrs)
                                            </small>
                                          </p>
                                        </div>
                                        <div class="col-sm-5 col-lg-4">
                                          <div class="qty input-group">
                                            <div class="input-group-prepend">
                                              <button
                                                type="button"
                                                class="btn bg-light-4"
                                                data-value="decrease"
                                                data-target="#trainInfants-travellers"
                                                data-toggle="spinner"
                                              >
                                                -
                                              </button>
                                            </div>
                                            <input
                                              type="text"
                                              data-ride="spinner"
                                              id="trainInfants-travellers"
                                              class="qty-spinner form-control"
                                              value="0"
                                              readonly=""
                                            />
                                            <div class="input-group-append">
                                              <button
                                                type="button"
                                                class="btn bg-light-4"
                                                data-value="increase"
                                                data-target="#trainInfants-travellers"
                                                data-toggle="spinner"
                                              >
                                                +
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="my-3">
                                        <select
                                          id="train-class"
                                          name="train-class"
                                          class="form-select border rounded"
                                        >
                                          <option value="0">All Class</option>
                                          <option value="1">First Class</option>
                                          <option value="2">
                                            Second Class
                                          </option>
                                          <option value="3">
                                            First Class Sleeper (SL)
                                          </option>
                                          <option value="4">
                                            Second Class Sleeper (SL)
                                          </option>
                                          <option value="5">Business</option>
                                        </select>
                                      </div>
                                      <div class="d-grid">
                                        <button
                                          class="btn btn-primary rounded submit-done"
                                          type="button"
                                        >
                                          Done
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="col-12 d-grid mt-4">
                                  <button class="btn btn-primary" type="submit">
                                    Search Trains
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                          <div
                            class="tab-pane fade"
                            id="bus"
                            role="tabpanel"
                            aria-labelledby="bus-tab"
                          >
                            <form
                              id="bookingBus"
                              class="search-input-line"
                              method="post"
                            >
                              <div class="row g-3">
                                <div class="col-12 position-relative">
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="busFrom"
                                    required=""
                                    placeholder="From"
                                  />
                                  <span class="icon-inside">
                                    <i class="fas fa-map-marker-alt"></i>
                                  </span>
                                </div>
                                <div class="col-12 position-relative">
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="busTo"
                                    required=""
                                    placeholder="To"
                                  />
                                  <span class="icon-inside">
                                    <i class="fas fa-map-marker-alt"></i>
                                  </span>
                                </div>
                                <div class="col-12 position-relative">
                                  <input
                                    id="busDepart"
                                    type="text"
                                    class="form-control"
                                    required=""
                                    placeholder="Depart Date"
                                  />
                                  <span class="icon-inside">
                                    <i class="far fa-calendar-alt"></i>
                                  </span>
                                </div>
                                <div class="col-12">
                                  <div class="travellers-class">
                                    <input
                                      type="text"
                                      id="busTravellersClass"
                                      class="travellers-class-input form-control"
                                      name="bus-travellers-class"
                                      placeholder="Seats"
                                      required=""
                                      onkeypress="return false;"
                                    />
                                    <span class="icon-inside">
                                      <i class="fas fa-caret-down"></i>
                                    </span>

                                    <div class="travellers-dropdown">
                                      <div class="row align-items-center mb-3">
                                        <div class="col-sm-7 col-lg-8">
                                          <p class="mb-sm-0">Seats</p>
                                        </div>
                                        <div class="col-sm-5 col-lg-4">
                                          <div class="qty input-group">
                                            <div class="input-group-prepend">
                                              <button
                                                type="button"
                                                class="btn bg-light-4"
                                                data-value="decrease"
                                                data-target="#adult-travellers"
                                                data-toggle="spinner"
                                              >
                                                -
                                              </button>
                                            </div>
                                            <input
                                              type="text"
                                              data-ride="spinner"
                                              id="adult-travellers"
                                              class="qty-spinner form-control"
                                              value="1"
                                              readonly=""
                                            />
                                            <div class="input-group-append">
                                              <button
                                                type="button"
                                                class="btn bg-light-4"
                                                data-value="increase"
                                                data-target="#adult-travellers"
                                                data-toggle="spinner"
                                              >
                                                +
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="d-grid">
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
                                <div class="col-12 d-grid mt-4">
                                  <button class="btn btn-primary" type="submit">
                                    Search Bus
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                          <div
                            class="tab-pane fade"
                            id="car"
                            role="tabpanel"
                            aria-labelledby="car-tab"
                          >
                            <form
                              id="bookingCars"
                              class="search-input-line"
                              method="post"
                            >
                              <div class="row gx-4 gy-3">
                                <div class="col-12 position-relative">
                                  <input
                                    type="text"
                                    class="form-control ui-autocomplete-input"
                                    id="carsCity"
                                    required=""
                                    placeholder="Enter City"
                                    autocomplete="off"
                                  />
                                  <span class="icon-inside">
                                    <i class="fas fa-map-marker-alt"></i>
                                  </span>
                                </div>
                                <div class="col-8 position-relative">
                                  <input
                                    id="carsPickup"
                                    type="text"
                                    class="form-control"
                                    required=""
                                    placeholder="Pick-up date"
                                  />
                                  <span class="icon-inside">
                                    <i class="far fa-calendar-alt"></i>
                                  </span>
                                </div>
                                <div class="col-4 position-relative">
                                  <select
                                    class="form-select"
                                    id="carsPickuptime"
                                    required=""
                                  >
                                    <option value="">12:00 am</option>
                                    <option>12:30 am</option>
                                    <option>01:00 am</option>
                                    <option>01:30 am</option>
                                    <option>02:00 am</option>
                                    <option>02:30 am</option>
                                    <option>03:00 am</option>
                                    <option>03:30 am</option>
                                    <option>04:00 am</option>
                                    <option>04:30 am</option>
                                    <option>05:00 am</option>
                                    <option>05:30 am</option>
                                    <option>06:00 am</option>
                                    <option>06:30 am</option>
                                    <option>07:00 am</option>
                                    <option>07:30 am</option>
                                    <option>08:00 am</option>
                                    <option>08:30 am</option>
                                    <option>09:00 am</option>
                                    <option>09:30 am</option>
                                    <option>10:00 am</option>
                                    <option>10:30 am</option>
                                    <option>11:00 am</option>
                                    <option>11:30 am</option>
                                    <option>12:00 pm</option>
                                    <option>12:30 pm</option>
                                    <option>01:00 pm</option>
                                    <option>01:30 pm</option>
                                    <option>02:00 pm</option>
                                    <option>02:30 pm</option>
                                    <option>03:00 pm</option>
                                    <option>03:30 pm</option>
                                    <option>04:00 pm</option>
                                    <option>04:30 pm</option>
                                    <option>05:00 pm</option>
                                    <option>05:30 pm</option>
                                    <option>06:00 pm</option>
                                    <option>06:30 pm</option>
                                    <option>07:00 pm</option>
                                    <option>07:30 pm</option>
                                    <option>08:00 pm</option>
                                    <option>08:30 pm</option>
                                    <option>09:00 pm</option>
                                    <option>09:30 pm</option>
                                    <option>10:00 pm</option>
                                    <option>10:30 pm</option>
                                    <option>11:00 pm</option>
                                    <option>11:30 pm</option>
                                  </select>
                                </div>
                                <div class="col-8 position-relative">
                                  <input
                                    id="carsDropoff"
                                    type="text"
                                    class="form-control"
                                    required=""
                                    placeholder="Drop-off date"
                                  />
                                  <span class="icon-inside">
                                    <i class="far fa-calendar-alt"></i>
                                  </span>
                                </div>
                                <div class="col-4 position-relative">
                                  <select
                                    class="form-select"
                                    id="carsDropofftime"
                                    required=""
                                  >
                                    <option value="">12:00 am</option>
                                    <option>12:30 am</option>
                                    <option>01:00 am</option>
                                    <option>01:30 am</option>
                                    <option>02:00 am</option>
                                    <option>02:30 am</option>
                                    <option>03:00 am</option>
                                    <option>03:30 am</option>
                                    <option>04:00 am</option>
                                    <option>04:30 am</option>
                                    <option>05:00 am</option>
                                    <option>05:30 am</option>
                                    <option>06:00 am</option>
                                    <option>06:30 am</option>
                                    <option>07:00 am</option>
                                    <option>07:30 am</option>
                                    <option>08:00 am</option>
                                    <option>08:30 am</option>
                                    <option>09:00 am</option>
                                    <option>09:30 am</option>
                                    <option>10:00 am</option>
                                    <option>10:30 am</option>
                                    <option>11:00 am</option>
                                    <option>11:30 am</option>
                                    <option>12:00 pm</option>
                                    <option>12:30 pm</option>
                                    <option>01:00 pm</option>
                                    <option>01:30 pm</option>
                                    <option>02:00 pm</option>
                                    <option>02:30 pm</option>
                                    <option>03:00 pm</option>
                                    <option>03:30 pm</option>
                                    <option>04:00 pm</option>
                                    <option>04:30 pm</option>
                                    <option>05:00 pm</option>
                                    <option>05:30 pm</option>
                                    <option>06:00 pm</option>
                                    <option>06:30 pm</option>
                                    <option>07:00 pm</option>
                                    <option>07:30 pm</option>
                                    <option>08:00 pm</option>
                                    <option>08:30 pm</option>
                                    <option>09:00 pm</option>
                                    <option>09:30 pm</option>
                                    <option>10:00 pm</option>
                                    <option>10:30 pm</option>
                                    <option>11:00 pm</option>
                                    <option>11:30 pm</option>
                                  </select>
                                </div>
                              </div>
                              <div class="form-check text-white-50 my-4">
                                <input
                                  type="checkbox"
                                  id="terms"
                                  name="termsConditions"
                                  checked=""
                                  class="form-check-input"
                                />
                                <label
                                  class="form-check-label d-block"
                                  for="terms"
                                >
                                  Driver aged 25 - 70
                                  <span
                                    class="text-info"
                                    data-bs-toggle="tooltip"
                                    title="Car rental suppliers may charge more if a driver is under 30 or over 60. Please check the car's terms &amp; conditions."
                                  >
                                    <i class="far fa-question-circle"></i>
                                  </span>
                                </label>
                              </div>
                              <div class="d-grid">
                                <button class="btn btn-primary" type="submit">
                                  Search Cars
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <h2 class="text-9 fw-600 text-white">
                      Why Booking with Quickai ?
                    </h2>
                    <p class="lead mb-4 text-white">
                      Online Booking. Save Time and Money!
                    </p>
                    <div class="row g-4">
                      <div class="col-12">
                        <div class="featured-box style-3">
                          <div class="featured-box-icon border border-light rounded-circle text-white">
                            <i class="fas fa-dollar-sign"></i>
                          </div>
                          <h3 class="text-white">Cheapest Price</h3>
                          <p class="text-white mb-0">
                            Always get cheapest price with the best in the
                            industry. So you get the best deal every time.
                          </p>
                        </div>
                      </div>
                      <div class="col-12">
                        <div class="featured-box style-3">
                          <div class="featured-box-icon border border-light rounded-circle text-white">
                            <i class="fas fa-times"></i>
                          </div>
                          <h3 class="text-white">
                            Easy Cancellation & Refunds
                          </h3>
                          <p class="text-white mb-0">
                            Get instant refund and get any booking fees waived
                            off! Easy cancellation process is available.
                          </p>
                        </div>
                      </div>
                      <div class="col-12">
                        <div class="featured-box style-3">
                          <div class="featured-box-icon border border-light rounded-circle text-white">
                            <i class="fas fa-percentage"></i>
                          </div>
                          <h3 class="text-white">No Booking Charges</h3>
                          <p class="text-white mb-0">
                            No hidden charges, no payment fees, and free
                            customer service. So you get the best deal every
                            time!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="section bg-white shadow-md">
            <div class="container">
              {/* <div
                class="owl-carousel owl-theme banner"
                data-autoplay="true"
                data-loop="true"
                data-nav="true"
                data-margin="30"
                data-items-xs="1"
                data-items-sm="2"
                data-items-md="2"
                data-items-lg="3"
              >
                <div class="item rounded">
                  <a href="#">
                    <div class="caption">
                      <h2>20% OFF</h2>
                      <p>On Flight Booking</p>
                    </div>
                    <div class="banner-mask"></div>
                    <img
                      class="img-fluid"
                      src="images/slider/booking-banner-4.jpg"
                      alt="banner"
                    />
                  </a>
                </div>
                <div class="item rounded">
                  <a href="#">
                    <div class="caption">
                      <h2>10% OFF</h2>
                      <p>On Train Booking</p>
                    </div>
                    <div class="banner-mask"></div>
                    <img
                      class="img-fluid"
                      src="images/slider/booking-banner-5.jpg"
                      alt="banner"
                    />
                  </a>
                </div>
                <div class="item rounded">
                  <a href="#">
                    <div class="caption">
                      <h2>25% OFF</h2>
                      <p>On Bus Booking</p>
                    </div>
                    <div class="banner-mask"></div>
                    <img
                      class="img-fluid"
                      src="images/slider/booking-banner-6.jpg"
                      alt="banner"
                    />
                  </a>
                </div>
              </div> */}
              {/* <h2 class="text-9 fw-600 text-center mt-5">
                Start your travel planning here
              </h2>
              <p class="lead text-dark text-center mb-4">
                Search Hotels, Flights, Trains & Bus
              </p> */}
              {/* <div class="row gy-4 gx-5">
                <div class="col-md-6 col-lg-4">
                  <div
                    class="accordion accordion-flush arrow-end"
                    id="popularRoutes"
                  >
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="one">
                        <button
                          class="accordion-button collapsed invisible-background-btn"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseOne"
                          aria-expanded="false"
                          aria-controls="collapseOne"
                        >
                          New Delhi
                        </button>
                      </h2>
                      <div
                        id="collapseOne"
                        class="accordion-collapse collapse"
                        aria-labelledby="one"
                        data-bs-parent="#popularRoutes"
                      >
                        <div class="accordion-body ps-0">
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bed"></i>
                            </span>
                            Hotels
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                The Orchid Hotel
                                <span class="ms-auto">$ 210+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Whistling Meadows Resort
                                <span class="ms-auto">$ 675+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Radisson Blu Hotel
                                <span class="ms-auto">$ 280+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                The Lotus Hotel
                                <span class="ms-auto">$ 412+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-plane"></i>
                            </span>
                            Flights
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Jaipur - New Delhi
                                <span class="ms-auto">$ 1,015+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Varanasi - New Delhi
                                <span class="ms-auto">$ 3,152+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Amritsar - New Delhi
                                <span class="ms-auto">$ 4,137+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Ahmedabad - New Delhi
                                <span class="ms-auto">$ 925+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-train"></i>
                            </span>
                            Trains
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - New Delhi
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - New Delhi
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bus"></i>
                            </span>
                            Bus
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Bhopal To Indore
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Bangalore to Chennai
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Srinagar - New Delhi
                                <span class="ms-auto">$ 2,100+</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="two">
                        <button
                          class="accordion-button collapsed invisible-background-btn"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseTwo"
                          aria-expanded="false"
                          aria-controls="collapseTwo"
                        >
                          Bengaluru
                        </button>
                      </h2>
                      <div
                        id="collapseTwo"
                        class="accordion-collapse collapse"
                        aria-labelledby="two"
                        data-bs-parent="#popularRoutes"
                      >
                        <div class="accordion-body ps-0">
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bed"></i>
                            </span>
                            Hotels
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                The Orchid Hotel
                                <span class="ms-auto">$ 210+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Whistling Meadows Resort
                                <span class="ms-auto">$ 675+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Radisson Blu Hotel
                                <span class="ms-auto">$ 280+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                The Lotus Hotel
                                <span class="ms-auto">$ 412+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-plane"></i>
                            </span>
                            Flights
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Jaipur - Bengaluru
                                <span class="ms-auto">$ 1,015+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Varanasi - Bengaluru
                                <span class="ms-auto">$ 3,152+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Amritsar - Bengaluru
                                <span class="ms-auto">$ 4,137+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Ahmedabad - Bengaluru
                                <span class="ms-auto">$ 925+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-train"></i>
                            </span>
                            Trains
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - Bengaluru
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - Bengaluru
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bus"></i>
                            </span>
                            Bus
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - Bengaluru
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - Bengaluru
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Srinagar - Bengaluru
                                <span class="ms-auto">$ 2,100+</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="three">
                        <button
                          class="accordion-button collapsed invisible-background-btn"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseThree"
                          aria-expanded="false"
                          aria-controls="collapseThree"
                        >
                          Chennai
                        </button>
                      </h2>
                      <div
                        id="collapseThree"
                        class="accordion-collapse collapse"
                        aria-labelledby="three"
                        data-bs-parent="#popularRoutes"
                      >
                        <div class="accordion-body ps-0">
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bed"></i>
                            </span>
                            Hotels
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                The Orchid Hotel
                                <span class="ms-auto">$ 210+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Whistling Meadows Resort
                                <span class="ms-auto">$ 675+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Radisson Blu Hotel
                                <span class="ms-auto">$ 280+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                The Lotus Hotel
                                <span class="ms-auto">$ 412+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-plane"></i>
                            </span>
                            Flights
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Jaipur - Chennai
                                <span class="ms-auto">$ 1,015+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Varanasi - Chennai
                                <span class="ms-auto">$ 3,152+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Amritsar - Chennai
                                <span class="ms-auto">$ 4,137+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Ahmedabad - Chennai
                                <span class="ms-auto">$ 925+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-train"></i>
                            </span>
                            Trains
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - Chennai
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - Chennai
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bus"></i>
                            </span>
                            Bus
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - Chennai
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - Chennai
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Srinagar - Chennai
                                <span class="ms-auto">$ 2,100+</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="four">
                        <button
                          class="accordion-button collapsed invisible-background-btn"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseFour"
                          aria-expanded="false"
                          aria-controls="collapseFour"
                        >
                          Mumbai
                        </button>
                      </h2>
                      <div
                        id="collapseFour"
                        class="accordion-collapse collapse"
                        aria-labelledby="four"
                        data-bs-parent="#popularRoutes"
                      >
                        <div class="accordion-body ps-0">
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bed"></i>
                            </span>
                            Hotels
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                The Orchid Hotel
                                <span class="ms-auto">$ 210+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Whistling Meadows Resort
                                <span class="ms-auto">$ 675+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Radisson Blu Hotel
                                <span class="ms-auto">$ 280+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                The Lotus Hotel
                                <span class="ms-auto">$ 412+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-plane"></i>
                            </span>
                            Flights
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Jaipur - Mumbai
                                <span class="ms-auto">$ 1,015+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Varanasi - Mumbai
                                <span class="ms-auto">$ 3,152+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Amritsar - Mumbai
                                <span class="ms-auto">$ 4,137+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Ahmedabad - Mumbai
                                <span class="ms-auto">$ 925+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-train"></i>
                            </span>
                            Trains
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - Mumbai
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - Mumbai
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bus"></i>
                            </span>
                            Bus
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - Mumbai
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - Mumbai
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Srinagar - Mumbai
                                <span class="ms-auto">$ 2,100+</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="five">
                        <button
                          class="accordion-button collapsed invisible-background-btn"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseFive"
                          aria-expanded="false"
                          aria-controls="collapseFive"
                          // onClick={handleCity}
                        >
                          Hyderabad
                        </button>
                      </h2>
                      <div
                        id="collapseFive"
                        class="accordion-collapse collapse"
                        aria-labelledby="five"
                        data-bs-parent="#popularRoutes"
                      >
                        <div class="accordion-body ps-0">
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bed"></i>
                            </span>
                            Hotels
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                The Orchid Hotel
                                <span class="ms-auto">$ 210+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Whistling Meadows Resort
                                <span class="ms-auto">$ 675+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Radisson Blu Hotel
                                <span class="ms-auto">$ 280+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                The Lotus Hotel
                                <span class="ms-auto">$ 412+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-plane"></i>
                            </span>
                            Flights
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Jaipur - Hyderabad
                                <span class="ms-auto">$ 1,015+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Varanasi - Hyderabad
                                <span class="ms-auto">$ 3,152+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Amritsar - Hyderabad
                                <span class="ms-auto">$ 4,137+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Ahmedabad - Hyderabad
                                <span class="ms-auto">$ 925+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-train"></i>
                            </span>
                            Trains
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - Hyderabad
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - Hyderabad
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bus"></i>
                            </span>
                            Bus
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - Hyderabad
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - Hyderabad
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Srinagar - Hyderabad
                                <span class="ms-auto">$ 2,100+</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-4">
                  <div
                    class="accordion accordion-flush arrow-end"
                    id="popularRoutes2"
                  >
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="six">
                        <button
                          class="accordion-button collapsed invisible-background-btn"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseSix"
                          aria-expanded="false"
                          aria-controls="collapseSix"
                        >
                          Chicago
                        </button>
                      </h2>
                      <div
                        id="collapseSix"
                        class="accordion-collapse collapse"
                        aria-labelledby="six"
                        data-bs-parent="#popularRoutes2"
                      >
                        <div class="accordion-body ps-0">
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bed"></i>
                            </span>
                            Hotels
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                The Orchid Hotel
                                <span class="ms-auto">$ 210+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Whistling Meadows Resort
                                <span class="ms-auto">$ 675+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Radisson Blu Hotel
                                <span class="ms-auto">$ 280+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                The Lotus Hotel
                                <span class="ms-auto">$ 412+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-plane"></i>
                            </span>
                            Flights
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Jaipur - Chicago
                                <span class="ms-auto">$ 1,015+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Varanasi - Chicago
                                <span class="ms-auto">$ 3,152+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Amritsar - Chicago
                                <span class="ms-auto">$ 4,137+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Ahmedabad - Chicago
                                <span class="ms-auto">$ 925+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-train"></i>
                            </span>
                            Trains
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - Chicago
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - Chicago
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bus"></i>
                            </span>
                            Bus
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Bhopal To Chicago
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Bangalore to Chicago
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Srinagar - Chicago
                                <span class="ms-auto">$ 2,100+</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="seven">
                        <button
                          class="accordion-button collapsed invisible-background-btn"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseSeven"
                          aria-expanded="false"
                          aria-controls="collapseTwo"
                        >
                          New York
                        </button>
                      </h2>
                      <div
                        id="collapseSeven"
                        class="accordion-collapse collapse"
                        aria-labelledby="seven"
                        data-bs-parent="#popularRoutes2"
                      >
                        <div class="accordion-body ps-0">
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bed"></i>
                            </span>
                            Hotels
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                The Orchid Hotel
                                <span class="ms-auto">$ 210+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Whistling Meadows Resort
                                <span class="ms-auto">$ 675+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Radisson Blu Hotel
                                <span class="ms-auto">$ 280+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                The Lotus Hotel
                                <span class="ms-auto">$ 412+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-plane"></i>
                            </span>
                            Flights
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Jaipur - New York
                                <span class="ms-auto">$ 1,015+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Varanasi - New York
                                <span class="ms-auto">$ 3,152+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Amritsar - New York
                                <span class="ms-auto">$ 4,137+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Ahmedabad - New York
                                <span class="ms-auto">$ 925+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-train"></i>
                            </span>
                            Trains
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - New York
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - New York
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bus"></i>
                            </span>
                            Bus
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - New York
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - New York
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Srinagar - New York
                                <span class="ms-auto">$ 2,100+</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="eight">
                        <button
                          class="accordion-button collapsed invisible-background-btn"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseEight"
                          aria-expanded="false"
                          aria-controls="collapseEight"
                        >
                          London
                        </button>
                      </h2>
                      <div
                        id="collapseEight"
                        class="accordion-collapse collapse"
                        aria-labelledby="eight"
                        data-bs-parent="#popularRoutes2"
                      >
                        <div class="accordion-body ps-0">
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bed"></i>
                            </span>
                            Hotels
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                The Orchid Hotel
                                <span class="ms-auto">$ 210+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Whistling Meadows Resort
                                <span class="ms-auto">$ 675+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Radisson Blu Hotel
                                <span class="ms-auto">$ 280+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                The Lotus Hotel
                                <span class="ms-auto">$ 412+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-plane"></i>
                            </span>
                            Flights
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Jaipur - London
                                <span class="ms-auto">$ 1,015+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Varanasi - London
                                <span class="ms-auto">$ 3,152+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Amritsar - London
                                <span class="ms-auto">$ 4,137+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Ahmedabad - London
                                <span class="ms-auto">$ 925+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-train"></i>
                            </span>
                            Trains
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - London
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - London
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bus"></i>
                            </span>
                            Bus
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - London
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="nine">
                        <button
                          class="accordion-button collapsed invisible-background-btn"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseNine"
                          aria-expanded="false"
                          aria-controls="collapseNine"
                        >
                          Panaji
                        </button>
                      </h2>
                      <div
                        id="collapseNine"
                        class="accordion-collapse collapse"
                        aria-labelledby="nine"
                        data-bs-parent="#popularRoutes2"
                      >
                        <div class="accordion-body ps-0">
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bed"></i>
                            </span>
                            Hotels
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                The Orchid Hotel
                                <span class="ms-auto">$ 210+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Whistling Meadows Resort
                                <span class="ms-auto">$ 675+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Radisson Blu Hotel
                                <span class="ms-auto">$ 280+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                The Lotus Hotel
                                <span class="ms-auto">$ 412+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-plane"></i>
                            </span>
                            Flights
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Jaipur - Panaji
                                <span class="ms-auto">$ 1,015+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Varanasi - Panaji
                                <span class="ms-auto">$ 3,152+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Amritsar - Panaji
                                <span class="ms-auto">$ 4,137+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Ahmedabad - Panaji
                                <span class="ms-auto">$ 925+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-train"></i>
                            </span>
                            Trains
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - Panaji
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - Panaji
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bus"></i>
                            </span>
                            Bus
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - Panaji
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - Panaji
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Srinagar - Panaji
                                <span class="ms-auto">$ 2,100+</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="ten">
                        <button
                          class="accordion-button collapsed invisible-background-btn"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseTen"
                          aria-expanded="false"
                          aria-controls="collapseTen"
                        >
                          Ahmedabad
                        </button>
                      </h2>
                      <div
                        id="collapseTen"
                        class="accordion-collapse collapse"
                        aria-labelledby="ten"
                        data-bs-parent="#popularRoutes2"
                      >
                        <div class="accordion-body ps-0">
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bed"></i>
                            </span>
                            Hotels
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                The Orchid Hotel
                                <span class="ms-auto">$ 210+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Whistling Meadows Resort
                                <span class="ms-auto">$ 675+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Radisson Blu Hotel
                                <span class="ms-auto">$ 280+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                The Lotus Hotel
                                <span class="ms-auto">$ 412+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-plane"></i>
                            </span>
                            Flights
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Jaipur - Ahmedabad
                                <span class="ms-auto">$ 1,015+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Varanasi - Ahmedabad
                                <span class="ms-auto">$ 3,152+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Amritsar - Ahmedabad
                                <span class="ms-auto">$ 4,137+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Ahmedabad - Ahmedabad
                                <span class="ms-auto">$ 925+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-train"></i>
                            </span>
                            Trains
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - Ahmedabad
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - Ahmedabad
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bus"></i>
                            </span>
                            Bus
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - Ahmedabad
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - Ahmedabad
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Srinagar - Ahmedabad
                                <span class="ms-auto">$ 2,100+</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-4">
                  <div
                    class="accordion accordion-flush arrow-end"
                    id="popularRoutes3"
                  >
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="eleven">
                        <button
                          class="accordion-button collapsed invisible-background-btn"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseEleven"
                          aria-expanded="false"
                          aria-controls="collapseEleven"
                        >
                          Bangkok
                        </button>
                      </h2>
                      <div
                        id="collapseEleven"
                        class="accordion-collapse collapse"
                        aria-labelledby="eleven"
                        data-bs-parent="#popularRoutes3"
                      >
                        <div class="accordion-body ps-0">
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bed"></i>
                            </span>
                            Hotels
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                The Orchid Hotel
                                <span class="ms-auto">$ 210+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Whistling Meadows Resort
                                <span class="ms-auto">$ 675+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Radisson Blu Hotel
                                <span class="ms-auto">$ 280+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                The Lotus Hotel
                                <span class="ms-auto">$ 412+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-plane"></i>
                            </span>
                            Flights
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Jaipur - Bangkok
                                <span class="ms-auto">$ 1,015+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Varanasi - Bangkok
                                <span class="ms-auto">$ 3,152+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Amritsar - Bangkok
                                <span class="ms-auto">$ 4,137+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Ahmedabad - Bangkok
                                <span class="ms-auto">$ 925+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-train"></i>
                            </span>
                            Trains
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - Bangkok
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - Bangkok
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bus"></i>
                            </span>
                            Bus
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - Bangkok
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - Bangkok
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Srinagar - Bangkok
                                <span class="ms-auto">$ 2,100+</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="twelve">
                        <button
                          class="accordion-button collapsed invisible-background-btn"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseTwelve"
                          aria-expanded="false"
                          aria-controls="collapseTwelve"
                        >
                          Singapore
                        </button>
                      </h2>
                      <div
                        id="collapseTwelve"
                        class="accordion-collapse collapse"
                        aria-labelledby="twelve"
                        data-bs-parent="#popularRoutes3"
                      >
                        <div class="accordion-body ps-0">
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bed"></i>
                            </span>
                            Hotels
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                The Orchid Hotel
                                <span class="ms-auto">$ 210+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Whistling Meadows Resort
                                <span class="ms-auto">$ 675+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Radisson Blu Hotel
                                <span class="ms-auto">$ 280+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                The Lotus Hotel
                                <span class="ms-auto">$ 412+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-plane"></i>
                            </span>
                            Flights
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Jaipur - Singapore
                                <span class="ms-auto">$ 1,015+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Varanasi - Singapore
                                <span class="ms-auto">$ 3,152+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Amritsar - Singapore
                                <span class="ms-auto">$ 4,137+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Ahmedabad - Singapore
                                <span class="ms-auto">$ 925+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-train"></i>
                            </span>
                            Trains
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - Singapore
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - Singapore
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bus"></i>
                            </span>
                            Bus
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Bhopal To Singapore
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Bangalore to Singapore
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Srinagar - Singapore
                                <span class="ms-auto">$ 2,100+</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="thirteen">
                        <button
                          class="accordion-button collapsed invisible-background-btn"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseThirteen"
                          aria-expanded="false"
                          aria-controls="collapseThirteen"
                        >
                          Los Angeles
                        </button>
                      </h2>
                      <div
                        id="collapseThirteen"
                        class="accordion-collapse collapse"
                        aria-labelledby="thirteen"
                        data-bs-parent="#popularRoutes3"
                      >
                        <div class="accordion-body ps-0">
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bed"></i>
                            </span>
                            Hotels
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                The Orchid Hotel
                                <span class="ms-auto">$ 210+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Whistling Meadows Resort
                                <span class="ms-auto">$ 675+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Radisson Blu Hotel
                                <span class="ms-auto">$ 280+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                The Lotus Hotel
                                <span class="ms-auto">$ 412+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-plane"></i>
                            </span>
                            Flights
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Jaipur - Los Angeles
                                <span class="ms-auto">$ 1,015+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Varanasi - Los Angeles
                                <span class="ms-auto">$ 3,152+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Amritsar - Los Angeles
                                <span class="ms-auto">$ 4,137+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Ahmedabad - Los Angeles
                                <span class="ms-auto">$ 925+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-train"></i>
                            </span>
                            Trains
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - Los Angeles
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - Los Angeles
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bus"></i>
                            </span>
                            Bus
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - Los Angeles
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - Los Angeles
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Srinagar - Los Angeles
                                <span class="ms-auto">$ 2,100+</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="fourteen">
                        <button
                          class="accordion-button collapsed invisible-background-btn"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseFourteen"
                          aria-expanded="false"
                          aria-controls="collapseFourteen"
                        >
                          San Francisco
                        </button>
                      </h2>
                      <div
                        id="collapseFourteen"
                        class="accordion-collapse collapse"
                        aria-labelledby="fourteen"
                        data-bs-parent="#popularRoutes3"
                      >
                        <div class="accordion-body ps-0">
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bed"></i>
                            </span>
                            Hotels
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                The Orchid Hotel
                                <span class="ms-auto">$ 210+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Whistling Meadows Resort
                                <span class="ms-auto">$ 675+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Radisson Blu Hotel
                                <span class="ms-auto">$ 280+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                The Lotus Hotel
                                <span class="ms-auto">$ 412+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-plane"></i>
                            </span>
                            Flights
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Jaipur - San Francisco
                                <span class="ms-auto">$ 1,015+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Varanasi - San Francisco
                                <span class="ms-auto">$ 3,152+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Amritsar - San Francisco
                                <span class="ms-auto">$ 4,137+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Ahmedabad - San Francisco
                                <span class="ms-auto">$ 925+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-train"></i>
                            </span>
                            Trains
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - San Francisco
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - San Francisco
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bus"></i>
                            </span>
                            Bus
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - San Francisco
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - San Francisco
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Srinagar - San Francisco
                                <span class="ms-auto">$ 2,100+</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="fifteen">
                        <button
                          class="accordion-button collapsed invisible-background-btn"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseFifteen"
                          aria-expanded="false"
                          aria-controls="collapseFifteen"
                        >
                          Hong Kong
                        </button>
                      </h2>
                      <div
                        id="collapseFifteen"
                        class="accordion-collapse collapse"
                        aria-labelledby="fifteen"
                        data-bs-parent="#popularRoutes3"
                      >
                        <div class="accordion-body ps-0">
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bed"></i>
                            </span>
                            Hotels
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                The Orchid Hotel
                                <span class="ms-auto">$ 210+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Whistling Meadows Resort
                                <span class="ms-auto">$ 675+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Radisson Blu Hotel
                                <span class="ms-auto">$ 280+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                The Lotus Hotel
                                <span class="ms-auto">$ 412+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-plane"></i>
                            </span>
                            Flights
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Jaipur - Hong Kong
                                <span class="ms-auto">$ 1,015+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Varanasi - Hong Kong
                                <span class="ms-auto">$ 3,152+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Amritsar - Hong Kong
                                <span class="ms-auto">$ 4,137+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Ahmedabad - Hong Kong
                                <span class="ms-auto">$ 925+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-train"></i>
                            </span>
                            Trains
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - Hong Kong
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - Hong Kong
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                          </ul>
                          <a class="text-3" href="#">
                            <span class="me-2">
                              <i class="fas fa-bus"></i>
                            </span>
                            Bus
                          </a>
                          <ul class="routes-list">
                            <li>
                              <a href="#">
                                Surat - Hong Kong
                                <span class="ms-auto">$ 1,209+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Kolkata - Hong Kong
                                <span class="ms-auto">$ 1,999+</span>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                Srinagar - Hong Kong
                                <span class="ms-auto">$ 2,100+</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <p class="text-center mb-0">
                    <a href="#" class="btn btn-link">
                      View All <i class="fas fa-arrow-right ms-1"></i>
                    </a>
                  </p>
                </div>
              </div> */}
              <div class="container mt-5 py-2">
                <h2 class="text-6 fw-500 mb-0">
                  Popular Destinations in India
                </h2>
                <p class="text-3">
                  Explore these places and some other thing here
                </p>
                <div
                  class="owl-carousel owl-theme"
                  data-autoplay="true"
                  data-loop="true"
                  data-margin="10"
                  data-items-xs="2"
                  data-items-sm="3"
                  data-items-md="4"
                  data-items-lg="4"
                  ref={parentRef}
                >
                  <div class="item">
                    {" "}
                    <a
                      href="#"
                      onClick={handleCity}
                      data-country="India"
                      data-city="Bangalore"
                    >
                      <div
                        class="card border-0"
                        data-country="India"
                        data-city="Bangalore"
                      >
                        {" "}
                        <img
                          class="card-img-top rounded destination-carousel-img"
                          src={bangalore}
                          alt="banner"
                          data-country="India"
                          data-city="Bangalore"
                        />
                        <div
                          class="card-body px-0 py-1"
                          data-country="India"
                          data-city="Bangalore"
                        >
                          <p
                            class="card-title fw-500 text-dark mb-0"
                            data-country="India"
                            data-city="Bangalore"
                          >
                            Bangalore
                          </p>
                          <p
                            class="card-text text-1 text-muted mb-0"
                            data-country="India"
                            data-city="Bangalore"
                          >
                            1069 properties
                          </p>
                        </div>
                      </div>
                    </a>{" "}
                  </div>
                  <div class="item">
                    {" "}
                    <a
                      href="#"
                      onClick={handleCity}
                      data-country="India"
                      data-city="Hyderabad"
                    >
                      <div
                        class="card border-0"
                        data-country="India"
                        data-city="Hyderabad"
                      >
                        {" "}
                        <img
                          data-country="India"
                          data-city="Hyderabad"
                          class="card-img-top rounded destination-carousel-img"
                          src={hyderabad}
                          alt="banner"
                        />
                        <div
                          class="card-body px-0 py-1"
                          data-country="India"
                          data-city="Hyderabad"
                        >
                          <p
                            class="card-title fw-500 text-dark mb-0"
                            ref={(el) => elementRef.current.push(el)}
                            data-country="India"
                            data-city="Hyderabad"
                          >
                            Hyderabad
                          </p>
                          <p
                            class="card-text text-1 text-muted mb-0"
                            data-country="India"
                            data-city="Hyderabad"
                          >
                            2150 properties
                          </p>
                        </div>
                      </div>
                    </a>{" "}
                  </div>
                  <div class="item">
                    {" "}
                    <a
                      href="#"
                      onClick={handleCity}
                      data-country="India"
                      data-city="Chennai"
                    >
                      <div
                        class="card border-0"
                        data-country="India"
                        data-city="Chennai"
                      >
                        {" "}
                        <img
                          data-country="India"
                          data-city="Chennai"
                          class="card-img-top rounded destination-carousel-img"
                          src={chennai}
                          alt="banner"
                        />
                        <div
                          class="card-body px-0 py-1"
                          data-country="India"
                          data-city="Chennai"
                        >
                          <p
                            data-country="India"
                            data-city="Chennai"
                            class="card-title fw-500 text-dark mb-0"
                            ref={(el) => elementRef.current.push(el)}
                          >
                            Chennai
                          </p>
                          <p
                            class="card-text text-1 text-muted mb-0"
                            data-country="India"
                            data-city="Chennai"
                          >
                            805 properties
                          </p>
                        </div>
                      </div>
                    </a>{" "}
                  </div>
                  <div class="item">
                    {" "}
                    <a
                      href="#"
                      onClick={handleCity}
                      data-country="India"
                      data-city="Jaipur"
                    >
                      <div
                        class="card border-0"
                        data-country="India"
                        data-city="Jaipur"
                      >
                        {" "}
                        <img
                          data-country="India"
                          data-city="Jaipur"
                          class="card-img-top rounded destination-carousel-img"
                          src={jaipur}
                          alt="banner"
                        />
                        <div
                          class="card-body px-0 py-1"
                          data-country="India"
                          data-city="Jaipur"
                        >
                          <p
                            data-country="India"
                            data-city="Jaipur"
                            class="card-title fw-500 text-dark mb-0"
                            ref={(el) => elementRef.current.push(el)}
                          >
                            Jaipur
                          </p>
                          <p
                            class="card-text text-1 text-muted mb-0"
                            data-country="India"
                            data-city="Jaipur"
                          >
                            655 properties
                          </p>
                        </div>
                      </div>
                    </a>{" "}
                  </div>
                  <div class="item">
                    {" "}
                    <a
                      href="#"
                      onClick={handleCity}
                      data-country="India"
                      data-city="Mumbai"
                    >
                      <div
                        class="card border-0"
                        data-country="India"
                        data-city="Mumbai"
                      >
                        {" "}
                        <img
                          data-country="India"
                          data-city="Mumbai"
                          class="card-img-top rounded destination-carousel-img"
                          src={mumbai}
                          alt="banner"
                        />
                        <div
                          class="card-body px-0 py-1"
                          data-country="India"
                          data-city="Mumbai"
                        >
                          <p
                            class="card-title fw-500 text-dark mb-0"
                            data-country="India"
                            data-city="Mumbai"
                          >
                            Mumbai
                          </p>
                          <p
                            class="card-text text-1 text-muted mb-0"
                            data-country="India"
                            data-city="Mumbai"
                          >
                            767 properties
                          </p>
                        </div>
                      </div>
                    </a>{" "}
                  </div>
                  <div class="item">
                    {" "}
                    <a
                      href="#"
                      onClick={handleCity}
                      data-country="India"
                      data-city="Kochi"
                    >
                      <div
                        class="card border-0"
                        data-country="India"
                        data-city="Kochi"
                      >
                        {" "}
                        <img
                          class="card-img-top rounded destination-carousel-img"
                          src={kochi}
                          alt="banner"
                          data-country="India"
                          data-city="Kochi"
                        />
                        <div
                          class="card-body px-0 py-1"
                          data-country="India"
                          data-city="Kochi"
                        >
                          <p
                            class="card-title fw-500 text-dark mb-0"
                            data-country="India"
                            data-city="Kochi"
                          >
                            Kochi
                          </p>
                          <p
                            class="card-text text-1 text-muted mb-0"
                            data-country="India"
                            data-city="Kochi"
                          >
                            422 properties
                          </p>
                        </div>
                      </div>
                    </a>{" "}
                  </div>
                  <div class="item">
                    {" "}
                    <a
                      href="#"
                      onClick={handleCity}
                      data-country="India"
                      data-city="Delhi"
                    >
                      <div
                        class="card border-0"
                        data-country="India"
                        data-city="Delhi"
                      >
                        {" "}
                        <img
                          data-country="India"
                          data-city="Delhi"
                          class="card-img-top rounded destination-carousel-img"
                          src={newdelhi}
                          alt="banner"
                        />
                        <div
                          class="card-body px-0 py-1"
                          data-country="India"
                          data-city="Delhi"
                        >
                          <p
                            class="card-title fw-500 text-dark mb-0"
                            data-country="India"
                            data-city="Delhi"
                          >
                            Delhi
                          </p>
                          <p
                            class="card-text text-1 text-muted mb-0"
                            data-country="India"
                            data-city="Delhi"
                          >
                            1069 properties
                          </p>
                        </div>
                      </div>
                    </a>{" "}
                  </div>
                  <div class="item">
                    {" "}
                    <a
                      href="#"
                      onClick={handleCity}
                      data-country="India"
                      data-city="Ahmedabad"
                    >
                      <div
                        class="card border-0"
                        data-country="India"
                        data-city="Ahmedabad"
                      >
                        {" "}
                        <img
                          data-country="India"
                          data-city="Ahmedabad"
                          class="card-img-top rounded destination-carousel-img"
                          src={ahmedabad}
                          alt="banner"
                        />
                        <div
                          class="card-body px-0 py-1"
                          data-country="India"
                          data-city="Ahmedabad"
                        >
                          <p
                            class="card-title fw-500 text-dark mb-0"
                            data-country="India"
                            data-city="Ahmedabad"
                          >
                            Ahmedabad
                          </p>
                          <p
                            class="card-text text-1 text-muted mb-0"
                            data-country="India"
                            data-city="Ahmedabad"
                          >
                            2150 properties
                          </p>
                        </div>
                      </div>
                    </a>{" "}
                  </div>
                  <div class="item">
                    {" "}
                    <a
                      href="#"
                      onClick={handleCity}
                      data-country="India"
                      data-city="Agra"
                    >
                      <div
                        class="card border-0"
                        data-country="India"
                        data-city="Agra"
                      >
                        {" "}
                        <img
                          data-country="India"
                          data-city="Agra"
                          class="card-img-top rounded destination-carousel-img"
                          src={agra}
                          alt="banner"
                        />
                        <div
                          class="card-body px-0 py-1"
                          data-country="India"
                          data-city="Agra"
                        >
                          <p
                            class="card-title fw-500 text-dark mb-0"
                            data-country="India"
                            data-city="Agra"
                          >
                            Agra
                          </p>
                          <p
                            class="card-text text-1 text-muted mb-0"
                            data-country="India"
                            data-city="Agra"
                          >
                            805 properties
                          </p>
                        </div>
                      </div>
                    </a>{" "}
                  </div>
                </div>
              </div>

              <section class="section">
                <div class="mainpopcont">
                  <h2 class="text-9 fw-500 text-center">
                    Popular Destinations
                  </h2>
                  <p class="lead text-center mb-4">
                    World's leading Hotel Booking website, Over 40,000 Hotel
                    rooms worldwide.
                  </p>
                  <div class="row g-4 banner">
                    <div class="col-md-8 box1">
                      <div class="item rounded h-100">
                        {" "}
                        <a
                          href="#"
                          onClick={handleCity}
                          data-city="Dubai"
                          data-country="United Arab Emirates"
                        >
                          <div
                            class="caption text-center"
                            data-city="Dubai"
                            data-country="United Arab Emirates"
                          >
                            <h2
                              class="text-7"
                              data-city="Dubai"
                              data-country="United Arab Emirates"
                            >
                              Dubai
                            </h2>
                            <p
                              data-city="Dubai"
                              data-country="United Arab Emirates"
                            >
                              Starting Hotels from $550
                            </p>
                          </div>
                          <div
                            class="banner-mask"
                            data-city="Dubai"
                            data-country="United Arab Emirates"
                          ></div>
                          <img
                            data-city="Dubai"
                            data-country="United Arab Emirates"
                            class="img-fluid h-100"
                            src="images/brands/hotels/dubai.jpg"
                            alt="hotels"
                          />{" "}
                        </a>{" "}
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="row g-4">
                        <div class="box1 col-12">
                          <div class="item rounded">
                            {" "}
                            <a
                              href="#"
                              onClick={handleCity}
                              data-city="Paris"
                              data-country="France"
                            >
                              <div
                                class="caption text-center"
                                data-city="Paris"
                                data-country="France"
                              >
                                <h2 data-city="Paris" data-country="France">
                                  Paris
                                </h2>
                                <p data-city="Paris" data-country="France">
                                  Starting Hotels from $350
                                </p>
                              </div>
                              <div
                                data-city="Paris"
                                data-country="France"
                                class="banner-mask"
                              ></div>
                              <img
                                data-city="Paris"
                                data-country="France"
                                class="img-fluid"
                                src={paris}
                                alt="hotels"
                              />{" "}
                            </a>{" "}
                          </div>
                        </div>
                        <div class="col-12 box1">
                          <div class="item rounded">
                            {" "}
                            <a
                              href="#"
                              onClick={handleCity}
                              data-city="London"
                              data-country="United Kingdom"
                            >
                              <div
                                data-city="London"
                                data-country="United Kingdom"
                                class="caption text-center"
                              >
                                <h2
                                  data-city="London"
                                  data-country="United Kingdom"
                                >
                                  London
                                </h2>
                                <p
                                  data-city="London"
                                  data-country="United Kingdom"
                                >
                                  Starting Hotels from $400
                                </p>
                              </div>
                              <div
                                data-city="London"
                                data-country="United Kingdom"
                                class="banner-mask"
                              ></div>
                              <img
                                data-city="London"
                                data-country="United Kingdom"
                                class="img-fluid"
                                src="images/brands/hotels/lodon.jpg"
                                alt="hotels"
                              />{" "}
                            </a>{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row banner g-4 mt-0 mb-2">
                    <div class="col-md-4">
                      <div class="row g-4">
                        <div class="col-12 box1">
                          <div class="item rounded">
                            {" "}
                            <a
                              href="#"
                              onClick={handleCity}
                              data-city="Bangkok"
                              data-country="Thailand"
                            >
                              <div
                                data-city="Bangkok"
                                data-country="Thailand"
                                class="caption text-center"
                              >
                                <h2 data-city="Bangkok" data-country="Thailand">
                                  Bangkok
                                </h2>
                                <p data-city="Bangkok" data-country="Thailand">
                                  Starting Hotels from $330
                                </p>
                              </div>
                              <div
                                data-city="Bangkok"
                                data-country="Thailand"
                                class="banner-mask"
                              ></div>
                              <img
                                data-city="Bangkok"
                                data-country="Thailand"
                                class="img-fluid"
                                src="images/brands/hotels/bangkok.jpg"
                                alt="bangkok"
                              />{" "}
                            </a>{" "}
                          </div>
                        </div>
                        <div class="col-12 box1">
                          <div class="item rounded">
                            {" "}
                            <a
                              href="#"
                              onClick={handleCity}
                              data-city="New York"
                              data-country="United States of America"
                            >
                              <div
                                class="caption text-center"
                                data-city="New York"
                                data-country="United States of America"
                              >
                                <h2
                                  data-city="New York"
                                  data-country="United States of America"
                                >
                                  New York
                                </h2>
                                <p
                                  data-city="New York"
                                  data-country="United States of America"
                                >
                                  Starting Hotels from $480
                                </p>
                              </div>
                              <div
                                data-city="New York"
                                data-country="United States of America"
                                class="banner-mask"
                              ></div>
                              <img
                                data-city="New York"
                                data-country="United States of America"
                                class="img-fluid"
                                src="images/brands/hotels/newyork.jpg"
                                alt="newyork"
                              />{" "}
                            </a>{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-8 box1">
                      <div class="item rounded h-100">
                        {" "}
                        <a
                          href="#"
                          onClick={handleCity}
                          data-city="Singapore"
                          data-country="Singapore"
                        >
                          <div
                            class="caption text-center"
                            data-city="Singapore"
                            data-country="Singapore"
                          >
                            <h2
                              class="text-7"
                              data-city="Singapore"
                              data-country="Singapore"
                            >
                              Singapore
                            </h2>
                            <p data-city="Singapore" data-country="Singapore">
                              Starting Hotels from $620
                            </p>
                          </div>
                          <div
                            class="banner-mask"
                            data-city="Singapore"
                            data-country="Singapore"
                          ></div>
                          <img
                            data-city="Singapore"
                            data-country="Singapore"
                            class="img-fluid h-100"
                            src="images/brands/hotels/singapore.jpg"
                            alt="singapore"
                          />{" "}
                        </a>{" "}
                      </div>
                    </div>
                  </div>
                  <div class="d-grid pt-4">
                    {" "}
                    <a href="#" class="btn btn-outline-primary shadow-none">
                      More Destinations
                    </a>{" "}
                  </div>
                </div>
              </section>
            </div>
          </div>

          <section class="section bg-secondary shadow-md">
            <div class="container">
              <h2 class="text-9 text-white fw-600 text-center">Refer & Earn</h2>
              <p class="lead text-center text-light mb-5">
                Refer your friends and earn up to $20.
              </p>
              <div class="row g-4">
                <div class="col-md-4">
                  <div class="featured-box style-3">
                    <div class="featured-box-icon bg-primary text-white rounded-circle">
                      <i class="fas fa-bullhorn"></i>
                    </div>
                    <h3 class="text-white">You Refer Friends</h3>
                    <p class="text-3 text-light">
                      Share your referral link with friends. They get $10.
                    </p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="featured-box style-3">
                    <div class="featured-box-icon bg-primary text-white rounded-circle">
                      <i class="fas fa-sign-in-alt"></i>
                    </div>
                    <h3 class="text-white">Your Friends Register</h3>
                    <p class="text-3 text-light">
                      Your friends Register with using your referral link.
                    </p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="featured-box style-3">
                    <div class="featured-box-icon bg-primary text-white rounded-circle">
                      <i class="fas fa-dollar-sign"></i>
                    </div>
                    <h3 class="text-white">Earn You</h3>
                    <p class="text-3 text-light">
                      You get $20. You can use these credits to take recharge.
                    </p>
                  </div>
                </div>
              </div>
              <div class="text-center pt-4">
                <a href="#" class="btn btn-outline-light">
                  Get Started Earn
                </a>
              </div>
            </div>
          </section>

          <section class="section pb-0">
            <div class="container">
              <div class="row">
                <div class="col-lg-6 text-center">
                  <img class="img-fluid" alt="" src="images/app-mobile-2.png" />
                </div>
                <div class="col-lg-6 text-center text-lg-start">
                  <h2 class="text-9 fw-600 my-4">
                    Download Our Quickai
                    <br class="d-none d-lg-inline-block" />
                    Mobile App Now
                  </h2>
                  <p class="lead text-dark">
                    Download our app for the fastest, most convenient way to
                    Recharge & Bill Payment, Booking and more....
                  </p>
                  <div class="pt-3">
                    <a
                      href="#"
                      class="me-4 btn btn-outline-primary shadow-none"
                    >
                      <i class="fab fa-apple me-1"></i> App Store
                    </a>
                    <a
                      href="#"
                      class="me-4 btn btn-outline-primary shadow-none"
                    >
                      <i class="fab fa-android me-1"></i> Play Store
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer id="footer">
          <section class="section bg-white shadow-md pt-4 pb-3">
            <div class="container">
              <div class="row">
                <div class="col-sm-6 col-md-3">
                  <div class="featured-box text-center">
                    <div class="featured-box-icon">
                      <i class="fas fa-lock"></i>
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
                      <i class="fas fa-thumbs-up"></i>
                    </div>
                    <h4>Trust pay</h4>
                    <p>100% Payment Protection. Easy Return Policy.</p>
                  </div>
                </div>
                <div class="col-sm-6 col-md-3">
                  <div class="featured-box text-center">
                    <div class="featured-box-icon">
                      <i class="fas fa-bullhorn"></i>
                    </div>
                    <h4>Refer & Earn</h4>
                    <p>Invite a friend to sign up and earn up to $100.</p>
                  </div>
                </div>
                <div class="col-sm-6 col-md-3">
                  <div class="featured-box text-center">
                    <div class="featured-box-icon">
                      <i class="far fa-life-ring"></i>
                    </div>
                    <h4>24X7 Support</h4>
                    <p>
                      We're here to help. Have a query and need help ?
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
                  <a class="nav-link active" href="#">
                    About Us
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    Faq
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    Contact
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    Support
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    Terms of Use
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    Privacy Policy
                  </a>
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

export default HotelSearch;
