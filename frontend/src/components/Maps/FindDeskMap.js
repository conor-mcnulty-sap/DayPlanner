import React, { useState, useEffect } from "react";
import { Card } from "@ui5/webcomponents-react";
import { MapContainer, ImageOverlay, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import floorPlan from "../../assets/floor-plan-png-9.jpg";

// Fix for the default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function Map() {
  const [isMapInit, setIsMapInit] = useState(false);
  const [markerPosition, setMarkerPosition] = useState([5, 5]); // initial position
  const bounds = [
    [0, 0],
    [10, 29],
  ];

  useEffect(() => {
    setIsMapInit(true);

    const today = new Date();
    const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const userId = 1;

    fetch(`${process.env.REACT_APP_API_URL}/api/bookings/getbookinguserdate?user_id=${userId}&date=${date}`)
      .then(response => response.json())
      .then(data => {
        // assuming the data contains the coordinates in a property named 'coordinates'
        console.log(data);
        console.log(data);
        setMarkerPosition(data.coordinates);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <Card style={{ width: "100%", height: "100%" }}>
      {isMapInit && (
        <MapContainer
          center={[5, 14.5]}
          zoom={5}
          style={{ height: "90vh", width: "100%", backgroundColor: "white" }}
          crs={L.CRS.Simple}
          attributionControl={false}
        >
          <ImageOverlay url={floorPlan} bounds={bounds} />
          <Marker position={markerPosition}>
            <Popup>DUB05-3-L-34</Popup>
          </Marker>
        </MapContainer>
      )}
    </Card>
  );
}

export default Map;