import React, { useState, useEffect } from "react";
import { useStateValue } from "../ContextApi/StateProvider";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import * as ReactDOM from "react-dom";
import he from "he";
import "./HotelConfirm.css";
import Header from "../Components/Header";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useTabContext } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

const HotelConfirm = () => {
  const [{ hotelDataSelected }, dispatch] = useStateValue();
  const [blockRoomData, setBlockRoomData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [localData, setLocalData] = useState([]);
  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [rooms, setRooms] = useState(0);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");
  const [userphone, setUserphone] = useState("");
  const [confirmmail, setConfirmmail] = useState("");
  const [UserPAN, setUserPAN] = useState("");
  const [UserAge, setUserAge] = useState("");
  const [hotelBookingDetails, setHotelBookingDetails] = useState([]);
  const [markup, setMarkup] = useState();
  const history = useHistory();

  const paymentGateway = (e) => {
    e.preventDefault();
    if (username === "" || username === null) {
      return alert("Please enter Username");
    }
    if (useremail === "" || useremail === null) {
      return alert("Please enter User Email Address");
    }
    if (userphone === "" || userphone === null) {
      return alert("Please enter User Phone Number");
    }
    if (UserPAN === "" || UserPAN === null) {
      return alert("Please enter User PAN Number");
    }
    if (UserAge === "" || UserAge === null) {
      return alert("Please enter User Age");
    }

    const bookingObj = { ...hotelBookingDetails[0] };
    const nameArray = username.split(" ");
    console.log(nameArray);

    bookingObj.HotelRoomsDetails[0].HotelPassenger = [
      {
        Title: "mr",
        FirstName: nameArray[0],
        Middlename: nameArray.length === 3 ? nameArray[1] : null,
        LastName:
          nameArray.length >= 2 ? nameArray[nameArray.length - 1] : null,
        Phoneno: userphone,
        Email: useremail,
        PaxType: 1,
        LeadPassenger: true,
        Age: UserAge,
        // PassportNo: null,
        // PassportIssueDate: "0001-01-01T00: 00: 00",
        // PassportExpDate: "0001-01-01T00: 00: 00",
        PAN: "EBQPS3333T",
      },
    ];

    console.log(bookingObj);
    localStorage.setItem(
      "hotel-booking-confirm-details",
      JSON.stringify(bookingObj)
    );
    // const localstorageobj = localStorage.getItem(
    //   "hotel-booking-confirm-details"
    // );
    // console.log(localstorageobj);
    // axios
    //   .post(
    //     "/BookingEngineService_Hotel/hotelservice.svc/rest/Book/", {...bookingObj})
    //   .then((data) => {
    //     console.log(data.data);
    //   })
    //   .catch((err) => console.error(err));

    history.push({
      pathname: "/hotelpayment",
      state: {
        amount: (
          blockRoomData[0]?.HotelRoomsDetails[0]?.Price
            .PublishedPriceRoundedOff +
          blockRoomData[0]?.HotelRoomsDetails[0]?.Price?.RoomPrice * +markup
        ).toFixed(2),
        name: username,
        email: useremail,
        phone_number: userphone,
        currency: "INR",
        bookingObj,
      },
    });
  };

  const getMarkup = async () => {
    axios.get("http://localhost:8000/getmarkup").then((response) => {
      console.log("markup", response);
      if (response.data.length == 0) {
        setMarkup(0);
      } else {
        setMarkup(response.data[0].Amount);
      }
    });
  };

  const payLaterBookNow = (e) => {
    e.preventDefault();
    // if (username === "" || username === null) {
    //   return alert("Please enter Username");
    // }
    // if (useremail === "" || useremail === null) {
    //   return alert("Please enter User Email Address");
    // }
    // if (userphone === "" || userphone === null) {
    //   return alert("Please enter User Phone Number");
    // }

    console.log(hotelBookingDetails);
    const bookingObj = {};
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

  const blockRoomConfirmation = (data) => {
    console.log(data);
    axios
      .post("/BookingEngineService_Hotel/hotelservice.svc/rest/BlockRoom/", {
        ...data,
      })
      .then((data) => {
        console.log(data);
        console.log(data?.data?.BlockRoomResult?.HotelPolicyDetail);
        const str = he.decode(data?.data?.BlockRoomResult?.HotelPolicyDetail);
        console.log(str);
        document
          .getElementById("hotel-policy-details")
          .insertAdjacentHTML("beforeend", str);

        setBlockRoomData([data.data.BlockRoomResult]);
        setTotalPrice(
          data?.data.BlockRoomResult?.HotelRoomsDetails[0]?.Price
            ?.OtherCharges +
            data?.data.BlockRoomResult?.HotelRoomsDetails[0]?.Price?.Tax
        );
      })
      .catch((err) => console.error(err));
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

  useEffect(() => {
    const hotelRoomBookingDetails = JSON.parse(
      localStorage.getItem("Hotel_Room_Booking_Details")
    );

    if (hotelRoomBookingDetails !== undefined) {
      getMarkup();
      setHotelBookingDetails([hotelRoomBookingDetails]);
      blockRoomConfirmation(hotelRoomBookingDetails);
    }
  }, []);

  return (
    <>
      <div id="main-wrapper">
        <Header />
        <section class="page-header page-header-dark bg-secondary">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-md-8">
                <h1>Hotels - Confirm Details</h1>
              </div>
              <div class="col-md-4">
                <ul class="breadcrumb justify-content-start justify-content-md-end mb-0">
                  <li>
                    <a href="index.html">Home</a>
                  </li>
                  <li>
                    <a href="booking-hotels.html">Hotels</a>
                  </li>
                  <li>
                    <a href="booking-hotels-details.html">Hotels Details</a>
                  </li>
                  <li class="active">Confirm Details</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div id="content">
          <section class="container">
            <div class="row">
              <div class="col-lg-8">
                <div class="bg-white shadow-md rounded p-3 p-sm-4 confirm-details">
                  <h2 class="text-6 mb-3 mb-sm-4">Confirm Hotels Details</h2>
                  <hr class="mx-n3 mx-sm-n4 mb-4" />
                  <div class="row">
                    <div class="col-12 col-md-3 mb-3 mb-md-0">
                      {" "}
                      <img
                        class="img-fluid rounded align-top"
                        src={hotelDataSelected?.HotelPicture}
                        title="Standard Room"
                        alt="Standard Room"
                      />{" "}
                    </div>
                    <div class="col-12 col-md-7">
                      <h4 class="text-5">{blockRoomData[0]?.HotelName}</h4>
                      <p className="text-muted mb-1" id="hotel-address">
                        <i class="fas fa-map-marker-alt"></i>
                        {blockRoomData[0]?.AddressLine1 +
                          blockRoomData[0]?.AddressLine2}
                      </p>
                      <ul class="list-inline text-muted mb-2">
                        <li class="list-inline-item">
                          <span class="me-1 text-black-50">
                            <i class="fas fa-home"></i>
                          </span>{" "}
                          {blockRoomData[0]?.HotelRoomsDetails[0]?.RoomTypeName}
                        </li>
                        <li class="list-inline-item">
                          <span class="me-1 text-black-50">
                            <i class="fas fa-user"></i>
                          </span>{" "}
                          {localData[0]?.RoomGuests[0]?.NoOfAdults +
                            localData[0]?.RoomGuests[0]?.NoOfChild}{" "}
                          guest(s)
                        </li>
                      </ul>
                    </div>
                    <div class="col-12 col-md-2 d-flex">
                      <div class="reviews ms-md-auto">
                        {" "}
                        <span class="reviews-score px-2 py-1 rounded fw-600 d-inline-block text-light">
                          4.7
                        </span>{" "}
                      </div>
                    </div>
                  </div>
                  <hr class="my-4" />
                  <div class="row">
                    <div class="col mb-2">
                      <form id="bookingHotels" method="post">
                        <div class="row g-3 mb-2">
                          <div class="col-md-6 col-lg">
                            <label class="form-label" for="hotelsCheckIn">
                              Check In
                            </label>
                            <div class="position-relative checkoutdate">
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
                              {/* <span class="icon-inside">
                                <i class="far fa-calendar-alt"></i>
                              </span>{" "} */}
                            </div>
                          </div>
                          <div class="col-md-6 col-lg">
                            <label class="form-label" for="hotelsCheckOut">
                              Check Out
                            </label>
                            <div class="position-relative checkoutdate">
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
                              {/* <span class="icon-inside">
                                <i class="far fa-calendar-alt"></i>
                              </span>{" "} */}
                            </div>
                          </div>
                          <div class="col-md-6 col-lg">
                            <div class="travellers-class">
                              <label
                                class="form-label"
                                for="hotelsTravellersClass"
                              >
                                Rooms & Guests
                              </label>
                              <div class="position-relative roomsnguests">
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
                                    <div class="col-sm-5">
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
                                          readonly=""
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
                                    <div class="col-sm-7">
                                      <p class="mb-sm-0">
                                        Adults{" "}
                                        <small class="text-muted">
                                          (12+ yrs)
                                        </small>
                                      </p>
                                    </div>
                                    <div class="col-sm-5">
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
                                    <div class="col-sm-7">
                                      <p class="mb-sm-0">
                                        Children{" "}
                                        <small class="text-muted">
                                          (1-12 yrs)
                                        </small>
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
                                          value="0"
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
                                  <div class="d-grid">
                                    <button
                                      class="btn btn-primary submit-done mt-3"
                                      type="button"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6 col-lg d-grid align-items-end updatebtn">
                            <button
                              class="btn btn-outline-primary shadow-none"
                              type="submit"
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <hr />
                  <h3 class="text-5 mb-4 mt-4">Hotels Rules</h3>
                  <div
                    class="row mb-4"
                    id="hotel-policy-details"
                    style={{ padding: "0 1rem" }}
                  >
                    {/* {blockRoomData.length > 0 &&
                      he.decode(blockRoomData[0]?.HotelPolicyDetail)} */}
                    {/* <div class="col-6 col-xl-4">
                      <span class="text-muted text-3 me-2">
                        <i class="fas fa-paw"></i>
                      </span>
                      Pets are not allowed
                    </div>
                    <div class="col-6 col-xl-4">
                      <span class="text-muted text-3 me-2">
                        <i class="fas fa-sign-in-alt"></i>
                      </span>
                      Checkin Time 12:00 PM
                    </div>
                    <div class="col-6 col-xl-4">
                      <span class="text-muted text-3 me-2">
                        <i class="fas fa-sign-out-alt"></i>
                      </span>
                      CheckOut Time 12:00 AM
                    </div> */}
                  </div>

                  <div className="mainform">
                    <h2>Enter User Details</h2>
                    <div className="form">
                      <div className="elements">
                        <label for="username">Username:</label>
                        <div>
                          <TextField
                            required
                            id="standard-full-width username"
                            value={username}
                            onChange={(e) => {
                              setUsername(e.target.value);
                              console.log(e.target.value);
                            }}
                            variant="outlined"
                          />
                        </div>
                        {/* <input id="username" value={username} onChange={(e) => { setUsername(e.target.value); console.log(e.target.value) }} type="text" name="username" /> */}
                      </div>

                      <div className="elements">
                        <label for="email">Email Id:</label>
                        <div>
                          <TextField
                            required
                            id="standard-full-width useremail"
                            value={useremail}
                            onChange={(e) => {
                              setUseremail(e.target.value);
                              console.log(e.target.value);
                            }}
                            variant="outlined"
                          />
                        </div>
                      </div>

                      <div className="elements">
                        <label for="confirmemail">Confirm Email Id:</label>
                        <div>
                          <TextField
                            required
                            id="standard-full-width outlined-error-helper-text confirmmail"
                            value={confirmmail}
                            onChange={(e) => {
                              setConfirmmail(e.target.value);
                              if (e.target.value === useremail) {
                                console.log("emails match");
                              }
                            }}
                            error={useremail === confirmmail ? false : true}
                            helperText={
                              useremail === confirmmail
                                ? " "
                                : "Emails Don't Match"
                            }
                            label={
                              useremail === confirmmail
                                ? "Emails Match"
                                : "Error"
                            }
                            variant="outlined"
                          />
                        </div>
                      </div>

                      <div className="elements">
                        <label for="phone">Phone Number:</label>
                        <div>
                          <TextField
                            required
                            id="standard-full-width userphone"
                            value={userphone}
                            onChange={(e) => {
                              setUserphone(e.target.value);
                              console.log(e.target.value);
                            }}
                            variant="outlined"
                          />
                        </div>
                      </div>

                      <div className="elements">
                        <label for="PAN">PAN Number:</label>
                        <div>
                          <TextField
                            required
                            id="standard-full-width UserPAN"
                            value={UserPAN}
                            onChange={(e) => {
                              setUserPAN(e.target.value);
                              console.log(e.target.value);
                            }}
                            variant="outlined"
                          />
                        </div>
                      </div>

                      <div className="elements">
                        <label for="Age">Age:</label>
                        <div>
                          <TextField
                            required
                            id="standard-full-width UserAge"
                            value={UserAge}
                            onChange={(e) => {
                              setUserAge(e.target.value);
                              console.log(e.target.value);
                            }}
                            variant="outlined"
                          />
                        </div>
                      </div>

                      {/* <button type="">Submit</button> */}
                    </div>
                  </div>

                  <div class="alert alert-info mt-4 mb-0">
                    <div class="row g-0">
                      <div class="col-auto">
                        <span class="text-5 me-2">
                          <i class="fas fa-info-circle"></i>
                        </span>
                      </div>
                      <div class="col">
                        <h5 class="alert-heading">
                          Check In Instructions Lisque persius interesset his
                          et, in quot quidam persequeris vim, ad mea essent
                          possim iriure. Mutat tacimates id sit. Ridens
                          mediocritatem ius an, eu nec magna imperdiet.
                          Mediocrem qualisque in has.{" "}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <aside class="col-lg-4 mt-4 mt-lg-0 asidetag">
                <div class="bg-white shadow-md rounded p-3">
                  <h3 class="text-5 mb-3">Invoice Details</h3>
                  <hr class="mx-n3" />
                  <ul class="list-unstyled">
                    <li class="mb-2 fw-500">
                      Base price{" "}
                      <span class="float-end text-4 fw-500 text-dark">
                        {
                          blockRoomData[0]?.HotelRoomsDetails[0]?.Price
                            ?.RoomPrice
                        }
                      </span>
                      <br />
                      <span class="text-muted text-1 fw-400">
                        {`For ${localData[0]?.NoOfNights} Night(s), ${
                          localData[0]?.NoOfRooms
                        } Room(s), ${
                          localData[0]?.RoomGuests[0]?.NoOfAdults +
                          localData[0]?.RoomGuests[0]?.NoOfChild
                        } Guest(s)`}
                      </span>
                    </li>
                    <li class="mb-2 fw-500">
                      Extra Guests Cost{" "}
                      <span class="float-end text-4 fw-500 text-dark">
                        {
                          blockRoomData[0]?.HotelRoomsDetails[0]?.Price
                            ?.ExtraGuestCharge
                        }
                      </span>
                      <br />
                      <span class="text-muted text-1 fw-400">
                        {`For ${localData[0]?.NoOfNights} Night(s), 1 Guest`}
                      </span>
                    </li>
                    <li class="mb-2 fw-500">
                      Taxes & Fees{" "}
                      <span class="float-end text-4 fw-500 text-dark">
                        {(
                          totalPrice +
                          blockRoomData[0]?.HotelRoomsDetails[0]?.Price
                            ?.RoomPrice *
                            +markup
                        ).toFixed(2)}
                      </span>
                    </li>
                  </ul>
                  <div class="text-dark bg-light-4 text-4 fw-600 p-3">
                    {" "}
                    Total Amount{" "}
                    <span class="float-end text-6">
                      ₹
                      {(
                        blockRoomData[0]?.HotelRoomsDetails[0]?.Price
                          .PublishedPriceRoundedOff +
                        blockRoomData[0]?.HotelRoomsDetails[0]?.Price
                          ?.RoomPrice *
                          +markup
                      ).toFixed(2)}
                    </span>{" "}
                  </div>
                  <h3 class="text-4 mb-3 mt-4">Promo Code</h3>
                  <div class="input-group mb-3">
                    <input
                      class="form-control"
                      placeholder="Promo Code"
                      aria-label="Promo Code"
                      type="text"
                    />
                    <button
                      class="btn btn-secondary shadow-none px-3"
                      type="submit"
                    >
                      APPLY
                    </button>
                  </div>
                  <ul class="promo-code">
                    <li>
                      <span class="d-block text-3 fw-600">FLTOFFER</span>Up to
                      $500 Off on your booking. Hurry! Limited period offer.{" "}
                      <a class="text-1" href="">
                        Terms & Conditions
                      </a>
                    </li>
                    <li>
                      <span class="d-block text-3 fw-600">HOTOFFER</span>Up to
                      $500 Off on your booking. Hurry! Limited period offer.{" "}
                      <a class="text-1" href="">
                        Terms & Conditions
                      </a>
                    </li>
                    <li>
                      <span class="d-block text-3 fw-600">SUMMEROFFER</span>Up
                      to $500 Off on your booking. Hurry! Limited period offer.{" "}
                      <a class="text-1" href="">
                        Terms & Conditions
                      </a>
                    </li>
                    <li>
                      <span class="d-block text-3 fw-600">BIGOFFER</span>Up to
                      $500 Off on your booking. Hurry! Limited period offer.{" "}
                      <a class="text-1" href="">
                        Terms & Conditions
                      </a>
                    </li>
                    <li>
                      <span class="d-block text-3 fw-600">FLTOFFER</span>Up to
                      $500 Off on your booking. Hurry! Limited period offer.{" "}
                      <a class="text-1" href="">
                        Terms & Conditions
                      </a>
                    </li>
                    <li>
                      <span class="d-block text-3 fw-600">FLTOFFER</span>Up to
                      $500 Off on your booking. Hurry! Limited period offer.{" "}
                      <a class="text-1" href="">
                        Terms & Conditions
                      </a>
                    </li>
                  </ul>
                  <div class="d-grid paymentdiv">
                    <button
                      class="btn btn-primary paymentbtn"
                      // onclick="location.href='payment.html';"
                      onClick={(e) => {
                        paymentGateway(e);
                      }}
                    >
                      Proceed To Payment
                    </button>
                    <button
                      class="btn btn-primary paymentbtn"
                      // onclick="location.href='payment.html';"
                      onClick={(e) => {
                        payLaterBookNow(e);
                      }}
                    >
                      Pay Later & Book Now
                    </button>
                  </div>
                  <p class="text-muted d-flex align-items-center justify-content-center mt-3 mb-1">
                    <span class="text-4 me-2">
                      <i class="fas fa-ban"></i>
                    </span>{" "}
                    Full refund, 3-day cancellation{" "}
                    <a
                      href=""
                      class="text-3 ms-2"
                      data-bs-toggle="tooltip"
                      title="Lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure. Mutat tacimates id sit."
                    >
                      <i class="far fa-question-circle"></i>
                    </a>{" "}
                  </p>
                </div>
              </aside>
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
    </>
  );
};

export default HotelConfirm;
