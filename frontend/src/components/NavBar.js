import React from 'react';
import {
    TabContainer,
    Tab,
    TabSeparator
    } from '@ui5/webcomponents-react';

const TabRoutes = {
    "Default": "/",
    "Book a Desk": "/bookdesk",
    "Find my Desk": "/finddesk",
    "Book a Meeting Room": "/bookmeeting",
    "My Tasks": "/tasks",
    "Carpool": "/carpool"
};

const tabs = ["Home"];
export function NavBar() {
    const handleTabSelect = (e) => {
        const selectedTabText = e.detail.tab.attributes[1].nodeValue;
        const route = TabRoutes[selectedTabText];
        if (route) {
            window.location.href = route;
        } else {
            console.error(`No route found for tab "${selectedTabText}"`);
        }
    };

    return(
        <TabContainer
        contentBackgroundDesign="Solid"
        headerBackgroundDesign="Solid"
        onTabSelect={handleTabSelect}
        collapsed='true' 
        fixed='true'
        tabLayout="Standard"
        >
        <Tab
            selected
            subTabs={<><Tab text="Tab 1.1" /><Tab text="Tab 1.2" /><Tab text="Tab 1.3" /></>}
            text="Home"
        >
            <div
            style={{
                display: 'none'
            }}
            />
        </Tab>
        <TabSeparator />
        <Tab text="Book a Desk" />
        <Tab text="Find my Desk" />
        <Tab text="Book a Meeting Room" />
        <Tab text="My Tasks" />
        <Tab text="Carpool" />
        </TabContainer>
    )
}
