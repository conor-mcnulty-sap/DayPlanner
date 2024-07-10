import React from "react";
import { Card, CardHeader } from "@ui5/webcomponents-react";
import LastBooked from "../components/Cards/Desks/LastBooked";
import FavouriteDesk from "../components/Cards/Desks/FavouriteDesk";
import CurrentDesk from "../components/Cards/Desks/CurrentDesk";
import WhosIn from "../components/Home/WhosIn";
import NewsCard from "../components/Cards/NewsCard";
import  MyTasks  from "../components/Tasks/MyTasks";

function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        margin: "2rem auto", // Center horizontally with auto margins
        width: "90%", // Adjust the width of the content
      }}
    >
      <div style={{ width: "48%", marginRight: "1rem" }}>
        <Card header={<CardHeader titleText="My Desks" />}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <CurrentDesk />
              <LastBooked />
            </div>
            <div style={{ margin: "1rem 0" }}>
              <FavouriteDesk />
            </div>
          </div>
        </Card>

        <div style={{ marginTop: "2rem" }}>
          <MyTasks />
        </div>
      </div>

      <div style={{ width: "48%", marginLeft: "1rem" }}>
        <WhosIn />
        <div style={{ marginTop: "2rem" }}>
          <NewsCard />
        </div>
      </div>
    </div>
  );
}

export default Home;
