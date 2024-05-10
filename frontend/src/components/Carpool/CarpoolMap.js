import React, { useEffect, useRef } from "react";
import { Card } from "@ui5/webcomponents-react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function CarpoolMap() {
  const position = [53.287, -6.430];

  function MapComponent() {
    const map = useMap();

    useEffect(() => {
      map.invalidateSize();
    }, [map]);

    return null;
  }

  return (
    <Card heading="Carpool Map" style={{ width: "100%", maxHeight: "50vh" }}>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "40vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapComponent />
      </MapContainer>
    </Card>
  );
}

export default CarpoolMap;