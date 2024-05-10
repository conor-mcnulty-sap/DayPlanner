import React from "react";
import {
  Form,
  Label,
  FormGroup,
  FormItem,
  DateTimePicker,
  Select,
  Option,
  Button,
} from "@ui5/webcomponents-react";

const MeetingRoomForm = () => {
  const openOutlook = () => {
    window.open("https://outlook.live.com/", "_blank");
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
              onChange={function _a() {}}
              onInput={function _a() {}}
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