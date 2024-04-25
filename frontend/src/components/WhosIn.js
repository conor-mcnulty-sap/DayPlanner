import React, { useState } from 'react';
import { List, StandardListItem, Input} from "@ui5/webcomponents-react";

const WhosIn = () => {
    const users = [
        { id: "I123", name: 'John Doe', desk: 'DUB05-3-R 1'},
        { id: "I456", name: 'Jane Doe', desk: 'DUB05-3-R 2'},
        { id: "I789", name: 'Alan Smith', desk: 'DUB05-3-R 3'},
    ];

    const [foundUsers, setFoundUsers] = useState(users);

    const filter = (e) => {
        const keyword = e.target.value;

        if (keyword !== '') {
            const results = users.filter((user) => {
                return user.name.toLowerCase().startsWith(keyword.toLowerCase());
            });
            setFoundUsers(results);
        } else {
            setFoundUsers(users);
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Input
                placeholder="Search..."
                onChange={filter}
            />
            <List
                headerText="Who's In"
                style={
                    {
                      width: "20rem",
                      height: "20rem",
                      padding: "1rem",
                      margin: "1rem",
                    }
                }
            >
                {foundUsers.map((user) => (
                    <StandardListItem key={user.id}>
                       {user.id} - {user.name}<br />{user.desk} 
                    </StandardListItem>
                ))}
            </List>
        </div>
    );
}
export default WhosIn;