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
import { Card, Button } from "@ui5/webcomponents-react";

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

  const bookedDesks = useGetBookings(
    dateRange,
    selectedBuilding,
    selectedFloor
  );

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
        .catch((error) => console.error(error));
    }
    setIsMapInit(true);
  }, [setUserId, setFavouritedDesks, setIsMapInit]);

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
      })
      .catch((error) => console.error(error));
  }, [selectedFloor, selectedBuilding, bookedDesks]);

  const handleFavourite = (deskId) => {
    console.log("Favouriting desk:", deskId, "for user:", userId);
    fetch(
      `${process.env.REACT_APP_API_URL}/api/desks/favouritedesk?desk_id=${deskId}&user_id=${userId}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json().catch(() => response.text()))
      .then((data) => {
        console.log("Favourite response:", data);
        setFavouritedDesks([...favouritedDesks, deskId]);
      })
      .catch((error) => console.error("Favourite error:", error));
  };

  const handleUnfavourite = (deskId) => {
    console.log("Unfavouriting desk:", deskId, "for user:", userId);
    fetch(
      `${process.env.REACT_APP_API_URL}/api/desks/removefavourite?desk_id=${deskId}&user_id=${userId}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => response.json().catch(() => response.text()))
      .then((data) => {
        console.log("Unfavourite response:", data);
        setFavouritedDesks(favouritedDesks.filter((id) => id !== deskId));
      })
      .catch((error) => console.error("Unfavourite error:", error));
  };

  const handleBook = (deskId, dateRange) => {
    console.log("Booking desk:", deskId, "for user:", userId, "on dates:", dateRange);

    const params = new URLSearchParams({
      user_id: userId,
      desk_id: deskId,
      date: dateRange,
    });

    fetch(`${process.env.REACT_APP_API_URL}/api/bookings/bookdesk?${params.toString()}`, {
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          return response.json().catch(() => response.text());
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      })
      .then((data) => {
        console.log("Booking response:", data);
        window.location.reload(); // Add page refresh here
      })
      .catch((error) => {
        console.error("Booking error:", error);
        window.location.reload(); // Add page refresh here even in case of error
      });
  };

  return (
    <Card>
      {isMapInit && (
        <MapContainer
          center={[5, 14.5]}
          zoom={5}
          style={{ height: "90vh", width: "100%", backgroundColor: "white" }}
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
                {coordinate.color === "red"
                  ? `Booked by ${coordinate.bookedBy}`
                  : coordinate.popup}
                {favouritedDesks.includes(coordinate.popup) ? (
                  <Button
                    design="Negative"
                    onClick={() => handleUnfavourite(coordinate.popup)}
                  >
                    Unfavourite
                  </Button>
                ) : (
                  <Button
                    design="Positive"
                    onClick={() => handleFavourite(coordinate.popup)}
                  >
                    Favourite
                  </Button>
                )}
                <Button
                  design="Emphasized"
                  onClick={() => handleBook(coordinate.popup, dateRange)}
                >
                  Book
                </Button>
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      )}
    </Card>
  );
}

export default Map;
