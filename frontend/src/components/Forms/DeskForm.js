import React, { useState, useEffect } from "react";
import {
  Form,
  FormGroup,
  FormItem,
  Input,
  Button,
  DateRangePicker,
  Select,
  Option,
} from "@ui5/webcomponents-react";

function DeskForm({ selectedDesk }) {
  const [userId, setUserId] = useState("1");
  const [building, setBuilding] = useState(
    selectedDesk ? selectedDesk.building : ""
  );
  const [floor, setFloor] = useState(selectedDesk ? selectedDesk.floor : "");
  const [deskId, setDeskId] = useState(selectedDesk ? selectedDesk.deskId : "");
  const [dateRange, setDateRange] = useState("");

  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + 7); // set the end date to 7 days from today

  const startString = today.toISOString().split("T")[0];
  const endString = endDate.toISOString().split("T")[0];

  const defaultRange = `${startString} - ${endString}`;
  useEffect(() => {
    if (floor) {
      const floorNumber = floor.replace("Floor ", "");
      fetch(
        `${process.env.REACT_APP_API_URL}/api/desks/filterbyfloor?floor=${floorNumber}`
      )
        .then((response) => response.json())
        .then((data) => {
          // Do something with the desks data
          console.log(data);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [floor]);

  const handleSubmit = () => {
    const data = {
      user_id: userId,
      desk_id: deskId,
      date: dateRange, // send the entire date range
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
          <FormItem>
            <DateRangePicker
              onChange={(event) => setDateRange(event.detail.value)}
              primaryCalendarType="Gregorian"
              valueState="None"
              defaultValue={defaultRange}
              style={{ width: "100%" }}
            />
          </FormItem>
          <FormItem label="Building">
            <Select
              onChange={(event) =>
                setBuilding(event.detail.selectedOption.innerText)
              }
              selectedKey={building}
              style={{ width: "100%" }}
            >
              {/* Replace with your actual building options */}
              <Option>DUB 02</Option>
              <Option>DUB 05</Option>
              <Option>GAL</Option>
            </Select>
          </FormItem>
          <FormItem label="Floor">
            <Select
              onChange={(event) =>
                setFloor(event.detail.selectedOption.innerText)
              }
              selectedKey={floor}
              style={{ width: "100%" }}
            >
              {/* Replace with your actual floor options */}
              <Option>Floor 1</Option>
              <Option>Floor 2</Option>
              <Option>Floor 3</Option>
            </Select>
          </FormItem>
          <FormItem label="Desk">
            <Select
              onChange={(event) =>
                setDeskId(event.detail.selectedOption.innerText)
              }
              selectedKey={deskId}
              style={{ width: "100%" }}
            >
              {/* Replace with your actual desk options */}
              <Option>Desk 1</Option>
              <Option>Desk 2</Option>
              <Option>Desk 3</Option>
            </Select>
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
