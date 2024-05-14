import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'reactstrap';
import Tasks from './pages/Tasks';
import {NavBar} from './components/NavBar';
import Home from './pages/Home';
import Carpool from './pages/Carpool';
import BookDesk from './pages/BookDesk';
import BookMeeting from './pages/BookMeeting';
import FindDesk from './pages/FindDesk';
import BookTeam from './pages/BookTeam';
import SignIn from './components/SignIn';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      user: null,
      error: null
    };
  }

  handleLogin = (user) => {
    if (user) {
      this.setState({
        isAuthenticated: true,
        user: {
          displayName: user.name,
          email: user.userName
        },
        error: null
      });
    }
  };

  handleLogout = () => {
    this.setState({ isAuthenticated: false, user: null });
  };

  render() {
    const { isAuthenticated, user } = this.state;

    return (
      <Router>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px', // Adjust padding as needed
        }}
      >
        <NavBar />
        <SignIn
          isAuthenticated={isAuthenticated}
          onLogin={this.handleLogin}
          onLogout={this.handleLogout}
          style={{ marginLeft: '10px' }} // Adjust margin as needed
        />
      </div>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/carpool" element={<Carpool />} />
          <Route path="/bookdesk" element={<BookDesk />} />
          <Route path="/bookmeeting" element={<BookMeeting />} />
          <Route path="/finddesk" element={<FindDesk />} />
          <Route path="/bookteam" element={<BookTeam />} />
          {isAuthenticated && (
            <Route
              path="/tasks"
              element={<Tasks isAuthenticated={isAuthenticated} user={user} />}
            />
          )}
        </Routes>
      </Container>
    </Router>
    );
  }
}

export default App;