import React, { useEffect, useState } from "react";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import axios from "axios";

const config = {
  auth: {
    clientId: "f0ba26d6-c63f-494b-82a5-4c1ad00e8941",
    redirectUri: "http://localhost:3000",
    authority:
      "https://login.microsoftonline.com/c7cf020e-7c7c-49a7-8215-6bbaea2029d5",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true,
  },
};

const GraphApiCaller = () => {
  const { instance, accounts } = useMsal();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const callGraphApi = async (accessToken) => {
    try {
      const apiResponse = await axios.get(
        "https://graph.microsoft.com/v1.0/me/events",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setEvents(apiResponse.data.value);
      console.log(
        "Microsoft Graph API call successful:",
        apiResponse.data.value
      );
    } catch (error) {
      console.error("Error calling Microsoft Graph API:", error);
      setError(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (accounts.length > 0) {
        try {
          const response = await instance.acquireTokenSilent({
            scopes: ["User.Read", "Calendars.Read", "Calendars.ReadBasic"],
            account: accounts[0],
          });

          const tokenExpiration = new Date(response.expiresOn);
          const now = new Date();

          if (tokenExpiration > now) {
            const accessToken = response.accessToken;
            await callGraphApi(accessToken);
          } else {
            const refreshedResponse = await instance.acquireTokenSilent({
              scopes: [
                "User.Read",
                "Calendars.Read",
                "Calendars.ReadWrite",
                "Calendars.ReadBasic",
              ],
              account: accounts[0],
              forceRefresh: true,
            });
            const newAccessToken = refreshedResponse.accessToken;
            await callGraphApi(newAccessToken);
          }
        } catch (error) {
          console.error("Error acquiring access token:", error);
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
            <strong>{event.subject}</strong> -{" "}
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
        console.error("Error initializing MSAL:", error);
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
