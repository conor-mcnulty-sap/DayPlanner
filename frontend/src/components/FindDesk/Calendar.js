// Calendar.js
import React from "react";
import { Calendar } from "@ui5/webcomponents-react";

const SingleSelectCalendar = () => {
  const handleDateChange = (event) => {
    console.log(event);

    // Extract the timestamp from the event and convert it to milliseconds
    const timestamp = event.detail.dates[0] * 1000;

    // Convert the timestamp to a Date object
    const selectedDate = new Date(timestamp);

    console.log("Selected date:", selectedDate);
    const formattedDate = `${selectedDate.getFullYear()}-${String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
    console.log("Formatted date:", formattedDate);

    const url = `${process.env.REACT_APP_API_URL}/api/bookings/bookingsbydate?date=${formattedDate}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    console.log("Request:", { url, options });

    fetch(url, options)
      .then((response) => {
        console.log("Response:", response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => {
        console.log("Data:", data);
        if (data) {
          const jsonData = JSON.parse(data);
          console.log("JSON data:", jsonData);
        } else {
          console.log("No data returned from server");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <Calendar
      onSelectedDatesChange={handleDateChange}
      primaryCalendarType="Gregorian"
      selectionMode="Single"
    />
  );
};

export default SingleSelectCalendar;
