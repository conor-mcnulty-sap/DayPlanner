import React from "react";
import { Card, CardHeader } from "@ui5/webcomponents-react";
import LastBooked from "../components/Cards/Desks/LastBooked";
import FavouriteDesk from "../components/Cards/Desks/FavouriteDesk";
import CurrentDesk from "../components/Cards/Desks/CurrentDesk";
import WhosIn from "../components/Home/WhosIn";
import NewsCard from "../components/Cards/NewsCard";
import {Timeline} from "@ui5/webcomponents-react"

function Home() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "2rem",
        margin: "2rem auto 4rem auto", // Center the content
        width: "90%", // Adjust the width of the page
        alignItems: "start", // Align items to the start
      }}
    >
      <Card
        header={<CardHeader titleText="My Desks" />}
        style={{
          gridColumn: "1",
          gridRow: "1",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ flex: 1, margin: "1rem" }}>
              <CurrentDesk />
            </div>
            <div style={{ flex: 1, margin: "1rem" }}>
              <LastBooked />
            </div>
          </div>
          <div style={{ margin: "1rem" }}>
            <FavouriteDesk />
          </div>
        </div>
      </Card>

      <div style={{ gridColumn: "2", gridRow: "1", alignSelf: "start" }}>
        <WhosIn />
      </div>

      <div style={{ gridColumn: "2", gridRow: "2" }}>
        <NewsCard />
      </div>

      <Card
        header={<CardHeader titleText="My Tasks" />}
        style={{
          gridColumn: "1",
          gridRow: "2",
          width: "100%",
        }}
      >
        <Timeline />
      </Card>
    </div>
  );
}

export default Home;