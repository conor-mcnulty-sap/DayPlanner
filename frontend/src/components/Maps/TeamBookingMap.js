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
  selectedDesks,
  setSelectedDesks,
}) {
  const [isMapInit, setIsMapInit] = useState(false);
  const [userId, setUserId] = useState(null);
  const [favouritedDesks, setFavouritedDesks] = useState([]);

  // Add a new state variable for the selected floor plan
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(floorPlans["2-1"]);
  console.log("a"+dateRange);
  const bookedDesks = useGetBookings(
    dateRange,
    selectedBuilding,
    selectedFloor
  );

  
  const [coordinates, setCoordinates] = useState([]);

  // Fetch the coordinates from the JSON file when the component mounts
  useEffect(() => {
    const coordinatesFile = `/coordinates-${selectedBuilding}-${selectedFloor}.json`;
    fetch(coordinatesFile)
      .then((response) => response.json())
      .then((data) => {
        // Update each coordinate's color based on whether it's booked
        const updatedCoordinates = data.map((coordinate) => ({
          ...coordinate,
          color: bookedDesks.includes(coordinate.popup) ? "red" : "green", // Assuming 'popup' contains the desk ID
        }));
        setCoordinates(updatedCoordinates);
      })
      .catch((error) => console.error(error));
      console.log(dateRange)
  }, [selectedFloor, selectedBuilding, bookedDesks]);

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
  }, []);

  // Add a useEffect to update the selected floor plan when the selected building or floor changes
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
  console.log(selectedBuilding + "-" + selectedFloor);

  const bounds = [
    [0, 0],
    [10, 29],
  ];

  // Fetch the coordinates from the JSON file when the component mounts
  useEffect(() => {
    const coordinatesFile = `/coordinates-${selectedBuilding}-${selectedFloor}.json`;
    fetch(coordinatesFile)
      .then((response) => response.json())
      .then((data) => {
        // Update each coordinate's color based on whether it's booked
        const updatedCoordinates = data.map((coordinate) => ({
          ...coordinate,
          color: bookedDesks.includes(coordinate.popup) ? "red" : "green", // Assuming 'popup' contains the desk ID
        }));
        setCoordinates(updatedCoordinates);
      })
      .catch((error) => console.error(error));
  }, [selectedFloor, selectedBuilding, bookedDesks]); // Add selectedFloor as a dependency

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
        setFavouritedDesks(favouritedDesks.filter((id) => id !== deskId));
      })
      .catch((error) => console.error(error));
  };

  const handleBook = () => {
    selectedDesks.forEach((deskId) => {
      fetch(
        `${process.env.REACT_APP_API_URL}/api/bookings/bookdesk?user_id=${userId}&desk_id=${deskId}&date=${dateRange}`,
        {
          method: "POST",
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          console.log(`Desk ${deskId} booked`);
        })
        .catch((error) => console.error(error));
    });
    // Clear selected desks after booking
    setSelectedDesks([]);
  };

  const toggleSelectDesk = (deskId) => {
    setSelectedDesks((prevSelectedDesks) => {
      const isSelected = prevSelectedDesks.includes(deskId);
      const newSelectedDesks = isSelected
        ? prevSelectedDesks.filter((id) => id !== deskId)
        : [...prevSelectedDesks, deskId];
      console.log("Selected desks: ", newSelectedDesks);
      return newSelectedDesks;
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
                {selectedDesks.includes(coordinate.popup) ? (
                  <Button
                    design="Negative"
                    onClick={() => toggleSelectDesk(coordinate.popup)}
                  >
                    Deselect
                  </Button>
                ) : (
                  <Button
                    design="Emphasized"
                    onClick={() => toggleSelectDesk(coordinate.popup)}
                  >
                    Select
                  </Button>
                )}
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      )}
      {selectedDesks.length > 0 && (
        <Button design="Emphasized" onClick={handleBook}>
          Book Selected Desks
        </Button>
      )}
    </Card>
  );
}

export default Map;
