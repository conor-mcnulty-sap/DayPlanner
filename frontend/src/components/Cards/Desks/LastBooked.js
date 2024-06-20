import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  List,
  Button,
  StandardListItem,
} from "@ui5/webcomponents-react";
import moment from "moment";

const LastBooked = () => {
  const [userId, setUserId] = useState("");
  const [lastBooked, setLastBooked] = useState([]);
  const [isBookedByCurrentUserToday, setIsBookedByCurrentUserToday] = useState(false);
  const [isDeskBooked, setIsDeskBooked] = useState(false);

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      setUserId(userDetails.id);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetch(
        `${process.env.REACT_APP_API_URL}/api/bookings/lastbooked?user_id=${userId}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Last booked desk:", data); 
          setLastBooked(data);
        })
        .catch((error) => console.error(error));
    }
  }, [userId]);

  useEffect(() => {
    if (lastBooked && lastBooked.length > 0) {
      const today = moment().format("YYYY-MM-DD");
      fetch(
        `${process.env.REACT_APP_API_URL}/api/bookings/bookingsbydate?date=${today}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Desks booked today:", data); 
          const deskBookedToday = data.find(booking => booking.desk_id === lastBooked[0].desk_id);
          console.log("deskbookedToday:", deskBookedToday);
          setIsDeskBooked(!!deskBookedToday);
          setIsBookedByCurrentUserToday(deskBookedToday && deskBookedToday.user_id === userId);
        })
        .catch((error) => console.error(error));
    }
  }, [lastBooked, userId]);

  const bookDesk = () => {
    const deskId = lastBooked[0].desk_id;
    const today = moment().format("YYYY-MM-DD");
    const dateRange = `${today}-${today}`;
  
    fetch(`${process.env.REACT_APP_API_URL}/api/bookings/bookdesk?user_id=${userId}&desk_id=${deskId}&date=${dateRange}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, desk_id: deskId, date: dateRange }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        try {
          const data = JSON.parse(text); // Try to parse as JSON
          console.log("Response (parsed as JSON):", data);
          alert("Desk Booked Successfully.");
          // Reload the page to reflect changes
          window.location.reload();
        } catch (error) {
          console.log("Response (raw text):", text);
          alert("Desk Booked Successfully.");
          // Reload the page to reflect changes
          window.location.reload();
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <Card header={<CardHeader titleText="Last Booked Desk" />}>
      <List headerText={`${lastBooked.length > 0 ? lastBooked[0].desk_id : "No desk booked"}`}>
        {lastBooked.length > 0 && isDeskBooked ? (
          <Button design="Negative">{isBookedByCurrentUserToday ? "Booked by You" : "Currently Unavailable"}</Button>
        ) : (
          <Button design="Positive" onClick={bookDesk}>Book a Desk</Button>
        )}
      </List>
    </Card>
  );
};

export default LastBooked;
