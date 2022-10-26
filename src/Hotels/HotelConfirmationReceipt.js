import { Divider } from "antd";
import React, { useEffect, useState } from "react";
import "./HotelConfirmationReceipt.css";
import jsPDF from "jspdf";
import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
import axios from "axios";
import { useHistory } from "react-router-dom";

const HotelConfirmationReceipt = (props) => {
  const [propsData, setPropsData] = useState();
  const [hotelBookingDetails, setHotelBookingDetails] = useState([]);
  const [hotelSearchOptions, setHotelSearchOptions] = useState([]);
  const [hotelBookingData, setHotelBookingData] = useState([]);
  const [markup, setMarkup] = useState(0);
  const history = useHistory();

  function printDocument() {
    const doc = new jsPDF();

    //get html
    const pdfTable = document.getElementById("maindiv");
    //html to pdf format
    var html = htmlToPdfmake(pdfTable.innerHTML);

    const documentDefinition = { content: html };
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(documentDefinition).open();
  }

  function gettingData() {
    const hotelBookingDetailsFun = JSON.parse(
      localStorage.getItem("hotel-booking-confirm-details")
    );
    const hotelSearchOptionsFun = JSON.parse(
      localStorage.getItem("hotel-search-options")
    );

    console.log(hotelBookingDetailsFun);
    console.log(hotelSearchOptionsFun);

    setHotelBookingDetails([hotelBookingDetailsFun]);
    setHotelSearchOptions([hotelSearchOptionsFun]);
    console.log(
      hotelBookingDetails?.HotelRoomsDetails[0]?.HotelPassenger[0]?.Title
    );
    setPropsData(props.location.state);
  }

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

  useEffect(() => {
    // gettingData();
    console.log(props.location.state);
    getMarkup();
    setHotelBookingData([props.location.state]);
  }, []);

  return (
    <>
      <button
        className="downloadButton"
        onClick={() => {
          printDocument();
        }}
      >
        Download Bill
      </button>

      <div id="maindiv" className="maindiv">
        <h1>QuickAI</h1>
        <br />
        <br />
        <table>
          <tr>
            <td>Invoice Number</td>
            <td>
              {
                hotelBookingData[0]?.bookingReceipt?.GetBookingDetailResult
                  ?.InvoiceNo
              }
            </td>
          </tr>
          <tr>
            <td>Name</td>
            <td>
              {`${
                hotelBookingData[0]?.bookingReceipt?.GetBookingDetailResult
                  ?.HotelRoomsDetails[0]?.HotelPassenger[0]?.FirstName
              } ${
                hotelBookingData[0]?.bookingReceipt?.GetBookingDetailResult
                  ?.HotelRoomsDetails[0]?.HotelPassenger[0]?.MiddleName !== null
                  ? hotelBookingData[0]?.bookingReceipt?.GetBookingDetailResult
                      ?.HotelRoomsDetails[0]?.HotelPassenger[0]?.MiddleName
                  : ""
              } ${
                hotelBookingData[0]?.bookingReceipt?.GetBookingDetailResult
                  ?.HotelRoomsDetails[0]?.HotelPassenger[0]?.LastName
              }`}
            </td>
          </tr>
          <tr>
            <td>E-mail</td>
            <td>
              {
                hotelBookingData[0]?.bookingReceipt?.GetBookingDetailResult
                  ?.HotelRoomsDetails[0]?.HotelPassenger[0]?.Email
              }
            </td>
          </tr>
          <tr>
            <td>Phone Number</td>
            <td>
              {
                hotelBookingData[0]?.bookingReceipt?.GetBookingDetailResult
                  ?.HotelRoomsDetails[0]?.HotelPassenger[0]?.Phoneno
              }
            </td>
          </tr>
          {/* <tr>
          <td>Payment ID</td>
          <td>pay_KCA3ig15VGwxfg</td>
        </tr> */}
          <tr>
            <td>Order ID</td>
            <td>{hotelBookingData[0]?.orderId}</td>
          </tr>
          <tr>
            <td>Booking ID</td>
            <td>
              {
                hotelBookingData[0]?.bookingReceipt?.GetBookingDetailResult
                  ?.BookingId
              }
            </td>
          </tr>
          <tr>
            <td>Booking Refrence Number</td>
            <td>
              {
                hotelBookingData[0]?.bookingReceipt?.GetBookingDetailResult
                  ?.BookingRefNo
              }
            </td>
          </tr>
          <tr>
            <td>Confirmation Number</td>
            <td>
              {
                hotelBookingData[0]?.bookingReceipt?.GetBookingDetailResult
                  ?.ConfirmationNo
              }
            </td>
          </tr>
          <tr>
            <td>Booking Duration</td>
            <td>{hotelSearchOptions[0]?.NoOfNights} Night(s)</td>
          </tr>
          <tr>
            <td>Booking from-to</td>
            <td>
              {hotelSearchOptions[0]?.CheckInDate +
                " - " +
                hotelSearchOptions[0]?.CheckOutDate}
            </td>
          </tr>
        </table>

        <br />
        <br />

        <h4>Room Details</h4>
        <table>
          <tr>
            <td>Hotel</td>
            <td>
              {
                hotelBookingData[0]?.bookingReceipt?.GetBookingDetailResult
                  ?.HotelName
              }
            </td>
          </tr>
          <tr>
            <td>Address</td>
            <td>
              {`${hotelBookingData[0]?.bookingReceipt?.GetBookingDetailResult?.AddressLine1} ${hotelBookingData[0]?.bookingReceipt?.GetBookingDetailResult?.AddressLine2}
              `}
            </td>
          </tr>
          <tr>
            <td>Room Type</td>
            <td>
              {
                hotelBookingData[0]?.bookingReceipt?.GetBookingDetailResult
                  ?.HotelRoomsDetails[0]?.RoomTypeName
              }
            </td>
          </tr>
        </table>

        <br />
        <br />

        <h4>Bill Details</h4>
        <table>
          <tr>
            <td>Base Price</td>
            <td>
              {
                hotelBookingData[0]?.bookingReceipt?.GetBookingDetailResult
                  ?.HotelRoomsDetails[0]?.Price?.RoomPrice
              }
            </td>
          </tr>
          <tr>
            <td>Taxes and Charges</td>
            <td>
              {`${
                hotelBookingData[0]?.bookingReceipt?.GetBookingDetailResult
                  ?.HotelRoomsDetails[0]?.Price?.GST?.TaxableAmount
              }(GST) + ${
                hotelBookingData[0]?.bookingReceipt?.GetBookingDetailResult
                  ?.HotelRoomsDetails[0]?.Price?.Tax
              }(Tax) + ${(
                +hotelBookingData[0]?.bookingReceipt?.GetBookingDetailResult
                  ?.HotelRoomsDetails[0]?.Price?.RoomPrice * +markup
              ).toFixed(2)}(Agent Commission)`}
            </td>
          </tr>
          <tr>
            <td>Total</td>
            <td>
              {(
                hotelBookingData[0]?.bookingReceipt?.GetBookingDetailResult
                  ?.HotelRoomsDetails[0]?.Price?.PublishedPrice +
                hotelBookingData[0]?.bookingReceipt?.GetBookingDetailResult
                  ?.HotelRoomsDetails[0]?.Price?.PublishedPrice *
                  +markup
              ).toFixed(2)}
            </td>
          </tr>
        </table>
      </div>

      <button
        className="downloadButton"
        onClick={() => {
          history.push("/hotelsearch", { replace: true });
        }}
      >
        Go To Home
      </button>
    </>
  );
};

export default HotelConfirmationReceipt;
