import React, { useEffect, useState } from "react";
import { Card, CardHeader, Button, List } from "@ui5/webcomponents-react";
import moment from "moment";

const FavouriteDesk = () => {
  const [userId, setUserId] = useState("");
  const [favouriteDesks, setFavouriteDesks] = useState([]);
  const [bookingsToday, setBookingsToday] = useState([]);
  const [userHasBookingToday, setUserHasBookingToday] = useState(false);

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      setUserId(userDetails.id);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/desks/favouritesbyuser?user_id=${userId}`)
        .then((response) => response.json())
        .then((data) => setFavouriteDesks(data))
        .catch((error) => console.error(error));
    }
  }, [userId]);

  useEffect(() => {
    const today = moment().format("YYYY-MM-DD");
    fetch(`${process.env.REACT_APP_API_URL}/api/bookings/bookingsbydate?date=${today}`)
      .then((response) => response.json())
      .then((data) => {
        setBookingsToday(data);
        const userBooking = data.find((booking) => booking.user_id === userId);
        setUserHasBookingToday(!!userBooking);
      })
      .catch((error) => console.error(error));
  }, [userId]);

  const bookDesk = (deskId) => {
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
          const data = JSON.parse(text);
          console.log("Response (parsed as JSON):", data);
        } catch (error) {
          console.log("Response (raw text):", text);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleUnfavouriteDesk = (deskId) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/desks/removefavourite?desk_id=${deskId}&user_id=${userId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setFavouriteDesks(favouriteDesks.filter((desk) => desk.desk_id !== deskId));
        console.log(`Desk ${deskId} removed from favourites`);
      })
      .catch((error) => console.error(error));
  };

  return (
    <Card header={<CardHeader titleText="Favourite Desks" />}>
      <List>
        {favouriteDesks && favouriteDesks.length > 0 ? (
          favouriteDesks.map((desk) => {
            const booking = bookingsToday.find((b) => b.desk_id === desk.desk_id);
            const isBookedByCurrentUser = booking && booking.user_id === userId;

            return (
              <Card key={desk.desk_id} header={<CardHeader titleText={`Desk ID: ${desk.desk_id}`} />}>
                <Button
                  design={booking || userHasBookingToday ? "Negative" : "Positive"}
                  onClick={() => {
                    if (!booking && !userHasBookingToday) bookDesk(desk.desk_id);
                  }}
                  style={{ marginRight: "20px" }}
                  disabled={booking || userHasBookingToday}
                >
                  {userHasBookingToday
                    ? "Booking Unavailable"
                    : booking
                    ? isBookedByCurrentUser
                      ? "Booked by Current User"
                      : "Currently Unavailable"
                    : "Book a Desk"}
                </Button>
                <Button design="Negative" onClick={() => handleUnfavouriteDesk(desk.desk_id)}>
                  Unfavourite
                </Button>
              </Card>
            );
          })
        ) : (
          <Card header={<CardHeader titleText="No Favourite Chosen!" />}>
            <Button design="Positive" style={{ marginRight: "20px" }}>
              Book a Desk
            </Button>
          </Card>
        )}
      </List>
    </Card>
  );
};

export default FavouriteDesk;
