import React, { useEffect, useState } from "react";
import { Card, CardHeader, Button } from "@ui5/webcomponents-react";

const FavouriteDesk = ({ userId = "1" }) => {
  const [favouriteDesk, setFavouriteDesk] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/desks/favouritesbyuser?user_id=${userId}`)
      .then((response) => response.json())
      .then((data) => setFavouriteDesk(data))
      .catch((error) => console.error(error));
  }, [userId]);

  return (
    <Card header={<CardHeader titleText="Favourite Desk" />}>
      {favouriteDesk && favouriteDesk.length > 0 ? (
        <Card
          header={<CardHeader titleText={favouriteDesk[0].desk_id} />}
          // Adjusted margin
        >
          <Button design="Positive" style={{ marginRight: "20px" }}>
            Book
          </Button>
          <Button design="Negative">Unfavourite</Button>
        </Card>
      ) : (
        <Card
          header={<CardHeader titleText="No Favourite Chosen!" />}
           // Adjusted margin
        >
          <Button design="Positive" style={{ marginRight: "20px" }}>
            Book a Desk
          </Button>
          
        </Card>
      )}
    </Card>
  );
};

export default FavouriteDesk;