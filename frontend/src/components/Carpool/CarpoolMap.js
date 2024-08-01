import React, { useEffect, useState } from "react";
import { Card } from "@ui5/webcomponents-react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet"; // Import Leaflet

function CarpoolMap() {
  const position = [53.287, -6.430];
  const [positionU, setPositionU] = useState(null);

  function MapComponent() {
    const map = useMap();

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        map.invalidateSize();
      }, 100); // adjust delay as needed

      return () => {
        clearTimeout(timeoutId);
      };
    }, [map]);

    return null;
  }

  useEffect(() => {
    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      const userId = userDetails.id;

      fetch(`${process.env.REACT_APP_API_URL}/api/carpools/coordinates?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const [latitude, longitude] = data;
            if (latitude && longitude) {
              setPositionU([latitude, longitude]);
            } else {
              console.error("Invalid coordinates received:", data);
            }
          } else {
            console.error("No coordinates received or invalid data format:", data);
          }
        })
        .catch(error => {
          console.error("Error fetching user coordinates:", error);
        });
    }
  }, []);

  const customIcon = L.icon({
    iconUrl: require("../../assets/299079_map_blue.png"), // Path to your custom marker icon
    iconSize: [40, 40], // Size of the icon
    iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  });

  return (
    <Card heading="Carpool Map" style={{ width: "100%", height: "18rem", maxHeight: "50vh" }}>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "40vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            SAP Dublin Office
          </Popup>
        </Marker>
        {positionU && (
          <Marker position={positionU} icon={customIcon}>
            <Popup>
              Your home location.
            </Popup>
          </Marker>
        )}
        <MapComponent />
      </MapContainer>
    </Card>
  );
}

export default CarpoolMap;