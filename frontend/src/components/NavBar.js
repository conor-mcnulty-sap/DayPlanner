import React from "react";
import { TabContainer, Tab } from "@ui5/webcomponents-react";
import { useNavigate } from "react-router-dom";
import SignIn from "./SignIn";
import { Login } from '@microsoft/mgt-react';//sign in feature

const TabRoutes = {
  Home: "/",
  "Book a Desk": "/bookdesk",
  "Find my Desk": "/finddesk",
  "Team Booking": "/bookteam",
  "Book a Meeting Room": "/bookmeeting",
  "My Tasks": "/tasks",
  Carpool: "/carpool",
};

export function NavBar() {
  const navigate = useNavigate();

  const handleTabSelect = (e) => {
    const selectedTabText = e.detail.tab.attributes[1].nodeValue;
    const route = TabRoutes[selectedTabText];
    if (route) {
      navigate(route);
    } else {
      console.error(`No route found for tab "${selectedTabText}"`);
    }
  };

  const currentRoute = window.location.pathname;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      <TabContainer
        contentBackgroundDesign="Solid"
        headerBackgroundDesign="Solid"
        onTabSelect={handleTabSelect}
        collapsed="true"
        fixed="true"
        tabLayout="Standard"
      >
        {Object.entries(TabRoutes).map(([tabText, route]) => (
          <Tab key={tabText} text={tabText} selected={route === currentRoute} />
        ))}
      </TabContainer>
      <Login />
    </div>
  );
}
