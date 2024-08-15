import React from "react";
import { Card, CardHeader } from "@ui5/webcomponents-react";
import LastBooked from "../components/Cards/Desks/LastBooked";
import FavouriteDesk from "../components/Cards/Desks/FavouriteDesk";
import CurrentDesk from "../components/Cards/Desks/CurrentDesk";
import WhosIn from "../components/Home/WhosIn";
import NewsCard from "../components/Cards/NewsCard";
import MyTasks from "../components/Tasks/MyTasks";
import './Home.css'; // Import the CSS file

function Home() {
  return (
    <div className="home-container">
      <div className="left-column">
        <Card header={<CardHeader titleText="My Desks" />}>
          <div className="desks-container">
            <div className="desks-row">
              <div className="desk-item">
                <CurrentDesk />
              </div>
              <div className="desk-item">
                <LastBooked />
              </div>
            </div>
            <div className="desk-item">
              <FavouriteDesk />
            </div>
          </div>
        </Card>

        <div className="tasks-container">
          <MyTasks />
        </div>
      </div>

      <div className="right-column">
        <WhosIn />
        <div className="news-container">
          <NewsCard />
        </div>
      </div>
    </div>
  );
}

export default Home;