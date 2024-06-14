import React, { Component } from "react";
import { createEvents, getEvents, getSchedule } from '../../assets/GraphFunctions';
import {
  Form,
  FormGroup,
  FormItem,
  Select,
  Option,
  Button,
  DateTimePicker,
  Input,
  TimePicker
} from "@ui5/webcomponents-react";
import moment from 'moment';
import config from "../Tasks/Calendar/Config";

function formatDateTime(dateTime) {
  return moment.utc(dateTime).local().format('D/M/YY h:mm A');
}

export default class BookMeetingRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      event: {},
      building: '',
      floor: '',
      room: '',
      subject: '',
      startDateTime: '',
      duration: '',
      email: ''
    };

    this.onClick = this.onClick.bind(this);
    this.setBuilding = this.setBuilding.bind(this);
    this.setFloor = this.setFloor.bind(this);
    this.setRoom = this.setRoom.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    try {
      console.log("Attempting to acquire token silently");
      var accessToken = await window.msal.acquireTokenSilent({
        scopes: config.scopes
      });
      console.log("Access token acquired", accessToken);

      var events = await getEvents(accessToken);
      console.log("Fetched events", events);

      this.setState({ events: events.value });
    } catch (err) {
      console.error("Error fetching events", err);
      if (this.props.showError) {
        this.props.showError('ERROR', JSON.stringify(err));
      }
    }
  }

  async onClick() {
    try {
      console.log("Button clicked, attempting to acquire token silently for event creation");
      var accessToken = await window.msal.acquireTokenSilent({
        scopes: config.scopes
      });
      console.log("Access token acquired for event creation", accessToken);

      const { building, floor, room, subject, startDateTime, duration, email } = this.state;

      // Calculate endDateTime based on startDateTime and duration
      const [hours, minutes] = duration.split(':').map(Number);
      const endDateTime = moment(startDateTime).add(hours, 'hours').add(minutes, 'minutes').toISOString();

      // Log the current state values
      console.log("Current state values:", { building, floor, room, subject, startDateTime, endDateTime, email });

    
      const event = {
        subject: subject,
        body: {
          contentType: 'HTML',
        },
        start: {
          dateTime: moment(startDateTime).toISOString(),
          timeZone: 'Europe/Dublin'
        },
        end: {
          dateTime: endDateTime,
          timeZone: 'Europe/Dublin'
        },
        attendees: [
          {
            emailAddress: {
              address: email,
              name: room
            },
            type: 'Required'
          }
        ],
        location: {
          displayName: `${building} - ${floor} - ${room}`,
          locationType: 'Default'
        },
      };

      this.setState({ event: event });
      console.log('Event to be created', event);
    
      await createEvents(accessToken, event);
      console.log('Event created successfully');
    } catch (err) {
      console.error("Error creating event", err);
      if (this.props.showError) {
        this.props.showError('ERROR', JSON.stringify(err));
      }
    }
  }

  setBuilding(event) {
    const building = event.detail.selectedOption.innerText;
    console.log(`Setting state: building = ${building}`);
    this.setState({ building });
  }

  setFloor(event) {
    const floor = event.detail.selectedOption.innerText;
    console.log(`Setting state: floor = ${floor}`);
    this.setState({ floor });
  }

  setRoom(event) {
    const room = event.detail.selectedOption.innerText;
    console.log(`Setting state: room = ${room}`);
    let email = '';
    if (room === "Grafton Street") {
      email = 'graftonstreet-dayplanner@outlook.com';

    } else if (room === "St.Stephens Green") {
      email = 'st.stephensgreen-dayplanner@outlook.com'
    } else if (room === "O'Connell Street") {
      email = 'o.connellstreet-dayplanner@outlook.com';
    }

    this.setState({ room, email });
  }

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  }

  render() {
    const { building, floor, room, subject, startDateTime, duration } = this.state;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Form
          backgroundDesign="Transparent"
          columnsL={1}
          columnsM={1}
          columnsS={1}
          columnsXL={1}
          labelSpanL={4}
          labelSpanM={2}
          labelSpanS={12}
          labelSpanXL={4}
          style={{
            alignItems: "center",
          }}
        >
          <FormGroup titleText="">
            <FormItem label="Subject">
              <Input
                type="text"
                name="subject"
                value={subject}
                onChange={this.handleChange}
                style={{ width: "100%" }}
              />
            </FormItem>
            <FormItem label="Start Date & Time">
              <DateTimePicker
                value={startDateTime}
                onChange={(event) => this.setState({ startDateTime: event.detail.value })}
                style={{ width: "100%" }}
                formatPattern="yyyy-MM-dd'T'HH:mm"
              />
            </FormItem>
            <FormItem label="Duration">
              <TimePicker
                value={duration}
                onChange={(event) => this.setState({ duration: event.detail.value })}
                style={{ width: "100%" }}
                formatPattern="HH:mm"
              />
            </FormItem>
            <FormItem label="Building">
              <Select
                onChange={this.setBuilding}
                selectedKey={building}
                style={{ width: "100%" }}
              >
                <Option>DUB 02</Option>
                <Option>DUB 05</Option>
                <Option>GAL</Option>
              </Select>
            </FormItem>
            <FormItem label="Floor">
              <Select
                onChange={this.setFloor}
                selectedKey={floor}
                style={{ width: "100%" }}
              >
                <Option>Floor 1</Option>
                <Option>Floor 2</Option>
                <Option>Floor 3</Option>
              </Select>
            </FormItem>
            <FormItem label="Room">
              <Select
                onChange={this.setRoom}
                selectedKey={room}
                style={{ width: "100%" }}
              >
                <Option>Grafton Street</Option>
                <Option>St.Stephens Green</Option>
                <Option>O'Connell Street</Option>
              </Select>
            </FormItem>
          </FormGroup>
        </Form>
        <Button color='primary' onClick={this.onClick}>
          Create Event
        </Button>
      </div>
    );
  }
}
