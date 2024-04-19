import React from "react";
import DeskCard from "../components/Cards/DeskCard";

function Home () {
  const data = {
    type: "Last Booked Desk",
  };

  return (
    <>
      <div style={{ position: 'fixed', top: '80px', left: '0', width: '50%', height: '50%', overflow: 'auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 50%', padding: '0', margin: '0' }}>
            <DeskCard />
          </div>
          <div style={{ flex: '0 0 50%', padding: '0', margin: '0' }}>
            <DeskCard />
          </div>
          <div style={{ flex: '0 0 50%', padding: '0', margin: '0' }}>
            <DeskCard />
          </div>
          <div style={{ flex: '0 0 50%', padding: '0', margin: '0' }}>
            <DeskCard />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home;