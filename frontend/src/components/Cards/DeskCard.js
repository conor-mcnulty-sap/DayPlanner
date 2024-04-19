import React from "react";
import { Card, CardHeader, List, Icon, StandardListItem } from "@ui5/webcomponents-react";

const DeskCard = ( { data } ) => {
  return (
    <Card
      header={
        <CardHeader
          avatar={<Icon name="appointment" />}
          titleText="Last Booked Desk"
          subtitleText="lorem ipsum"
        />
      }
      style={{
        width: "300px",
      }}
    >
      <List>
        <StandardListItem>
          DUB05-3-R
        </StandardListItem>
      </List>
    </Card>
  );
};

export default DeskCard;