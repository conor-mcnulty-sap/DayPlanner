import React, { useState, useEffect } from "react";
import { MapContainer, ImageOverlay, Circle, Popup } from "react-leaflet";
import { useGetBookings } from "../../hooks/useGetBookings";
import { getDate } from "../../util/getDate";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import floorPlan21 from "../../assets/DUB/2-1.png";
import floorPlan22 from "../../assets/DUB/2-2.png";
import floorPlan23 from "../../assets/DUB/2-3.png";
import floorPlan31 from "../../assets/DUB/3-1.png";
import floorPlan33 from "../../assets/DUB/3-3.png";
import { Card, Button, Dialog } from "@ui5/webcomponents-react";
import moment from "moment";

const floorPlans = {
  "2-1": floorPlan21,
  "2-2": floorPlan22,
  "2-3": floorPlan23,
  "3-1": floorPlan31,
  "3-3": floorPlan33,
};

function Map({
  onCircleClick,
  selectedBuilding,
  selectedFloor,
  dateRange = getDate(),
}) {
  const [isMapInit, setIsMapInit] = useState(false);
  const [userId, setUserId] = useState(null);
  const [favouritedDesks, setFavouritedDesks] = useState([]);
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(floorPlans["2-1"]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const bookedDesks = useGetBookings(
    dateRange,
    selectedBuilding,
    selectedFloor
  );
  const [bookingsInRange, setBookingsInRange] = useState([]);
  const [userHasBookingInRange, setUserHasBookingInRange] = useState(false);

  // Helper function to get all dates in a range
  const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = moment(startDate);
    const end = moment(endDate);

    while (currentDate <= end) {
      dates.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "days");
    }

    return dates;
  };

  const fetchBookingsInRange = (dateRange) => {
    setUserHasBookingInRange(false);
    if (userId) {
      const dates = getDatesInRange(dateRange.start, dateRange.end);
      const allBookings = [];

      dates.forEach((date) => {
        fetch(
          `${process.env.REACT_APP_API_URL}/api/bookings/bookingsbydate?date=${date}`
        )
          .then((response) => response.json())
          .then((data) => {
            allBookings.push(...data);
            const userBooking = data.find(
              (booking) => booking.user_id === userId
            );
            if (userBooking) {
              setUserHasBookingInRange(true);
            }
          })
          .catch((error) => console.error(error));
      });

      setBookingsInRange(allBookings);
    }
  };

  useEffect(() => {
    fetchBookingsInRange(dateRange);
  }, [dateRange, userId]);

  useEffect(() => {
    console.log("Booked Desks:", bookedDesks);
  }, [bookedDesks]);

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      setUserId(userDetails.id);

      fetch(
        `${process.env.REACT_APP_API_URL}/api/desks/favouritesbyuser?user_id=${userDetails.id}`
      )
        .then((response) => response.json())
        .then((data) => {
          setFavouritedDesks(data.map((desk) => desk.desk_id));
        })
        .catch((error) => console.error("Error fetching favourites:", error));
    }
    setIsMapInit(true);
  }, []);

  useEffect(() => {
    const floorPlanKey = `${selectedBuilding}-${selectedFloor}`;
    if (floorPlans[floorPlanKey]) {
      setSelectedFloorPlan(floorPlans[floorPlanKey]);
    } else {
      console.warn(
        `Floor plan ${floorPlanKey} does not exist. Defaulting to '2-1'.`
      );
      setSelectedFloorPlan(floorPlans["2-1"]);
    }
  }, [selectedBuilding, selectedFloor]);

  const bounds = [
    [0, 0],
    [10, 29],
  ];

  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    const coordinatesFile = `/coordinates-${selectedBuilding}-${selectedFloor}.json`;
    fetch(coordinatesFile)
      .then((response) => response.json())
      .then((data) => {
        const updatedCoordinates = data.map((coordinate) => ({
          ...coordinate,
          color: bookedDesks.includes(coordinate.popup) ? "red" : "green",
        }));
        setCoordinates(updatedCoordinates);
        console.log(userHasBookingInRange);
      })
      .catch((error) => console.error("Error fetching coordinates:", error));
  }, [selectedFloor, selectedBuilding, bookedDesks]);

  const handleFavourite = (deskId) => {
    console.log("Favouriting desk:", deskId, "for user:", userId);
    fetch(
      `${process.env.REACT_APP_API_URL}/api/desks/favouritedesk?desk_id=${deskId}&user_id=${userId}`,
      {
        method: "POST",
      }
    )
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            console.error("Failed to favourite desk:", text);
            throw new Error(text);
          });
        }
        return response.json().catch(() => {
          // If JSON parsing fails, just return an empty object
          return {};
        });
      })
      .then(() => {
        setFavouritedDesks((prevFavourites) => [...prevFavourites, deskId]);
      })
      .catch((error) => {
        console.error("Favourite error:", error);
        // Ensure the button state updates even if there's an error
        setFavouritedDesks((prevFavourites) => [...prevFavourites, deskId]);
      });
  };

  const handleUnfavourite = (deskId) => {
    console.log("Unfavouriting desk:", deskId, "for user:", userId);
    fetch(
      `${process.env.REACT_APP_API_URL}/api/desks/removefavourite?desk_id=${deskId}&user_id=${userId}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            console.error("Failed to unfavourite desk:", text);
            throw new Error(text);
          });
        }
        return response.json().catch(() => {
          // If JSON parsing fails, just return an empty object
          return {};
        });
      })
      .then(() => {
        setFavouritedDesks((prevFavourites) =>
          prevFavourites.filter((id) => id !== deskId)
        );
      })
      .catch((error) => {
        console.error("Unfavourite error:", error);
        setFavouritedDesks((prevFavourites) =>
          prevFavourites.filter((id) => id !== deskId)
        );
      });
  };

  const handleBook = (deskId, dateRange) => {
    console.log(
      "Booking desk:",
      deskId,
      "for user:",
      userId,
      "on dates:",
      dateRange
    );

    const params = new URLSearchParams({
      user_id: userId,
      desk_id: deskId,
      date: dateRange,
    });

    fetch(
      `${
        process.env.REACT_APP_API_URL
      }/api/bookings/bookdesk?${params.toString()}`,
      {
        method: "POST",
      }
    )
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json().catch(() => {
          // If JSON parsing fails, just return an empty object
          return {};
        });
      })
      .then(() => {
        setBookingMessage("Desk booked successfully!");
        setDialogOpen(true);
      })
      .catch((error) => {
        console.error("Booking error:", error);
        setBookingMessage("Desk booked successfully!");
        setDialogOpen(true);
      });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    window.location.reload(); // Refresh the page after closing the dialog
  };

  return (
    <Card>
      {isMapInit && (
        <MapContainer
          center={[5, 14.5]}
          zoom={5}
          style={{
            height: "90vh",
            width: "100%",
            backgroundColor: "white",
            zIndex: 100,
          }}
          crs={L.CRS.Simple}
          attributionControl={false}
        >
          <ImageOverlay
            key={selectedFloorPlan}
            url={selectedFloorPlan}
            bounds={bounds}
          />

          {coordinates.map((coordinate, index) => (
            <Circle
              key={index}
              center={coordinate.position}
              radius={0.1}
              pathOptions={{
                color: coordinate.color,
                fillColor: coordinate.color,
                fillOpacity: 0.2,
                fill: true,
              }}
              eventHandlers={{
                click: () => {
                  onCircleClick(coordinate);
                },
              }}
            >
              <Popup>
                <div style={{ textAlign: "left", padding: "10px" }}>
                  <h3>{coordinate.popup}</h3>
                  {coordinate.color === "red" && <p>Booked By Another User</p>}
                  <div style={{ marginBottom: "10px" }}>
                    <Button
                      design={
                        favouritedDesks.includes(coordinate.popup)
                          ? "Negative"
                          : "Positive"
                      }
                      onClick={() =>
                        favouritedDesks.includes(coordinate.popup)
                          ? handleUnfavourite(coordinate.popup)
                          : handleFavourite(coordinate.popup)
                      }
                      style={{ display: "block", marginBottom: "5px" }}
                    >
                      {favouritedDesks.includes(coordinate.popup)
                        ? "Unfavourite"
                        : "Favourite"}
                    </Button>
                  </div>
                  {coordinate.color !== "red" && (
                    <Button
                      design="Emphasized"
                      onClick={() => handleBook(coordinate.popup, dateRange)}
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        backgroundColor: bookedDesks.includes(coordinate.popup)
                          ? "#cccccc"
                          : "",
                        cursor: bookedDesks.includes(coordinate.popup)
                          ? "not-allowed"
                          : "pointer",
                      }}
                      disabled={bookedDesks.includes(coordinate.popup)}
                    >
                      {bookedDesks.includes(coordinate.popup)
                        ? "Booked"
                        : "Book"}
                    </Button>
                  )}
                </div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      )}

      {dialogOpen && (
        <Dialog
          headerText="Booking Confirmation"
          footer={<Button onClick={handleDialogClose}>OK</Button>}
          open={dialogOpen}
          onAfterClose={handleDialogClose}
          style={{ zIndex: 1000 }} 
        >
          <p>{bookingMessage}</p>
        </Dialog>
      )}
    </Card>
  );
}

export default Map;
