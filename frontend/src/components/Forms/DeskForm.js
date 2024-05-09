import React, { useState } from "react";
import {
  Form,
  FormGroup,
  FormItem,
  Input,
  Button,
  DateRangePicker,
} from "@ui5/webcomponents-react";

function DeskForm({ selectedDesk }) {
  const [userId, setUserId] = useState("1");
  const [deskId, setDeskId] = useState("");
  const [dateRange, setDateRange] = useState("");

  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + 7); // set the end date to 7 days from today

  const startString = today.toISOString().split("T")[0]; // format the start date as "yyyy-mm-dd"
  const endString = endDate.toISOString().split("T")[0]; // format the end date as "yyyy-mm-dd"

  const defaultRange = `${startString} - ${endString}`; // create a range from the start date to the end date

  const handleSubmit = () => {
    const startDate = dateRange.split(" - ")[0];
  
    const data = {
      user_id: userId,
      desk_id: deskId,
      date: startDate,
    };
  
    fetch(`${process.env.REACT_APP_API_URL}/api/bookings/bookdesk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  };

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
            <Input
              type="Text"
              value={deskId}
              onChange={(event) => setDeskId(event.target.value)}
            />
          </FormItem>
          <FormItem>
            <DateRangePicker
              onChange={(event) => setDateRange(event.detail.value)}
              primaryCalendarType="Gregorian"
              valueState="None"
              defaultValue={defaultRange}
            />
          </FormItem>
        </FormGroup>
      </Form>
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
}

export default DeskForm;