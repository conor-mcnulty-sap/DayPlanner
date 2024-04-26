import React, { useState, useEffect } from 'react';
import { MsalProvider, useMsal } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import axios from 'axios';

const config = {
  auth: {
    clientId: '3687e9ca-a227-4c68-8400-6eef32c6e882',
    redirectUri: 'http://localhost:3000',
    authority: 'https://login.microsoftonline.com/ec0acb37-6c28-4d7b-8f76-c90ed4a41c13',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
};

const GraphApiCaller = () => {
  const { instance, accounts } = useMsal();
  const [events, setEvents] = useState([]);

  const callGraphApi = async (accessToken) => {
    try {
      const apiResponse = await axios.get('https://graph.microsoft.com/v1.0/me/events?$select=subject,body,bodyPreview,organizer,attendees,start,end,location', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setEvents(apiResponse.data.value); // Store events in state
      console.log('Microsoft Graph API call successful.');
    } catch (error) {
      console.error('Error calling Microsoft Graph API:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (accounts.length > 0) {
        try {
          const response = await instance.acquireTokenSilent({
            scopes: ['user.read', 'calendars.read'],
            account: accounts[0],
          });

          const accessToken = response.accessToken;
          await callGraphApi(accessToken);
        } catch (error) {
          console.error('Error acquiring access token:', error);
        }
      }
    };

    fetchData();
  }, [instance, accounts]);

  return (
    <div>
      <h2>Upcoming Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <strong>{event.subject}</strong> -{' '}
            {new Date(event.start.dateTime).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Calendar = () => {
  const [pca, setPca] = useState(null);

  useEffect(() => {
    const initializeMsal = async () => {
      const pcaInstance = new PublicClientApplication(config);
      setPca(pcaInstance);
    };

    initializeMsal();
  }, []);

  if (!pca) {
    return <div>Loading...</div>; // Render a loading indicator while MSAL is initializing
  }

  return (
    <MsalProvider instance={pca}>
      <GraphApiCaller />
    </MsalProvider>
  );
};

export default Calendar;
