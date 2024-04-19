import React from "react";
import LastBooked from "../components/Cards/LastBooked";
import FavouriteDesk from "../components/Cards/FavouriteDesk";
import CurrentDesk from "../components/Cards/CurrentDesk";

function Home () {

  return (
    <>
      <h1>Home</h1>
      <CurrentDesk />
      <LastBooked />
      <FavouriteDesk />
    </>
  );
}

export default Home;