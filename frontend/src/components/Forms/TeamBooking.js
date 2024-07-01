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
import { sendEmail, getEvents } from "../Tasks/Calendar/GraphFunctions";
import config from "../Tasks/Calendar/Config";

function TeamBooking({
  selectedDesk,
  onBuildingChange,
  onFloorChange,
  onDateRangeChange,
}) {
  const [userId, setUserId] = useState("");
  const [building, setBuilding] = useState(
    selectedDesk ? selectedDesk.building : ""
  );
  const [floor, setFloor] = useState(selectedDesk ? selectedDesk.floor : "");
  const [deskId, setDeskId] = useState(selectedDesk ? selectedDesk.deskId : "");
  const [dateRange, setDateRange] = useState("");
  const [deskOptions, setDeskOptions] = useState([]);
  const [emailAddresses, setEmailAddresses] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [accessToken, setAccessToken] = useState("");

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
      setDisplayName(userDetails.displayName);
    }

    const fetchAccessTokenAndEvents = async () => {
      try {
        console.log("Attempting to acquire token silently");
        const token = await window.msal.acquireTokenSilent({
          scopes: config.scopes,
        });
        console.log("Access token acquired", token);

        const eventsData = await getEvents(token);
        console.log("Fetched events", eventsData);

        setAccessToken(token);
      } catch (err) {
        console.error("Error fetching events", err);
      }
    };

    fetchAccessTokenAndEvents();
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
          setDeskOptions(data);
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

  const handleSendEmail = async () => {
    if (!accessToken) {
      console.error("Access token is not available");
      return;
    }

    const emailList = emailAddresses.split(",").map((email) => email.trim());

    const message = {
      message: {
        subject: `Desk Booked For You by ${displayName}`,
        body: {
          contentType: "Text",
          content: `${displayName} booked a desk for you for ${dateRange}. Please follow this link to verify the booking: http://localhost:3000/verifydesk`,
        },
        toRecipients: emailList.map((email) => ({
          emailAddress: { address: email },
        })),
      },
      saveToSentItems: "true",
    };

    console.log("Email message to be sent:", message);

    try {
      const response = await sendEmail(accessToken, message);
      console.log("Email sent successfully", response);
    } catch (error) {
      console.error("Error sending email", error);
    }
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
          <FormItem label="Email Addresses (comma separated)">
            <Input
              type="text"
              name="emailAddresses"
              value={emailAddresses}
              onChange={(e) => setEmailAddresses(e.target.value)}
              style={{ width: "100%" }}
            />
          </FormItem>
          <FormItem label="Dates">
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
              <Option data-value="2">DUB03</Option>
              <Option data-value="3">DUB05</Option>
            </Select>
          </FormItem>
          <FormItem label="Floor">
            <Select
              onChange={handleFloorChange}
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
      <Button color="primary" onClick={handleSendEmail}>
        Send Email
      </Button>
    </div>
  );
}

export default TeamBooking;
