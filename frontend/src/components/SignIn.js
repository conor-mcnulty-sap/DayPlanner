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

  async componentDidMount() {
    const user = this.userAgentApplication.getAccount();
    if (user) {
      this.setState({ isAuthenticated: true, user });
      this.props.onLogin(user);
    } else {
      try {
        // Check if the redirect response contains authentication result
        const authResult = await this.userAgentApplication.handleRedirectCallback();
        if (authResult) {
          this.setState({ isAuthenticated: true, user: authResult.account });
          this.props.onLogin(authResult.account);

          const accessTokenResponse = await this.userAgentApplication.acquireTokenSilent({
            scopes: config.scopes,
          });

          if (accessTokenResponse.accessToken) {
            await getUserDetails({ accessToken: accessTokenResponse.accessToken });

            const userDetails = JSON.parse(localStorage.getItem('userDetails'));
            const params = new URLSearchParams({
              id: userDetails.id,
              name: userDetails.displayName,
              email: userDetails.mail,
            });

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
      } catch (error) {
        console.error('Error handling redirect:', error);
      }
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

        const accessTokenResponse = await this.userAgentApplication.acquireTokenSilent({
          scopes: config.scopes,
        });

        if (accessTokenResponse.accessToken) {
          await getUserDetails({ accessToken: accessTokenResponse.accessToken });

          const userDetails = JSON.parse(localStorage.getItem('userDetails'));
          const params = new URLSearchParams({
            id: userDetails.id,
            name: userDetails.displayName,
            email: userDetails.mail,
          });

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
