import React, { useEffect, useState } from "react";
import { Card, CardHeader, Button, List, Dialog, Bar } from "@ui5/webcomponents-react";
import moment from "moment";

const FavouriteDesk = () => {
  const [userId, setUserId] = useState("");
  const [favouriteDesks, setFavouriteDesks] = useState([]);
  const [bookingsToday, setBookingsToday] = useState([]);
  const [userHasBookingToday, setUserHasBookingToday] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const fetchFavouriteDesks = () => {
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/desks/favouritesbyuser?user_id=${userId}`)
        .then((response) => response.json())
        .then((data) => setFavouriteDesks(data))
        .catch((error) => console.error(error));
    }
  };

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
    fetchFavouriteDesks();
  }, [userId]);

  useEffect(() => {
    fetchBookingsToday();
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
          setBookingsToday((prevBookings) => [...prevBookings, { desk_id: deskId, user_id: userId }]);
          setUserHasBookingToday(true);
          fetchFavouriteDesks();
          setDialogMessage("Desk Booked Successfully.");
        } catch (error) {
          setBookingsToday((prevBookings) => [...prevBookings, { desk_id: deskId, user_id: userId }]);
          setUserHasBookingToday(true);
          fetchFavouriteDesks();
          setDialogMessage("Desk Booked Successfully.");
        }
        setDialogOpen(true);
      })
      .catch((error) => {
        console.error("Error:", error);
        setDialogMessage("Error booking the desk.");
        setDialogOpen(true);
      });
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
        fetchFavouriteDesks();
        setDialogMessage(`Desk ${deskId} removed from favourites`);
        setDialogOpen(true);
      })
      .catch((error) => {
        console.error(error);
        setDialogMessage("Error removing the desk from favourites.");
        setDialogOpen(true);
      });
  };

  const closeDialog = () => {
    setDialogOpen(false);
    window.location.reload();
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

      <Dialog
        headerText="Book A Desk"
        footer={
          <Bar
            endContent={<Button design="Emphasized" onClick={closeDialog}>OK</Button>}
          />
        }
        open={dialogOpen}
        onAfterClose={closeDialog}
      >
        <p>{dialogMessage}</p>
      </Dialog>
    </Card>
  );
};

export default FavouriteDesk;
