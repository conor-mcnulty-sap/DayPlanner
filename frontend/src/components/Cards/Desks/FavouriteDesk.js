import React from "react";
import { Card, CardHeader, Button } from "@ui5/webcomponents-react";

const FavouriteDesk = ({ data }) => {
  return (
    <Card header={<CardHeader titleText="Favourite Desk" />}>
      <Card
        header={<CardHeader titleText="DUB05-3-R" />}
        style={{ width: "90%", margin: "1rem" }} // Adjusted margin
      >
        <Button design="Positive" style={{ marginRight: "20px" }}>
          Book
        </Button>
        <Button design="Negative">Unfavourite</Button>
      </Card>
    </Card>
  );
};

export default FavouriteDesk;
