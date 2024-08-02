import React, { Component } from "react";
import { Card, CardHeader, StandardListItem, List } from "@ui5/webcomponents-react";
import moment from 'moment';
import { getEvents } from "../../../assets/GraphFunctions";
import config from "./Config";

function formatDateTime(dateTime) {
  return moment.utc(dateTime).local().format('h:mm A');
}

function formatDateTimeRange(start, end) {
  const startTime = formatDateTime(start);
  const endTime = formatDateTime(end);
  return `${startTime} - ${endTime}`;
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

      // Filter out events with the location 'Task'
      const filteredEvents = events.value.filter(event => event.location.displayName !== 'Task');

      // Sort events by start time (earliest first)
      const sortedEvents = filteredEvents.sort((a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime));

      this.setState({ events: sortedEvents });
    } catch (err) {
      this.props.showError('ERROR', JSON.stringify(err));
    }
  }

  render() {
    return (
      <Card header={
        <CardHeader
          titleText="My Calendar"
        />}
        style={{ width: '100%' }}
      >
        <List>
          {this.state.events.map(event => (
            <StandardListItem key={event.id} style={{ borderBottom: '1px solid #ddd', marginBottom: '10px', position: 'relative' }}>
              <div style={{ display: 'flex', left: '10px', alignItems: 'left' }}>
                <div style={{ width: '4px', height: '20px', backgroundColor: 'purple', borderRadius: '2px', marginRight: '10px' }}></div>
                <div>
                  <h4 style={{ margin: '0', textAlign: 'left', color: '#666', fontWeight: 'normal' }}>
                    {formatDateTimeRange(event.start.dateTime, event.end.dateTime)} - {event.subject}
                  </h4>
                  <h5 style={{ margin: '1px 0', textAlign: 'left', color: '#666', fontWeight: 'normal' }}>
                    {event.organizer.emailAddress.name} - {event.location.displayName}
                  </h5>
                </div>
              </div>
            </StandardListItem>
          ))}
        </List>
      </Card>
    );
  }
}
