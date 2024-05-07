import React from "react";
import LastBooked from "../components/Cards/Desks/LastBooked";
import FavouriteDesk from "../components/Cards/Desks/FavouriteDesk";
import CurrentDesk from "../components/Cards/Desks/CurrentDesk";
import WhosIn from "../components/Home/WhosIn";
import NewsCard from "../components/Cards/NewsCard";

function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
        margin: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <CurrentDesk />
        <LastBooked />
        <FavouriteDesk />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          maxWidth: "1000px",
          width: "100%",
        }}
      >
        <WhosIn />
        <NewsCard />
      </div>
    </div>
  );
}

export default Home;
