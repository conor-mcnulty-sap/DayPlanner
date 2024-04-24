import React from 'react';
import { MsalProvider, useMsal } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import {Button} from "@ui5/webcomponents-react";
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

    const graphApiEndpoint = 'https://graph.microsoft.com/v1.0/me';

    const GraphApiCaller = () => {
    const { instance, accounts } = useMsal();

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
        <Button onClick={handleSignIn}>Sign In</Button>
        <Button onClick={handleSignOut}>Sign Out</Button>
        <Button onClick={callGraphApi}>Call Graph API</Button>
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