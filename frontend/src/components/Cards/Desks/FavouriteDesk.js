import React from "react";
import { Card, CardHeader, List, Button } from "@ui5/webcomponents-react";

const FavouriteDesk = ({ data }) => {
  return (
    <Card
      header={<CardHeader titleText="Favourite Desk" />}
      style={{
        width: "375px",
      }}
    >
      <List
        headerText="DUB05-3-R" // desk.id
      >
        <Button design="Positive">Book</Button>
        <Button design="Negative">Unfavourite</Button>
      </List>
    </Card>
  );
};

export default FavouriteDesk;
