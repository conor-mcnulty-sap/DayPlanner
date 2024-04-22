import React from "react";
import { Form, Label, Input, FormGroup, FormItem, TimePicker, DatePicker } from "@ui5/webcomponents-react";

const MeetingRoomForm = () => {
    // todo: Update to use proper form fields
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          paddingLeft: "20px",
        }}
      >
        <Form // Add this line
          backgroundDesign="Transparent"
          columnsL={1}
          columnsM={1}
          columnsS={1}
          columnsXL={2}
          labelSpanL={4}
          labelSpanM={2}
          labelSpanS={12}
          labelSpanXL={4}
        >
          <FormGroup titleText="Book a Meeting Room">
            <FormItem label="Name">
              <Input type="Text" />
            </FormItem>
            <FormItem label={<Label>Date</Label>}>
              <DatePicker
                formatPattern="yyyy-MM-dd"
                onChange={function _a() {}}
                onInput={function _a() {}}
                valueState="None"
              />
            </FormItem>
            <FormItem label={<Label>Time</Label>}>
              <TimePicker
                formatPattern="HH:mm"
                onChange={function _a() {}}
                onInput={function _a() {}}
                valueState="None"
              />
            </FormItem>
          </FormGroup>
        </Form>
      </div>
    );
  };
  
  export default MeetingRoomForm;