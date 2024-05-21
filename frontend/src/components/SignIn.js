import React, { Component } from 'react';
import { UserAgentApplication } from 'msal';
import { Button } from '@ui5/webcomponents-react';
import config from './Tasks/Calendar/Config';
import { getUserDetails } from './Tasks/Calendar/GraphFunctions'; // Assuming your file with graph functions is named GraphService.js

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
    localStorage.removeItem('userDetails'); // Clear user details from localStorage on logout
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
