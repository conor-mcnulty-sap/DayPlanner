import React, { useState } from "react";
import {
  Form,
  Label,
  FormGroup,
  FormItem,
  DateTimePicker,
  TimePicker,
  Select,
  Option,
  Button,
} from "@ui5/webcomponents-react";

const MeetingRoomForm = () => {
  const [dateTime, setDateTime] = useState("");
  const [duration, setDuration] = useState("");

  const openOutlook = () => {
    const startTimeDate = new Date(dateTime);
    const startTime = encodeURIComponent(startTimeDate.toISOString());
    const durationInMs = duration.split(':').reduce((acc,time) => (60 * acc) + +time) * 60000;
    const endTime = encodeURIComponent(new Date(startTimeDate.getTime() + durationInMs).toISOString());
    const subject = encodeURIComponent("Meeting");
    const location = encodeURIComponent("Meeting Room");
    const body = encodeURIComponent("Details of the meeting...");

    const outlookURL = `https://outlook.live.com/owa/?path=/calendar/action/compose&startdt=${startTime}&enddt=${endTime}&subject=${subject}&location=${location}&body=${body}`;

    window.open(outlookURL, "_blank");
  };

  const handleDateTimeChange = (event) => {
    setDateTime(event.target.value);
  };

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

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
          <FormItem label={<Label>Date and Time</Label>}>
            <DateTimePicker
              formatPattern="yyyy-MM-dd HH:mm"
              onChange={handleDateTimeChange}
              onInput={handleDateTimeChange}
              valueState="None"
              style={{ width: "100%" }}
            />
          </FormItem>
          <FormItem label={<Label>Duration</Label>}>
            <TimePicker
              formatPattern="HH:mm"
              onChange={handleDurationChange}
              onInput={handleDurationChange}
              valueState="None"
              style={{ width: "100%" }}
            />
          </FormItem>
          <FormItem label={<Label>Building</Label>}>
            <Select style={{ width: "100%" }}>
              <Option>DUB02</Option>
              <Option>DUB05</Option>
              <Option>GAL</Option>
            </Select>
          </FormItem>
          <FormItem label={<Label>Floor</Label>}>
            <Select style={{ width: "100%" }}>
              <Option>Floor 1</Option>
              <Option>Floor 2</Option>
              <Option>Floor 3</Option>
            </Select>
          </FormItem>
          <FormItem label={<Label>Room</Label>}>
            <Select style={{ width: "100%" }}>
              <Option>Room 1</Option>
              <Option>Room 2</Option>
              <Option>Room 3</Option>
            </Select>
          </FormItem>
        </FormGroup>
      </Form>
      <Button onClick={openOutlook} style={{ display: "flex", justifyContent: "center" }}>
        Open Outlook
      </Button>
    </div>
  );
};

export default MeetingRoomForm;