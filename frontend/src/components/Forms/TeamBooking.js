import React, { useState, useEffect } from "react";
import {
  Form,
  FormGroup,
  FormItem,
  Button,
  DateRangePicker,
  Select,
  Option,
  Dialog,
  Bar,
  TextArea,
} from "@ui5/webcomponents-react";
import { sendEmail, getEvents } from "../Tasks/Calendar/GraphFunctions";
import config from "../Tasks/Calendar/Config";

function TeamBooking({
  selectedDesks,
  onBuildingChange,
  onFloorChange,
  onDateRangeChange,
}) {
  const [userId, setUserId] = useState("");
  const [building, setBuilding] = useState("3"); // Default building
  const [floor, setFloor] = useState("3"); // Default floor
  const [dateRange, setDateRange] = useState("");
  const [deskOptions, setDeskOptions] = useState([]);
  const [emailAddresses, setEmailAddresses] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");

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

  useEffect(() => {
    console.log("Selected desks:", selectedDesks);
  }, [selectedDesks]);

  const handleBuildingChange = (event) => {
    const selectedBuilding = event.detail.selectedOption.dataset.value;
    setBuilding(selectedBuilding);
    if (onBuildingChange) {
      onBuildingChange(selectedBuilding);
      console.log("Selected building", selectedBuilding);
    }
  };

  const handleFloorChange = (event) => {
    const selectedFloor = event.detail.selectedOption.dataset.value;
    setFloor(selectedFloor);
    if (onFloorChange) {
      onFloorChange(selectedFloor);
      console.log("Selected floor", selectedFloor);
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

  const processEmailAddresses = (input) => {
    const normalizedInput = input
      .replace(/\s+and\s+/gi, ",")
      .replace(/[\s,;]+|&+/g, ",")
      .replace(/^,|,$/g, "");

    const emailList = normalizedInput
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");

    console.log("Processed email list:", emailList);
    return emailList;
  };

  const handleSendEmail = async () => {
    if (!accessToken) {
      console.error("Access token is not available");
      return;
    }

    const emailList = processEmailAddresses(emailAddresses);

    if (emailList.length === 0 || selectedDesks.length === 0) {
      setDialogOpen(true);
      setDialogContent(
        "Please select desks and enter email addresses."
      );
      return;
    }

    if (emailList.length !== selectedDesks.length) {
      setDialogOpen(true);
      setDialogContent(
        "The number of emails does not match the number of selected desks."
      );
      return;
    }

    const messages = emailList.map((email, index) => ({
      subject: `Desk Booked For You by ${displayName}`,
      body: {
        contentType: "Text",
        content: `${displayName} booked desk ${selectedDesks[index]} for you for ${dateRange}. Please follow this link to verify the booking: http://localhost:3000/verifydesk`,
      },
      toRecipients: [{ emailAddress: { address: email } }],
    }));

    console.log("Email messages to be sent:", messages);

    try {
      for (const message of messages) {
        await sendEmail(accessToken, { message, saveToSentItems: "true" });
      }

      console.log("Emails sent successfully");
    } catch (error) {
      console.error("Error sending emails", error);
      setError("Failed to send emails. Please try again.");
    }
  };

  const handleBookDesks = () => {
    const emailList = processEmailAddresses(emailAddresses);

    if (emailList.length === 0 || selectedDesks.length === 0) {
      setDialogOpen(true);
      setDialogContent(
        "Please select desks and enter email addresses."
      );
      return;
    }

    if (emailList.length !== selectedDesks.length) {
      setDialogOpen(true);
      setDialogContent(
        "The number of emails does not match the number of selected desks."
      );
      return;
    }

    const bookingDetails = [];

    selectedDesks.forEach((deskId, index) => {
      const bookingDetail = {
        deskId: deskId,
        email: emailList[index],
      };

      bookingDetails.push(bookingDetail);

      fetch(
        `${process.env.REACT_APP_API_URL}/api/teambooking/bookdesk?user_email=${emailList[index]}&desk_id=${deskId}&date=${dateRange}`,
        {
          method: "POST",
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          console.log(`Desk ${deskId} booked`);
        })
        .catch((error) => {
          console.error(error);
          console.log("Booking details:", bookingDetail);
        });
    });

    setError("");
    setDialogOpen(true);
    setDialogContent(
      ` <text> Desks Booked Successfully</text>
      <table>
        <thead>
          <tr>
            <th>Desk ID</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          ${bookingDetails
            .map(
              (detail) => `
            <tr>
              <td>${detail.deskId}</td>
              <td>${detail.email}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>`
    );
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogContent("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "10rem",
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
          <FormItem label="Email Addresses">
            <TextArea
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
              onChange={handleBuildingChange}
              selectedKey={building}
              style={{ width: "100%" }}
            >
              <Option data-value="3">DUB05</Option>
              <Option data-value="2">DUB03</Option>
            </Select>
          </FormItem>
          <FormItem label="Floor">
            <Select
              value={floor} // This ensures the default value is reflected
              onChange={handleFloorChange}
              style={{ width: "100%" }}
            >
              <Option data-value="3">3</Option>
              <Option data-value="2">2</Option>
              <Option data-value="1">1</Option>
            </Select>
          </FormItem>
        </FormGroup>
      </Form>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Button
        onClick={() => {
          handleSendEmail();
          handleBookDesks();
        }}
      >
        Book Desks
      </Button>

      <Dialog
        headerText="Booking Status"
        open={dialogOpen}
        onClose={closeDialog}
        footer={
          <Bar
            design="Footer"
            endContent={<Button onClick={closeDialog}>Close</Button>}
          />
        }
      >
        <div dangerouslySetInnerHTML={{ __html: dialogContent }} />
      </Dialog>
    </div>
  );
}

export default TeamBooking;
