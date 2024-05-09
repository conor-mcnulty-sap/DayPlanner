import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function CarpoolMap() {
  const position = [53.287, -6.430];

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "40vh", width: "90%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
}

export default CarpoolMap;
