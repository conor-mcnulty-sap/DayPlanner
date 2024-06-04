import React, { useState } from "react";
import {
  Form,
  FormGroup,
  FormItem,
  Select,
  Option,
  Button,
} from "@ui5/webcomponents-react";
import { createEvents } from "../../assets/GraphFunctions";
import { UserAgentApplication } from 'msal';
import config from "../Tasks/Calendar/Config";


const userAgentApplication = this.userAgentApplication.getAccount();

const MeetingRoomForm = () => {
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [room, setRoom] = useState("");

  const handleBuildingChange = (event) => {
    setBuilding(event.detail.selectedOption.innerText);
  };

  const handleFloorChange = (event) => {
    setFloor(event.detail.selectedOption.innerText);
  };

  const handleRoomChange = (event) => {
    setRoom(event.detail.selectedOption.innerText);
  };

  const createOutlookEvent = async () => {
    try {
      const accessToken = await userAgentApplication.acquireTokenSilent({
        scopes: config.scopes,
      });
      const event = {
        start: {
          dateTime: new Date().toISOString(), // Change this as needed
          timeZone: "UTC",
        },
        end: {
          dateTime: new Date().toISOString(), // Change this as needed
          timeZone: "UTC",
        },
        subject: "Meeting",
        location: {
          displayName: `${building}${floor}${room}`,
        },
        body: {
          content: "Details of the meeting...",
          contentType: "Text",
        },
      };
      await createEvents(accessToken, event);
      alert("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Form>
        <FormGroup titleText="">
          <FormItem label="Building">
            <Select
              onChange={handleBuildingChange}
              style={{ width: "100%" }}
            >
              <Option>DUB02</Option>
              <Option>DUB05</Option>
              <Option>GAL</Option>
            </Select>
          </FormItem>
          <FormItem label="Floor">
            <Select
              onChange={handleFloorChange}
              style={{ width: "100%" }}
            >
              <Option>Floor 1</Option>
              <Option>Floor 2</Option>
              <Option>Floor 3</Option>
            </Select>
          </FormItem>
          <FormItem label="Room">
            <Select
              onChange={handleRoomChange}
              style={{ width: "100%" }}
            >
              <Option>Room 1</Option>
              <Option>Room 2</Option>
              <Option>Room 3</Option>
            </Select>
          </FormItem>
        </FormGroup>
      </Form>
      <Button onClick={createOutlookEvent}>Create Event</Button>
    </div>
  );
};

export default MeetingRoomForm;
