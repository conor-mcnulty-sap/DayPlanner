import React, { Component } from "react";
import { createEvents, getEvents } from '../../assets/GraphFunctions';
import {
  Form,
  FormGroup,
  FormItem,
  Select,
  Option,
  Button,
  DateTimePicker,
  Input,
  TimePicker,
  Dialog,
  Bar
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
      email: '',
      dialogOpen: false,
      dialogMessage: '',
      meetingRooms: [],  // New state variable to store meeting rooms
      filteredRooms: []  // New state variable to store filtered rooms
    };

    this.onClick = this.onClick.bind(this);
    this.setBuilding = this.setBuilding.bind(this);
    this.setFloor = this.setFloor.bind(this);
    this.setRoom = this.setRoom.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.filterRooms = this.filterRooms.bind(this);
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
  
      // Fetch the list of meeting rooms from the API
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/meetingrooms`);
      if (response.ok) {
        const meetingRooms = await response.json();
        console.log("Fetched meeting rooms", meetingRooms); // Log fetched meeting rooms here
        this.setState({ meetingRooms });
      } else {
        console.error("Error fetching meeting rooms", response.status);
      }
    } catch (err) {
      console.error("Error fetching events", err);
      if (this.props.showError) {
        this.props.showError('ERROR', JSON.stringify(err));
      }
    }
  }

  async checkRoomAvailability() {
    const { room, startDateTime, duration } = this.state;
    const formattedStartDateTime = moment(startDateTime).format('YYYY-MM-DD HH:mm:ss');
    const [hours, minutes] = duration.split(':').map(Number);
    const endDateTime = moment(formattedStartDateTime).add(hours, 'hours').add(minutes, 'minutes').format('YYYY-MM-DD HH:mm:ss');

    const queryParams = new URLSearchParams({
      meeting_room: room,
      start_date_time: formattedStartDateTime,
      end_date_time: endDateTime
    });

    const url = `${process.env.REACT_APP_API_URL}/api/meetingrooms/bookmeetingroom?${queryParams.toString()}`;
    console.log("URL being sent to the backend:", url);

    const response = await fetch(url, {
      method: 'POST',
    });

    console.log("Request URL:", url);

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    let result;

    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      result = await response.text();
    }

    console.log("Response from the backend:", result);
    return result;
  }

  async onClick() {
    try {
      const { building, floor, room, subject, startDateTime, duration, email } = this.state;

      // Check room availability
      const availability = await this.checkRoomAvailability();
      if (availability === "Meeting Room already booked for that date and time") {
        this.setState({ dialogOpen: true, dialogMessage: "Meeting room already booked." });
        return;
      }

      console.log("Button clicked, attempting to acquire token silently for event creation");
      var accessToken = await window.msal.acquireTokenSilent({
        scopes: config.scopes
      });
      console.log("Access token acquired for event creation", accessToken);

      const formattedStartDateTime = moment(startDateTime).format('YYYY-MM-DD HH:mm:ss');
      const [hours, minutes] = duration.split(':').map(Number);
      const endDateTime = moment(formattedStartDateTime).add(hours, 'hours').add(minutes, 'minutes').toISOString();

      console.log("Current state values:", { building, floor, room, subject, formattedStartDateTime, endDateTime, email });

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
      this.setState({ dialogOpen: true, dialogMessage: "Meeting Room Booked successfully." });
    } catch (err) {
      console.error("Error creating event", err);
      this.setState({ dialogOpen: true, dialogMessage: "Error booking the meeting room." });
      if (this.props.showError) {
        this.props.showError('ERROR', JSON.stringify(err));
      }
    }
  }

  setBuilding(event) {
    const displayBuilding = event.detail.selectedOption.innerText;
    const building = displayBuilding === "DUB03" ? "DUB02" : displayBuilding;
    console.log(`Setting state: building = ${building}`);
    this.setState({ building }, this.filterRooms);
  }

  setFloor(event) {
    const floor = event.detail.selectedOption.innerText;
    console.log(`Setting state: floor = ${floor}`);
    this.setState({ floor }, this.filterRooms);
  }

  setRoom(event) {
    const selectedRoom = event.detail.selectedOption.innerText;
    const selectedMeetingRoom = this.state.meetingRooms.find(room => room.meeting_room === selectedRoom);
    if (selectedMeetingRoom) {
      this.setState({ room: selectedRoom, email: selectedMeetingRoom.email });
      console.log("Room set:", selectedRoom, "Email set:", selectedMeetingRoom.email);
    }
  }

  filterRooms() {
    const { building, floor, meetingRooms } = this.state;


    const filteredRooms = meetingRooms.filter(meetingRoom => {
      const matchBuilding = meetingRoom.building === building;
      const matchFloor = String(meetingRoom.floor) === String(floor);
      
      return matchBuilding && matchFloor;
    });

    console.log(`Filtered rooms for building ${building} and floor ${floor}:`, filteredRooms);
    this.setState({ filteredRooms });
  }

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  }

  closeDialog() {
    this.setState({ dialogOpen: false });
    // Optionally reload the page or handle additional logic
    window.location.reload();
  }

  render() {
    const { building, floor, room, subject, startDateTime, duration, dialogOpen, dialogMessage, filteredRooms } = this.state;

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
                <Option key="DUB03">DUB03</Option>
                <Option key="DUB05">DUB05</Option>
              </Select>
            </FormItem>
            <FormItem label="Floor">
              <Select
                onChange={this.setFloor}
                selectedKey={floor}
                style={{ width: "100%" }}
              >
                <Option key="1">1</Option>
                <Option key="2">2</Option>
                <Option key="3">3</Option>
              </Select>
            </FormItem>
            <FormItem label="Room">
              <Select
                onChange={this.setRoom}
                selectedKey={room}
                style={{ width: "100%" }}
              >
                {filteredRooms.map((meetingRoom) => (
                  <Option key={meetingRoom.id}>{meetingRoom.meeting_room}</Option>
                ))}
              </Select>
            </FormItem>
          </FormGroup>
        </Form>
        <Button color='primary' onClick={this.onClick}>
          Create Event
        </Button>
  
        <Dialog
          headerText="Booking Status"
          autoFocus={true}
          footer={
            <Bar
              endContent={<Button design="Emphasized" onClick={this.closeDialog}>OK</Button>}
            />
          }
          open={dialogOpen}
          onAfterClose={this.closeDialog}
        >
          <p>{dialogMessage}</p>
        </Dialog>
      </div>
    );
  }
}
