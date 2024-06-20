import React, { useEffect, useState } from "react";
import { Card, CardHeader, Button, List } from "@ui5/webcomponents-react";
import moment from "moment";

const FavouriteDesk = () => {
  const [userId, setUserId] = useState("");
  const [favouriteDesks, setFavouriteDesks] = useState([]);
  const [bookingsToday, setBookingsToday] = useState([]);
  const [userHasBookingToday, setUserHasBookingToday] = useState(false);

  // Function to fetch favourite desks
  const fetchFavouriteDesks = () => {
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/desks/favouritesbyuser?user_id=${userId}`)
        .then((response) => response.json())
        .then((data) => setFavouriteDesks(data))
        .catch((error) => console.error(error));
    }
  };

  // Function to fetch bookings for today
  const fetchBookingsToday = () => {
    const today = moment().format("YYYY-MM-DD");
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/bookings/bookingsbydate?date=${today}`)
        .then((response) => response.json())
        .then((data) => {
          setBookingsToday(data);
          const userBooking = data.find((booking) => booking.user_id === userId);
          setUserHasBookingToday(!!userBooking);
        })
        .catch((error) => console.error(error));
    }
  };

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      setUserId(userDetails.id);
    }
  }, []);

  useEffect(() => {
    fetchFavouriteDesks(); // Fetch favourite desks on mount or when userId changes
  }, [userId]);

  useEffect(() => {
    fetchBookingsToday(); // Fetch bookings today on mount or when userId changes
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
          // Update the state after booking
          setBookingsToday((prevBookings) => [...prevBookings, { desk_id: deskId, user_id: userId }]);
          setUserHasBookingToday(true);
          // Refresh favourite desks after booking
          fetchFavouriteDesks();
          alert("Desk Booked Successfully.");
          // Reload the page to reflect changes
          window.location.reload();
        } catch (error) {
          console.log("Response (raw text):", text);
          setBookingsToday((prevBookings) => [...prevBookings, { desk_id: deskId, user_id: userId }]);
          setUserHasBookingToday(true);
          // Refresh favourite desks after booking
          fetchFavouriteDesks();
          alert("Desk Booked Successfully.");
          // Reload the page to reflect changes
          window.location.reload();
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
        // Refresh favourite desks after unfavouriting
        fetchFavouriteDesks();
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
            let buttonDesign;
            let buttonText;

            if (userHasBookingToday) {
              if (isBookedByCurrentUser) {
                buttonDesign = "Negative";
                buttonText = "Booked by You";
              } else {
                buttonDesign = "Negative";
                buttonText = "Booking Unavailable";
              }
            } else if (booking) {
              buttonDesign = "Negative";
              buttonText = "Booking Unavailable";
            } else {
              buttonDesign = "Positive";
              buttonText = "Book Desk";
            }

            return (
              <Card key={desk.desk_id} header={<CardHeader titleText={`Desk ID: ${desk.desk_id}`} />}>
                <Button
                  design={buttonDesign}
                  onClick={() => {
                    if (!userHasBookingToday && !booking) bookDesk(desk.desk_id);
                  }}
                  style={{ marginRight: "20px" }}
                  disabled={userHasBookingToday}
                >
                  {buttonText}
                </Button>
                <Button design="Negative" onClick={() => handleUnfavouriteDesk(desk.desk_id)}>
                  Unfavourite
                </Button>
              </Card>
            );
          })
        ) : (
          <Card header={<CardHeader titleText="No Favourite Desks!" />}>
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
