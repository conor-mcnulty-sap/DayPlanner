import React, { useState, useEffect } from "react";
import {
  Form,
  FormGroup,
  FormItem,
  DateRangePicker,
  Select,
  Option,
} from "@ui5/webcomponents-react";

function DeskForm({
  selectedDesk,
  onBuildingChange,
  onFloorChange,
  onDateRangeChange,
}) {
  const [userId, setUserId] = useState("");
  const [building, setBuilding] = useState("3");
  const [floor, setFloor] = useState("3");
  const [dateRange, setDateRange] = useState("");
  const [deskOptions, setDeskOptions] = useState([]);
console.log(building + " " + floor)
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + 7);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
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
    const storedUserDetails = localStorage.getItem("userDetails");
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
    const newDateRange = `${formattedStartDate}-${formattedEndDate}`;
    setDateRange(newDateRange);
    if (onDateRangeChange) {
      onDateRangeChange(newDateRange);
    }
  };
console.log(building + " " + floor)
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
                const selectedBuilding =
                  event.detail.selectedOption.dataset.value;
                setBuilding(selectedBuilding);
              }}
              selectedKey={building}
              style={{ width: "100%" }}
            >
              <Option data-value="3">DUB05</Option>

              <Option data-value="2">DUB03</Option>
            </Select>
          </FormItem>
          <FormItem label="Floor">
            <Select
              onChange={handleFloorChange} // Use the new function here
              selectedKey={floor}
              style={{ width: "100%" }}
            >
              <Option>3</Option>
              <Option>2</Option>
              <Option>1</Option>
            </Select>
          </FormItem>
        </FormGroup>
      </Form>
    </div>
  );
}

export default DeskForm;
