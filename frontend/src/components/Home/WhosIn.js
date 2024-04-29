import React, { useState, useEffect } from "react";
import { List, StandardListItem, Input, Title } from "@ui5/webcomponents-react";

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
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Title level="H2">Who's In?</Title>
      <br />
      <Input placeholder="Search..." onChange={filter} />

      <List
        style={{
          width: "20rem",
          height: "20rem",
          padding: "1rem",
          margin: "1rem",
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
  );
};
export default WhosIn;
