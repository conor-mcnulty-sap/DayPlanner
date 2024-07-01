import React, { useEffect, useState } from "react";
import { Card, CardHeader, List, Button, Dialog, Bar } from "@ui5/webcomponents-react";
import moment from "moment";

const LastBooked = () => {
  const [userId, setUserId] = useState("");
  const [lastBooked, setLastBooked] = useState([]);
  const [isBookedByCurrentUserToday, setIsBookedByCurrentUserToday] = useState(false);
  const [isDeskBooked, setIsDeskBooked] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

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
          setLastBooked(data); // Update lastBooked state after booking
          // Modify dialog message based on booking status
          if (isBookedByCurrentUserToday) {
            setDialogMessage("Desk already booked by you today.");
          } else {
            setDialogMessage("Desk booked successfully.");
          }
        } catch (error) {
          console.log("Response (raw text):", text);
          // Modify dialog message based on booking status
          if (isBookedByCurrentUserToday) {
            setDialogMessage("Desk already booked by you today.");
          } else {
            setDialogMessage("Desk booked successfully.");
          }
        }
        setDialogOpen(true); // Open the dialog
      })
      .catch((error) => {
        console.error("Error:", error);
        setDialogMessage("Error booking the desk.");
        setDialogOpen(true);
      });
  };

  const closeDialog = () => {
    setDialogOpen(false);
    window.location.reload(); // Reload the page to reflect changes
  };

  return (
    <Card header={<CardHeader titleText="Last Booked Desk" />}>
      <List headerText={`${lastBooked.length > 0 ? `Desk ID: ${lastBooked[0].desk_id}` : "No desk booked"}`}>
        {lastBooked.length > 0 && isDeskBooked ? (
          <Button design="Negative" disabled={isBookedByCurrentUserToday}>Booked by You</Button>
        ) : (
          <Button design="Positive" onClick={bookDesk}>Book a Desk</Button>
        )}
      </List>

      <Dialog
        headerText="Book A Desk"
        footer={
          <Bar endContent={<Button design="Emphasized" onClick={closeDialog}>OK</Button>} />
        }
        open={dialogOpen}
        onAfterClose={closeDialog}
      >
        <p>{dialogMessage}</p>
      </Dialog>
    </Card>
  );
};

export default LastBooked;
