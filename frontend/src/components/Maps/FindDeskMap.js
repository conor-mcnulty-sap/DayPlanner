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
  const bounds = [
    [0, 0],
    [10, 29],
  ];

  const markerPosition = [5, 5]; // adjust this to the desired position

  useEffect(() => {
    setIsMapInit(true);
  }, []);

  return (
    <Card style={{ width: "100%", height: "100%" }}>
      {isMapInit && (
        <MapContainer
          center={[5, 14.5]}
          zoom={5}
          style={{ height: "90vh", width: "100%", backgroundColor: "white" }}
          crs={L.CRS.Simple}
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
