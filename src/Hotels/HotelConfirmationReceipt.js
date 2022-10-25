import { Divider } from "antd";
import React, { useEffect, useState } from "react";
import "./HotelConfirmationReceipt.css";
import jsPDF from "jspdf";
import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";

const HotelConfirmationReceipt = (props) => {
  const [propsData, setPropsData] = useState();
  const [hotelBookingDetails, setHotelBookingDetails] = useState([]);
  const [hotelSearchOptions, setHotelSearchOptions] = useState([]);

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

  useEffect(() => {
    gettingData();
    console.log(props.location.state);
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
            <td>{propsData?.bookingReceipt?.BookResult?.InvoiceNumber}</td>
          </tr>
          <tr>
            <td>Name</td>
            <td>
              {hotelBookingDetails[0]?.HotelRoomsDetails[0]?.HotelPassenger[0]
                ?.Title +
                " " +
                hotelBookingDetails[0]?.HotelRoomsDetails[0]?.HotelPassenger[0]
                  ?.FirstName +
                " " +
                hotelBookingDetails[0]?.HotelRoomsDetails[0]?.HotelPassenger[0]
                  ?.LastName}
            </td>
          </tr>
          <tr>
            <td>E-mail</td>
            <td>
              {
                hotelBookingDetails[0]?.HotelRoomsDetails[0]?.HotelPassenger[0]
                  ?.Email
              }
            </td>
          </tr>
          <tr>
            <td>Phone Number</td>
            <td>
              {
                hotelBookingDetails[0]?.HotelRoomsDetails[0]?.HotelPassenger[0]
                  ?.Phoneno
              }
            </td>
          </tr>
          {/* <tr>
          <td>Payment ID</td>
          <td>pay_KCA3ig15VGwxfg</td>
        </tr> */}
          <tr>
            <td>Order ID</td>
            <td>{props.location.state.orderId}</td>
          </tr>
          <tr>
            <td>Booking ID</td>
            <td>{propsData?.bookingReceipt?.BookResult?.BookingId}</td>
          </tr>
          <tr>
            <td>Booking Refrence Number</td>
            <td>{propsData?.bookingReceipt?.BookResult?.BookingRefNo}</td>
          </tr>
          <tr>
            <td>Confirmation Number</td>
            <td>{propsData?.bookingReceipt?.BookResult?.ConfirmationNo}</td>
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
            <td>{hotelBookingDetails[0]?.HotelName}</td>
          </tr>
          <tr>
            <td>Address</td>
            <td>
              {hotelSearchOptions[0]?.CityName +
                ", " +
                hotelSearchOptions[0]?.StateProvince}
            </td>
          </tr>
          <tr>
            <td>Room Type</td>
            <td>
              {hotelBookingDetails[0]?.HotelRoomsDetails[0]?.RoomTypeName}
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
              {hotelBookingDetails[0]?.HotelRoomsDetails[0]?.Price.RoomPrice}
            </td>
          </tr>
          <tr>
            <td>Taxes and Charges</td>
            <td>
              {hotelBookingDetails[0]?.HotelRoomsDetails[0]?.Price?.Tax +
                " + " +
                hotelBookingDetails[0]?.HotelRoomsDetails[0]?.Price
                  ?.OtherCharges}
            </td>
          </tr>
          <tr>
            <td>Total</td>
            <td>
              {
                hotelBookingDetails[0]?.HotelRoomsDetails[0]?.Price
                  ?.PublishedPriceRoundedOff
              }
            </td>
          </tr>
        </table>
      </div>
    </>
  );
};

export default HotelConfirmationReceipt;
