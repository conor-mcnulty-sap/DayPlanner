import React from 'react';
import {
    TabContainer,
    Tab,
    TabSeparator
} from '@ui5/webcomponents-react';

const TabRoutes = {
    "Home": "/",
    "Book a Desk": "/bookdesk",
    "Find my Desk": "/finddesk",
    "Book a Meeting Room": "/bookmeeting",
    "My Tasks": "/tasks",
    "Carpool": "/carpool"
};

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

    const currentRoute = window.location.pathname;

    return (
        <TabContainer
            contentBackgroundDesign="Solid"
            headerBackgroundDesign="Solid"
            onTabSelect={handleTabSelect}
            collapsed='true' 
            fixed='true'
            tabLayout="Standard"
        >
            {Object.entries(TabRoutes).map(([tabText, route]) => (
                <Tab
                    key={tabText}
                    text={tabText}
                    selected={route === currentRoute}
                />
            ))}
        </TabContainer>
    );
}