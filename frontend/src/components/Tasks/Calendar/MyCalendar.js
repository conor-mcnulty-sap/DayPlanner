import React, { useEffect, useState } from 'react';
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
  const [error, setError] = useState(null);

  const callGraphApi = async (accessToken) => {
    try {
      const apiResponse = await axios.get('https://graph.microsoft.com/v1.0/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Prefer: 'outlook.timezone="Pacific Standard Time"', 
        },
        params: {
         // $select: 'subject,body,bodyPreview,organizer,attendees,start,end,location',
        },
      });

      setEvents(apiResponse.data.value);
      console.log('Microsoft Graph API call successful:', apiResponse.data.value);
    } catch (error) {
      console.error('Error calling Microsoft Graph API:', error);
      setError(error);
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
          setError(error);
        }
      }
    };

    fetchData();
  }, [instance, accounts]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
      try {
        const pcaInstance = new PublicClientApplication(config);
        await pcaInstance.initialize(); 
        setPca(pcaInstance);
      } catch (error) {
        console.error('Error initializing MSAL:', error);
      }
    };

    initializeMsal();
  }, []);

  if (!pca) {
    return <div>Loading...</div>;
  }

  return (
    <MsalProvider instance={pca}>
      <GraphApiCaller />
    </MsalProvider>
  );
};

export default Calendar;
