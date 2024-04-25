import React from "react";
import LastBooked from "../components/Cards/Desks/LastBooked";
import FavouriteDesk from "../components/Cards/Desks/FavouriteDesk";
import CurrentDesk from "../components/Cards/Desks/CurrentDesk";
import WhosIn from "../components/Home/WhosIn";
import NewsCard from "../components/Cards/NewsCard";

function Home () {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      <h1>Home</h1>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <CurrentDesk />
        <LastBooked />
        <FavouriteDesk />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
        <WhosIn />
        <NewsCard />
      </div>
    </div>
  );
}

export default Home;