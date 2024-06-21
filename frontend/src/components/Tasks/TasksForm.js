import React, { Component } from 'react';
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
} from '@ui5/webcomponents-react';
import '@ui5/webcomponents-localization/dist/Assets.js';
import ColorPalettePopoverComponent from './ColourPalette';
import config from "./Calendar/Config";
import { createEvents, getEvents } from '../../assets/GraphFunctions';
import moment from 'moment';

export default class TaskForm extends Component {
  constructor(props) {
    super(props);

    this.titleRef = React.createRef();
    this.colourRef = React.createRef();
    this.timeRef = React.createRef();
    this.descRef = React.createRef();

    this.state = {
      today: new Date().toISOString().split('T')[0],
      userId: '',
      email:'',
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

  handleSubmit = async (event) => {
    event.preventDefault();

    const { today, userId, email } = this.state;

    // Get values from refs
    const title = this.titleRef.current ? this.titleRef.current.value : '';
    const colour = this.colourRef.current ? this.colourRef.current.getColor() : '';
    const time = this.timeRef.current ? this.timeRef.current.value : '';
    const desc = this.descRef.current ? this.descRef.current.value : '';

    console.log('Title:', title);
    console.log('Colour:', colour);
    console.log('Date:', today);
    console.log('Time:', time);
    console.log('Description:', desc);
    console.log('ID:', userId);
    console.log('Email:', email);

    const params = new URLSearchParams({
      user_id: userId,
      task_name: title,
      task_description: desc,
      task_date: today,
      task_time: time,
      task_colour: colour,
    });

    try {
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

      // Construct the start and end dateTime strings
      const startDateTime = moment(`${today}T${time}`).toISOString();
      const endDateTime = moment(startDateTime).add(1, 'hours').toISOString();

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

      await createEvents(accessToken, event);
      console.log('Event created successfully');
      alert("Task Added.");
      
      // Reload the page after the event is successfully created
      window.location.reload();
    } catch (err) {
      console.error("Error creating event", err);
      if (this.props.showError) {
        this.props.showError('ERROR', JSON.stringify(err));
      }
    }

    // Clear input fields
    if (this.titleRef.current) this.titleRef.current.value = '';
    if (this.timeRef.current) this.timeRef.current.value = '';
    if (this.descRef.current) this.descRef.current.value = '';
    if (this.colourRef.current) this.colourRef.current.value = 'null';
  };

  render() {
    const { today } = this.state;

    return (
      <Card header={<CardHeader titleText="Create A Task" />} style={{width:"100%"}}>
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
            <FormItem label={<Label>Description</Label>}>
              <TextArea placeholder="Description" rows={5} ref={this.descRef} />
            </FormItem>
            <FormItem label={<Label>Colour</Label>}>
              <ColorPalettePopoverComponent ref={this.colourRef} />
            </FormItem>
            <FormItem style={{paddingLeft:"50%"}}>
              <Button type="submit" onClick={this.handleSubmit} >
                Submit
              </Button>
              </FormItem>
          </FormGroup>
        </Form>
      </Card>
    );
  }
}
