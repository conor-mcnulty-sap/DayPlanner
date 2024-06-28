import React from "react";
import { TabContainer, Tab, Button } from "@ui5/webcomponents-react";
import { useNavigate } from "react-router-dom";

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

  const handleButtonClick = () => {
    // Handle button click action
    console.log("Button clicked");
    // Example navigation to a specific route
    navigate("/some-route");
  };

  const currentRoute = window.location.pathname;

  return (
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
  );
}
