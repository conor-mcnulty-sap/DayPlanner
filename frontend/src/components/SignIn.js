import React, { Component } from 'react';
import { UserAgentApplication } from 'msal';
import { Button } from '@ui5/webcomponents-react';
import config from './Tasks/Calendar/Config';
import { getUserDetails } from '../assets/GraphFunctions'; 

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.userAgentApplication = new UserAgentApplication({
      auth: {
        clientId: config.appId,
        redirectUri: 'http://localhost:3000',
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: true,
      },
    });

    this.state = {
      isAuthenticated: false,
      user: null,
    };
  }

  componentDidMount() {
    const user = this.userAgentApplication.getAccount();
    if (user) {
      this.setState({ isAuthenticated: true, user });
      this.props.onLogin(user);
    }
  }

  handleLogin = async () => {
    try {
      await this.userAgentApplication.loginPopup({
        scopes: config.scopes,
        prompt: 'select_account',
      });
  
      const user = this.userAgentApplication.getAccount();
      if (user) {
        this.setState({ isAuthenticated: true, user });
        this.props.onLogin(user);
  
        // Get the access token
        const accessTokenResponse = await this.userAgentApplication.acquireTokenSilent({
          scopes: config.scopes,
        });
  
        // Fetch user details and store in localStorage
        if (accessTokenResponse.accessToken) {
          await getUserDetails({ accessToken: accessTokenResponse.accessToken });
  
          // Construct params for the POST request
          const userDetails = JSON.parse(localStorage.getItem('userDetails'));
          const params = new URLSearchParams({
            id: userDetails.id,
            name: userDetails.displayName,
            email: userDetails.mail,
          });
  
          // Make POST request to the endpoint
          try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/createuser?${params.toString()}`, {
              method: 'POST',
            });
  
            if (!response.ok) {
              console.error('Server error:', response.status, response.statusText);
              return;
            }
  
            const text = await response.text();
            const data = text ? JSON.parse(text) : {};
  
            if (data) {
              console.log('Response from server:', data);
            } else {
              console.error('No data received from server');
            }
          } catch (error) {
            console.error('Network error:', error);
          }
        }
      }
    } catch (err) {
      console.log('Login error:', err);
    }
  };

  handleLogout = () => {
    this.userAgentApplication.logout();
    this.setState({ isAuthenticated: false, user: null });
    this.props.onLogout();
    localStorage.removeItem('userDetails'); 
  };

  render() {
    const { isAuthenticated } = this.state;

    return (
      <div>
        {!isAuthenticated ? (
          <Button onClick={this.handleLogin}>Sign In</Button>
        ) : (
          <Button onClick={this.handleLogout}>Sign Out</Button>
        )}
      </div>
    );
  }
}

export default SignIn;