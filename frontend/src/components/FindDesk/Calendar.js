import React, { useEffect } from "react";
import { Calendar } from "@ui5/webcomponents-react";

const SingleSelectCalendar = () => {
  useEffect(() => {
    // Get userId from local storage
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      const userId = userDetails.id;

      // Define the function to handle date change
      const handleDateChange = (event) => {
        const timestamp = event.detail.dates[0] * 1000;
        const selectedDate = new Date(timestamp);

        const formattedDate = `${selectedDate.getFullYear()}-${String(
          selectedDate.getMonth() + 1
        ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

        const url = `${process.env.REACT_APP_API_URL}/api/bookings/getbookinguserdate?user_id=${userId}&date=${formattedDate}`;
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };

        fetch(url, options)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse response as JSON
          })
          .then((data) => {
            console.log("Data:", data);
            // Handle data accordingly
          })
          .catch((error) => console.error("Error:", error));
      };

      // Attach event listener to calendar
      const calendar = document.querySelector("ui5-calendar");
      calendar.addEventListener("selected-dates-change", handleDateChange);

      // Clean up the event listener when component unmounts
      return () => {
        calendar.removeEventListener("selected-dates-change", handleDateChange);
      };
    }
  }, []);

  return (
    <Calendar
      primaryCalendarType="Gregorian"
      selectionMode="Single"
    />
  );
};

export default SingleSelectCalendar;