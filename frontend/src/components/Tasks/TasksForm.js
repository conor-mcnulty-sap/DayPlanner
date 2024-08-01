import React, { Component, createRef } from 'react';
import {
  Form,
  Input,
  Label,
  TextArea,
  FormGroup,
  FormItem,
  TimePicker,
  Button,
  Card,
  CardHeader,
  Dialog,
  Bar
} from '@ui5/webcomponents-react';
import '@ui5/webcomponents-localization/dist/Assets.js';
import ColorPalettePopoverComponent from './ColourPalette';
import config from "./Calendar/Config";
import { createEvents } from '../../assets/GraphFunctions';
import moment from 'moment';

export default class TaskForm extends Component {
  constructor(props) {
    super(props);

    this.titleRef = createRef();
    this.colourRef = createRef();
    this.timeRef = createRef();
    this.durationRef = createRef();
    this.descRef = createRef();

    this.state = {
      today: new Date().toISOString().split('T')[0],
      userId: '',
      email: '',
      dialogOpen: false,
      selectedColor: '#DF1278' // Set default color
    };
  }

  async componentDidMount() {
    try {
      console.log("Attempting to acquire token silently");
      var accessToken = await window.msal.acquireTokenSilent({
        scopes: config.scopes
      });
      console.log("Access token acquired", accessToken);
    } catch (err) {
      console.log("Failed to acquire access token", err);
    }

    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      this.setState({ userId: userDetails.id, email: userDetails.mail });
    }
  }

  handleColorChange = (color) => {
    this.setState({ selectedColor: color });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const { today, userId, email, selectedColor } = this.state;

    // Get values from refs
    const title = this.titleRef.current ? this.titleRef.current.value : '';
    const colour = selectedColor;
    const time = this.timeRef.current ? this.timeRef.current.value : '';
    const duration = this.durationRef.current ? this.durationRef.current.value : '';
    const desc = this.descRef.current ? this.descRef.current.value : '';

    console.log('Title:', title);
    console.log('Colour:', colour);
    console.log('Date:', today);
    console.log('Time:', time);
    console.log('Duration:', duration);
    console.log('Description:', desc);
    console.log('ID:', userId);
    console.log('Email:', email);

    // Construct the start and end dateTime strings
    const startDateTime = moment(`${today}T${time}`).toISOString();
    const [hours, minutes] = duration.split(':').map(Number);
    const endDateTime = moment(startDateTime).add(hours, 'hours').add(minutes, 'minutes').toISOString();

    try {
      console.log("Button clicked, attempting to acquire token silently for event creation");
      var accessToken = await window.msal.acquireTokenSilent({
        scopes: config.scopes
      });
      console.log("Access token acquired for event creation", accessToken);

      const event = {
        subject: title,
        body: {
          contentType: 'HTML',
          content: desc
        },
        start: {
          dateTime: startDateTime,
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
            },
            type: 'Required'
          }
        ],
        location: {
          displayName: `Task`,
          locationType: 'Default'
        },
      };

      this.setState({ event: event });

      console.log('Event to be created', event);

      const eventResponse = await createEvents(accessToken, event);
      console.log('Event created successfully:', eventResponse);

      const eventId = eventResponse.id;
      console.log('Event ID:', eventId);

      // Proceed with server request after the event is successfully created
      const params = new URLSearchParams({
        user_id: userId,
        task_name: title,
        task_description: desc,
        task_date: today,
        task_time: time,
        task_duration: duration,
        task_colour: colour,
        event_id: eventId // Include the event ID in the parameters
      });

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/addtask?${params.toString()}`, {
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

      // Open dialog after the event is successfully created and the server request is successful
      this.setState({ dialogOpen: true });
    } catch (err) {
      console.error("Error creating event", err);
      if (this.props.showError) {
        this.props.showError('ERROR', JSON.stringify(err));
      }
    }

    // Clear input fields
    if (this.titleRef.current) this.titleRef.current.value = '';
    if (this.timeRef.current) this.timeRef.current.value = '';
    if (this.durationRef.current) this.durationRef.current.value = '';
    if (this.descRef.current) this.descRef.current.value = '';
    if (this.colourRef.current) this.colourRef.current.value = 'null';
  };

  closeDialog = () => {
    this.setState({ dialogOpen: false });
    // Reload the page after closing the dialog
    window.location.reload();
  };

  render() {
    const { dialogOpen, selectedColor } = this.state;

    return (
      <Card header={<CardHeader titleText="Create A Task" />} style={{ width: "100%" }}>
        <Form
          backgroundDesign="Transparent"
          columnsL={1}
          columnsM={1}
          columnsS={1}
          columnsXL={2}
          labelSpanL={4}
          labelSpanM={2}
          labelSpanS={12}
          labelSpanXL={4}
          style={{ paddingLeft: '20px', paddingRight: '20px' }}
          onSubmit={this.handleSubmit}
        >
          <FormGroup>
            <FormItem label={<Label>Title</Label>}>
              <Input type="text" ref={this.titleRef} />
            </FormItem>
            <FormItem label={<Label>Time</Label>}>
              <TimePicker ref={this.timeRef} formatPattern="HH:mm" placeholder="Enter Time" />
            </FormItem>
            <FormItem label={<Label>Duration</Label>}>
              <TimePicker ref={this.durationRef} formatPattern="HH:mm" placeholder="Enter Duration" />
            </FormItem>
            <FormItem label={<Label>Description</Label>}>
              <TextArea placeholder="Description" rows={5} ref={this.descRef} />
            </FormItem>
            <FormItem label={<Label>Colour</Label>}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ColorPalettePopoverComponent ref={this.colourRef} onColorSelect={this.handleColorChange} />
                <div style={{
                  width: '30px',
                  height: '30px',
                  backgroundColor: selectedColor,
                  border: '1px solid #000',
                  marginLeft: '10px',
                  borderRadius: '5px' // Rounded corners
                }} />
              </div>
            </FormItem>
            <FormItem style={{ paddingLeft: "50%" }}>
              <Button type="submit" onClick={this.handleSubmit}>
                Submit
              </Button>
            </FormItem>
          </FormGroup>
        </Form>
        <Dialog
          headerText="Task Added"
          open={dialogOpen}
          footer={
            <Bar design="Footer" endContent={<Button onClick={this.closeDialog}>Close</Button>} />
          }
        >
          Task Added Successfully.
        </Dialog>
      </Card>
    );
  }
}
