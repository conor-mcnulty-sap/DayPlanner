import React from "react";
import { Card, CardHeader, List, Button } from "@ui5/webcomponents-react";

const LastBooked = () => {
  const lastBooked = {
    id: "DUB05-3-R",
    date: "2021-09-01",
  };

  return (
    <Card
      header={<CardHeader titleText="Last Booked Desk" />}
      style={{
        width: "375px",
      }}
    >
      <List
        headerText={`${lastBooked.id}`} // desk.id
      >
        <Button design="Positive">Book</Button>
      </List>
    </Card>
  );
};

export default LastBooked;
