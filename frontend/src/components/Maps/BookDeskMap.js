import React, { useState, useEffect } from "react";
import {
  MapContainer,
  ImageOverlay,
  Circle,
  Popup,
  Rectangle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import floorPlan from "../../assets/floor-plan-png-9.jpg";
import { Card, Button } from "@ui5/webcomponents-react";

function Map({ onCircleClick }) {
  const [isMapInit, setIsMapInit] = useState(false);
  const [userId, setUserId] = useState(null);
  const [favouritedDesks, setFavouritedDesks] = useState([]);

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      setUserId(userDetails.id);

      fetch(`${process.env.REACT_APP_API_URL}/api/desks/favouritesbyuser?user_id=${userDetails.id}`)
        .then((response) => response.json())
        .then((data) => {
          setFavouritedDesks(data.map(desk => desk.desk_id));
        })
        .catch((error) => console.error(error));
    }
    setIsMapInit(true);
  }, []);

  const bounds = [
    [0, 0],
    [10, 29],
  ];

  // State to store the coordinates
  const [coordinates, setCoordinates] = useState([]);

  // Fetch the coordinates from the JSON file when the component mounts
  useEffect(() => {
    fetch("/coordinates.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched coordinates: ", data);
        setCoordinates(data);
      })
      .catch((error) => console.log("Fetching coordinates failed: ", error));
  }, []);

  const handleFavourite = (deskId) => {
    fetch(
      `${process.env.REACT_APP_API_URL}/api/desks/favouritedesk?desk_id=${deskId}&user_id=${userId}`,
      {
        method: "POST",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log(`Desk ${deskId} added to favourites`);
        setFavouritedDesks([...favouritedDesks, deskId]);
      })
      .catch((error) => console.error(error));
  };

  const handleUnfavourite = (deskId) => {
    fetch(
      `${process.env.REACT_APP_API_URL}/api/desks/removefavourite?desk_id=${deskId}&user_id=${userId}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log(`Desk ${deskId} removed from favourites`);
        setFavouritedDesks(favouritedDesks.filter(id => id !== deskId));
      })
      .catch((error) => console.error(error));
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
          <ImageOverlay url={floorPlan} bounds={bounds} />

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
                  <Button design="Negative" onClick={() => handleUnfavourite(coordinate.popup)}>
                    Unfavourite
                  </Button>
                ) : (
                  <Button design="Positive" onClick={() => handleFavourite(coordinate.popup)}>
                    Favourite
                  </Button>
                )}
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      )}
    </Card>
  );
}

export default Map;
