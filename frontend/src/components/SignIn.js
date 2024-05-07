import React, { useState, useEffect } from 'react';
import { MsalProvider, useMsal } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { Login } from '@microsoft/mgt-react';
import {Button} from "@ui5/webcomponents-react";
import axios from 'axios';

const config = {
  auth: {
    clientId: 'f0ba26d6-c63f-494b-82a5-4c1ad00e8941',
    redirectUri: 'http://localhost:3000',
    authority: 'https://login.microsoftonline.com/c7cf020e-7c7c-49a7-8215-6bbaea2029d5',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
};

const graphApiEndpoint = 'https://graph.microsoft.com/v1.0/me';

const GraphApiCaller = () => {
  const { instance, accounts } = useMsal();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (accounts.length > 0) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  }, [accounts]);

  const handleSignIn = async () => {
    try {
      await instance.loginPopup();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = () => {
    instance.logout();
  };

  const callGraphApi = async () => {
    try {
      const response = await instance.acquireTokenSilent({
        scopes: ['user.read'],
        account: accounts[0],
      });

      const accessToken = response.accessToken;

      const apiResponse = await axios.get(graphApiEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(apiResponse.data);
    } catch (error) {
      console.error('Error calling Microsoft Graph API:', error);
    }
  };

  return (
    <div>
      {signedIn ? (
        <div>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </div>
      ) : (
        <Button onClick={handleSignIn}>Sign In</Button>
      )}
    </div>
  );
};

const SignIn = () => {
  const pca = new PublicClientApplication(config);
  
  return (
    <MsalProvider instance={pca}>
      <GraphApiCaller />
    </MsalProvider>
  );
};

export default SignIn;