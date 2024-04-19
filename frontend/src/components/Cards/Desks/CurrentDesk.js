import React from "react";
import { Card, CardHeader, List, Button } from "@ui5/webcomponents-react";

const CurrentDesk = ( { data } ) => {
    // Implement function to check if user has a booking
    // const hasBooking = () => {

    if(false) {
        return (
            <Card
              header={
                <CardHeader
                  titleText="Current Desk"
                />
              }
              style={{
                width: "375px",
              }}
            >
              <List
                headerText="DUB05-3-R" // desk.id
                footerText="[might be unneeded]" // last booking date.
                >
                  <Button design="Negative">
                    Cancel Booking
                  </Button>
                </List>
            </Card>
          );
    } else {
        return (
            <Card
              header={
                <CardHeader
                  titleText="Current Desk"
                />
              }
              style={{
                width: "375px",
              }}
            >
              <List
                headerText="No desk booked"
                >
                  <Button design="Positive">
                    Book
                  </Button>
                </List>
            </Card>
          );
    }
}
export default CurrentDesk;