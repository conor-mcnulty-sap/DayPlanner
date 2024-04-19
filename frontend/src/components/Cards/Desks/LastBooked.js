import React from "react";
import { Card, CardHeader, List, Button } from "@ui5/webcomponents-react";

const LastBooked = ( { data } ) => {

  return (
    <Card
      header={
        <CardHeader
          titleText="Last Booked Desk"
        />
      }
      style={{
        width: "375px",
      }}
    >
      <List
        headerText="DUB05-3-R" // desk.id
        footerText="Last booked on 2021-09-01 [could be moved]" // last booking date.
        >
          <Button design="Positive">
            Book
          </Button>
        </List>
    </Card>
  );
};

export default LastBooked;