import { useState, useEffect } from "react";

export function useGetMeetingRooms(
  start_date_time,
  building,
  floor,
  end_date_time
) {
  const [bookedMeetingRooms, setBookedMeetingRooms] = useState([]);

  useEffect(() => {
    const validateDateTimeFormat = (dateTime) => {
      // Updated regex to match "yyyy-MM-dd HH:mm" format
      const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
      return regex.test(dateTime);
    };

    const formatDateTime = (dateTime) => {
      // Assuming the dateTime is in "yyyy-MM-dd HH:mm:ss" format
      // and we want to convert it to "yyyy-MM-dd HH:mm"
      return dateTime.slice(0, 16);
    };

    const getBookings = async () => {
      // Format start_date_time and end_date_time to remove seconds
      const formattedStartDateTime = formatDateTime(start_date_time);
      const formattedEndDateTime = formatDateTime(end_date_time);

      if (
        !validateDateTimeFormat(formattedStartDateTime) ||
        !validateDateTimeFormat(formattedEndDateTime)
      ) {
        console.error(
          "Invalid date time format. Expected format: yyyy-MM-dd HH:mm"
        );
        return; // Exit the function or handle the error as needed
      }

      fetch(
        `${process.env.REACT_APP_API_URL}/api/meetingrooms/checkavailabilitybuildingfloor?start_date_time=${formattedStartDateTime}&building=${building}&floor=${floor}&end_date_time=${formattedEndDateTime}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error fetching bookings: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          const bookedMeetingRoomIds = data.map((booking) => booking.id);
          setBookedMeetingRooms(bookedMeetingRoomIds);
        })
        .catch((error) => {
          console.error(`Error fetching bookings: ${error}`);
        });
    };

    getBookings();
  }, [start_date_time, building, floor, end_date_time]);

  return bookedMeetingRooms;
}