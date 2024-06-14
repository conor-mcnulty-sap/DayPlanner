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

function DeskForm({ selectedDesk, onBuildingChange, onFloorChange }) {
  const [userId, setUserId] = useState('');
  const [building, setBuilding] = useState(
    selectedDesk ? selectedDesk.building : ""
  );
  const [floor, setFloor] = useState(selectedDesk ? selectedDesk.floor : "");
  const [deskId, setDeskId] = useState(selectedDesk ? selectedDesk.deskId : "");
  const [dateRange, setDateRange] = useState("");
  const [deskOptions, setDeskOptions] = useState([]);

  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + 7);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const startString = formatDate(today);
  const endString = formatDate(endDate);

  const defaultRange = `${startString} - ${endString}`;

  useEffect(() => {
    if (building) {
      onBuildingChange(building);
    }
  }, [building]);

  useEffect(() => {
    if (floor) {
      onFloorChange(floor);
    }
  }, [floor]);

  useEffect(() => {
    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      setUserId(userDetails.id);
    }
  }, []);

  useEffect(() => {
    if (floor) {
      const floorNumber = floor.replace("Floor ", "");
      fetch(
        `${process.env.REACT_APP_API_URL}/api/desks/filterbyfloor?floor=${floorNumber}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Desks data:", data);
        })
        .catch((error) => console.error("Error fetching desks:", error));
    }
  }, [floor]);

  const handleFloorChange = (event) => {
    const selectedFloor = event.detail.selectedOption.innerText;
    setFloor(selectedFloor);
    if (onFloorChange) {
      onFloorChange(selectedFloor);
    }
  };

  const handleDateRangeChange = (event) => {
    const [startDate, endDate] = event.detail.value.split(" - ");
    const formattedStartDate = formatDate(new Date(startDate));
    const formattedEndDate = formatDate(new Date(endDate));
    setDateRange(`${formattedStartDate}-${formattedEndDate}`);
  };

  const handleSubmit = () => {
    const data = {
      user_id: userId,
      desk_id: deskId,
      date: dateRange,
    };
  
    console.log("Submitting data:", data);
  
    fetch(`${process.env.REACT_APP_API_URL}/api/bookings/bookdesk?user_id=${userId}&desk_id=${deskId}&date=${dateRange}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        try {
          const data = JSON.parse(text);
          console.log("Response:", data);
        } catch (error) {
          console.log("Response is not valid JSON:", text);
        }
      })
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
              onChange={handleDateRangeChange}
              primaryCalendarType="Gregorian"
              valueState="None"
              defaultValue={defaultRange}
              style={{ width: "100%" }}
            />
          </FormItem>
          <FormItem label="Building">
      <Select
        onChange={(event) => {
          const selectedBuilding = event.detail.selectedOption.innerText;
          setBuilding(selectedBuilding);
        }}
        selectedKey={building}
        style={{ width: "100%" }}
      >
        <Option>2</Option>
        <Option>3</Option>
      </Select>
    </FormItem>
    <FormItem label="Floor">
    <Select
        onChange={handleFloorChange} // Use the new function here
        selectedKey={floor}
        style={{ width: "100%" }}
      >
        <Option>1</Option>
        <Option>2</Option>
        <Option>3</Option>
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
