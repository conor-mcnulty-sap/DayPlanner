import React, { useEffect, useState } from "react";
import { Card, CardHeader, List, Button } from "@ui5/webcomponents-react";

const CurrentDesk = ({ userId = "1" }) => {
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/bookings/getbookinguserdate?user_id=${userId}&date=${date}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("No Desk Booked!");
        }
        return response.json();
      })
      .then(data => setBooking(data))
      .catch(error => {
        setError(error.message);
        setBooking(null);
      });
  }, [userId, date]);

  if (booking && booking.length > 0) {
    return (
      <Card
        header={<CardHeader titleText="Current Desk" />}
      >
        <List
          headerText={booking[0].desk_id} // desk.id
        >
          <Button design="Negative">Cancel Booking</Button>
        </List>
      </Card>
    );
  } else {
    return (
      <Card
        header={<CardHeader titleText="Current Desk" />}
        style={{
          width: "375px",
        }}
      >
        <List headerText="No desk booked">
          <Button design="Positive">Book a Desk</Button>
        </List>
      </Card>
    );
  }
};

export default CurrentDesk;