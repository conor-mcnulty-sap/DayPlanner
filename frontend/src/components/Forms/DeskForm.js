import React, { useEffect, useRef } from "react";
import {
  Form,
  FormGroup,
  FormItem,
  Input,
  Button,
  DateRangePicker,
} from "@ui5/webcomponents-react";

function DeskForm({ selectedDesk }) {
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + 7); // set the end date to 7 days from today

  const startString = today.toISOString().split("T")[0]; // format the start date as "yyyy-mm-dd"
  const endString = endDate.toISOString().split("T")[0]; // format the end date as "yyyy-mm-dd"

  const defaultRange = `${startString} - ${endString}`; // create a range from the start date to the end date

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
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
          <FormItem label="Building">
            <Input
              type="Text"
              value={selectedDesk ? selectedDesk.building : ""}
            />
          </FormItem>
          <FormItem label="Floor">
            <Input type="Text" value={selectedDesk ? selectedDesk.floor : ""} />
          </FormItem>
          <FormItem label="Desk">
            <Input type="Text" value={selectedDesk ? selectedDesk.popup : ""} />
          </FormItem>
          <FormItem>
            <DateRangePicker
              onChange={function _a() {}}
              onInput={function _a() {}}
              onValueStateChange={function _a() {}}
              primaryCalendarType="Gregorian"
              valueState="None"
              defaultValue={defaultRange}
            />
          </FormItem>
        </FormGroup>
      </Form>
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Button
          ref={{
            current: "[Circular]",
          }}
          onClick={function _a() {}}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default DeskForm;
