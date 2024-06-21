import React, { Component } from "react";
import { sendEmail, getEvents } from "../Tasks/Calendar/GraphFunctions";
import {
  Form,
  FormGroup,
  FormItem,
  Input,
  DatePicker,
  Select,
  Option,
  Button
} from "@ui5/webcomponents-react";
import config from "../Tasks/Calendar/Config";

export default class TeamBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailAddresses: "",
      subject: "",
      body: "",
      events: [],
      date: "",
      building: "",
      floor: "",
      room: "",
      displayName: ""
    };
  }

  async componentDidMount() {
    try {
      // Fetch display name from local storage
      const storedUserDetails = localStorage.getItem("userDetails");
      if (storedUserDetails) {
        const userDetails = JSON.parse(storedUserDetails);
        this.setState({ displayName: userDetails.displayName });
      }

      console.log("Attempting to acquire token silently");
      const accessToken = await window.msal.acquireTokenSilent({
        scopes: config.scopes
      });
      console.log("Access token acquired", accessToken);

      const events = await getEvents(accessToken);
      console.log("Fetched events", events);

      this.setState({ accessToken, events: events.value });
    } catch (err) {
      console.error("Error fetching events", err);
      if (this.props.showError) {
        this.props.showError('ERROR', JSON.stringify(err));
      }
    }
  }

  handleSendEmail = async () => {
    const { accessToken, emailAddresses, body, displayName, date } = this.state;

    if (!accessToken) {
      console.error("Access token is not available");
      return;
    }

    const emailList = emailAddresses.split(',').map(email => email.trim());

    const message = {
      message: {
        subject: `Desk Booked For You by ${displayName}`,
        body: {
          contentType: "Text",
          content: `${displayName} booked a desk for you for ${date}. Please follow this link to verify the booking: http://localhost:3000/verifydesk`
        },
        toRecipients: emailList.map(email => ({ emailAddress: { address: email } }))
      },
      saveToSentItems: "true"
    };

    try {
      const response = await sendEmail(accessToken, message);
      console.log('Email sent successfully', response);
    } catch (error) {
      console.error('Error sending email', error);
    }
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  setBuilding = (event) => {
    this.setState({ building: event.target.value });
  };

  setFloor = (event) => {
    this.setState({ floor: event.target.value });
  };

  setRoom = (event) => {
    this.setState({ room: event.target.value });
  };

  render() {
    const { emailAddresses, date, building, floor, room } = this.state;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingLeft:"15rem",
          width:"50%",
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
            <FormItem label="Email Addresses (comma separated)">
              <Input
                type="text"
                name="emailAddresses"
                value={emailAddresses}
                onChange={this.handleChange}
                style={{ width: "100%" }}
              />
            </FormItem>
         
            <FormItem label="Date">
              <DatePicker
                value={date}
                onChange={(event) => this.setState({ date: event.detail.value })}
                style={{ width: "100%" }}
                formatPattern="yyyy-MM-dd"
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
          </FormGroup>
        </Form>
        <Button color='primary' onClick={this.handleSendEmail}>
          Send Email
        </Button>
      </div>
    );
  }
}
