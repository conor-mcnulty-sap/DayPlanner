import React from "react";
import LastBooked from "../components/Cards/Desks/LastBooked";
import FavouriteDesk from "../components/Cards/Desks/FavouriteDesk";
import CurrentDesk from "../components/Cards/Desks/CurrentDesk";
import WhosIn from "../components/WhosIn";
import NewsCard from "../components/Cards/NewsCard";

function Home () {

  return (
    <>
      <h1>Home</h1>
      <CurrentDesk />
      <LastBooked />
      <FavouriteDesk />

      <br /><br /><br />

      <WhosIn />

      <br /><br /><br />

      <NewsCard />
    </>
  );
}

export default Home;