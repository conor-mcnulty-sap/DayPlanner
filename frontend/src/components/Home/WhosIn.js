import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  List,
  StandardListItem,
  Input,
  Title,
} from "@ui5/webcomponents-react";

const WhosIn = () => {
  const [users, setUsers] = useState([]);
  const [foundUsers, setFoundUsers] = useState([]);

  useEffect(() => {
    fetch("/whosin.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setFoundUsers(data);
      })
      .catch((error) => console.log("Fetching failed: ", error));
  }, []);

  const filter = (e) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const results = users.filter((user) => {
        return user.name.toLowerCase().startsWith(keyword.toLowerCase());
      });
      setFoundUsers(results);
    } else {
      setFoundUsers(users);
    }
  };

  return (
    <Card
      header={<CardHeader titleText="Who's In?" />}
      style={{ width: "100%", maxHeight: "50vh"}}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Input
          placeholder="Search..."
          onChange={filter}
          style={{ marginBottom: "1rem", marginTop: "1rem" }}
        />

        <List
          style={{
            width: "100%",
            maxHeight: "50vh",
            overflowY: "auto",
          }}
        >
          {foundUsers.map((user) => (
            <StandardListItem key={user.id}>
              {user.id} - {user.name}
              <br />
              {user.desk}
            </StandardListItem>
          ))}
        </List>
      </div>
    </Card>
  );
};
export default WhosIn;