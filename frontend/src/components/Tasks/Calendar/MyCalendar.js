import React, { Component } from "react";
import { Table, Card, CardHeader } from "@ui5/webcomponents-react";
import moment from 'moment';
import { getEvents } from "./GraphFunctions";
import config from "./Config";

function formatDateTime(dateTime) {
  return moment
    .utc(dateTime)
    .local()
    .format('D/M/YY h:mm A');
}

export default class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: []
    };
  }

  async componentDidMount() {
    try {
      const accessToken = await window.msal.acquireTokenSilent({
        scopes: config.scopes
      });
      const events = await getEvents(accessToken);
  
      this.setState({ events: events.value });
    } catch (err) {
      this.props.showError('ERROR', JSON.stringify(err));
    }
  }

  render() {
    return (
      <Card header={
        <CardHeader
          titleText="My Calendar"
        />
      }
      style={{
        paddingLeft: "20px",
        width: "500px"
      }}
    >
 
        <thead>
          <tr>
            <th scope='col'>Organizer</th>
            <th scope='col'>Subject</th>
            <th scope='col'>Start</th>
            <th scope='col'>End</th>
          </tr>
        </thead>
        <tbody>
          {this.state.events.map(event => (
            <tr key={event.id} style={{ height: '30px' }}>
              <td style={{ padding: '10px' }}>{event.organizer.emailAddress.name}</td>
              <td style={{ padding: '10px' }}>{event.subject}</td>
              <td style={{ padding: '10px' }}>{formatDateTime(event.start.dateTime)}</td>
              <td style={{ padding: '10px' }}>{formatDateTime(event.end.dateTime)}</td>
            </tr>
          ))}
        </tbody>
      
    </Card>
    );
  }
}