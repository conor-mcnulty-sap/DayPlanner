import React, { useEffect, useRef } from 'react';
import {
    TabContainer,
    Tab,
    TabSeparator
    } from '@ui5/webcomponents-react';

export function NavBar() {
    const tabContainerRef = useRef(null);

    useEffect(() => {
        const ro = new ResizeObserver(entries => {
            window.requestAnimationFrame(() => {
                for (let entry of entries) {
                    const {width, height} = entry.contentRect;
                    console.log('Element:', entry.target);
                    console.log(`Element size: ${width}px x ${height}px`);
                    console.log(`Element padding: ${entry.target.style.padding}`);
                }
            });
        });

        if (tabContainerRef.current) {
            ro.observe(tabContainerRef.current);
        }

        return () => {
            if (tabContainerRef.current) {
                ro.unobserve(tabContainerRef.current);
            }
        };
    }, []);
    return(
        <TabContainer
        contentBackgroundDesign="Solid"
        headerBackgroundDesign="Solid"
        //onTabSelect={function _a(){}}
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
        <Tab
            text="Find my Desk"
        />
        <Tab
            text="Book a Meeting Room"
        />
        <Tab
            text="My Tasks"
        />
        <Tab
            text="Carpool"
        />
        </TabContainer>
    )
}
