import React from "react";
import { Card, CardHeader } from "@ui5/webcomponents-react";
import LastBooked from "../components/Cards/Desks/LastBooked";
import FavouriteDesk from "../components/Cards/Desks/FavouriteDesk";
import CurrentDesk from "../components/Cards/Desks/CurrentDesk";
import WhosIn from "../components/Home/WhosIn";
import NewsCard from "../components/Cards/NewsCard";
import { MyTasks } from "../components/Tasks/MyTasks";

function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        margin: "2rem auto 4rem auto", // Center the content
        width: "90%", // Adjust the width of the page
        height: "30vh",
      }}
    >
      <div style={{ width: "48%", margin: "1rem" }}>
        <Card header={<CardHeader titleText="My Desks" />}>
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

        <div style={{ margin: "2rem 0" }}>
          <MyTasks style={{ width: "100%" }} />
        </div>
      </div>

      <div style={{ width: "48%", margin: "1rem" }}>
        <div>
          <WhosIn />
        </div>
        <div style={{ margin: "2rem 0" }}>
          <NewsCard />
        </div>
      </div>
    </div>
  );
}

export default Home;
