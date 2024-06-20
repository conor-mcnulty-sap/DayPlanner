import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, List, Button } from "@ui5/webcomponents-react";

const CurrentDesk = () => {
  const [userId, setUserId] = useState("");
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  const today = new Date();
  const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      setUserId(userDetails.id);
    } else {
      setError("User details not found in local storage");
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/bookings/getbookinguserdate?user_id=${userId}&date=${date}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("No Desk Booked!");
          }
          return response.json();
        })
        .then(data => {
          setBooking(data);
          if (data && data.length > 0) {
            localStorage.setItem('deskId', data[0].desk_id); // Store deskId in local storage
            console.log("Desk stored in local storage:", data[0].desk_id);
          } else {
            localStorage.setItem('deskId', null); // Set deskId to null in local storage
            console.log("No desk found, set local storage deskId to null");
          }
        })
        .catch(error => {
          setError(error.message);
          setBooking(null);
          localStorage.setItem('deskId', null); // Set deskId to null in local storage
          console.log("No desk found, set local storage deskId to null");
        });
    }
  }, [userId, date]);
  

  const handleCancelBooking = () => {
    if (userId && booking && booking.length > 0) {
      const deskId = booking[0].desk_id;
      const url = `${process.env.REACT_APP_API_URL}/api/bookings/removebooking?user_id=${userId}&desk_id=${deskId}&date=${date}`;
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      };
  
      fetch(url, options)
        .then(response => {
          console.log("Response status:", response.status);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        })
        .then(() => {
          console.log("Booking canceled successfully");
          setBooking(null);
          localStorage.removeItem('deskId');
    
          window.location.reload();
        })
        .catch(error => console.error("Error canceling booking:", error));
    }
  };
  

  if (booking && booking.length > 0) {
    return (
      <Card
        header={<CardHeader titleText="Current Desk" />}
      >
        <List
          headerText={booking[0].desk_id} 
        >
          <Button design="Negative" onClick={handleCancelBooking}>Cancel Booking</Button>
        </List>
      </Card>
    );
  } else {
    return (
      <Card
        header={<CardHeader titleText="Current Desk" />}
      >
        <List headerText="No Desk Booked">
          <Link to="/bookdesk"><Button design="Positive">Book a Desk</Button></Link>
        </List>
      </Card>
    );
  }
};

export default CurrentDesk;
