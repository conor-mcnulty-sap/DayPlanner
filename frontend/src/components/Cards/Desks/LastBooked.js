import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  List,
  Button,
  StandardListItem,
} from "@ui5/webcomponents-react";

const LastBooked = ({ userId = "1" }) => {
  const [lastBooked, setLastBooked] = useState([]);
  console.log(userId);
  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_URL}/api/bookings/lastbooked?user_id=${userId}`
    )
      .then((response) => response.json())
      .then((data) => setLastBooked(data))
      .catch((error) => console.error(error));
  }, [userId]);

  console.log(lastBooked);

  return (
    <Card header={<CardHeader titleText="Last Booked Desk" />}>
      {lastBooked && lastBooked.length > 0 ? (
        <List
          headerText={`${lastBooked[0].desk_id}`} // desk.id
        >
          <StandardListItem>{lastBooked[0].date}</StandardListItem>
          <Button design="Positive">Book</Button>
        </List>
      ) : (
        <List>No desk booked</List>
      )}
    </Card>
  );
};

export default LastBooked;