import React, { useState, useEffect } from "react";
import { Grid } from "@ui5/webcomponents-react";
import Map from "../components/Maps/FindDeskMap";
import SingleSelectCalendar from "../components/FindDesk/Calendar";
import "./FindDesk.css";

function FindDesk() {
  const [deskId, setDeskId] = useState(null);
  const [zoom, setZoom] = useState(15); // Default zoom level
  const [center, setCenter] = useState([5, 14.5]); // Default center coordinates

  useEffect(() => {
    const updateMapSettings = () => {
      if (window.innerWidth <= 768) {
        setZoom(4); // Zoom out on mobile
        setCenter([-5, 13.5]); // Adjust center for mobile
      } else {
        setZoom(5); // Default zoom level for desktop
        setCenter([5, 14.5]); // Default center for desktop
      }
    };

    updateMapSettings();
    window.addEventListener("resize", updateMapSettings);

    return () => {
      window.removeEventListener("resize", updateMapSettings);
    };
  }, []);

  return (
    <Grid
      defaultSpan="XL6 L12 M12 S12"
      vSpacing={"1rem"}
      hSpacing={"1rem"}
      style={{ margin: "2rem" }}
    >
      <div className="calendar-container">
        <SingleSelectCalendar
          onDeskIdFetched={(fetchedDeskId) => {
            console.log("Fetched desk id:", fetchedDeskId);
            setDeskId(fetchedDeskId);
          }}
        />
      </div>
      <div className="map-container">
        <Map deskId={deskId} zoom={zoom} center={center} />
      </div>
    </Grid>
  );
}

export default FindDesk;