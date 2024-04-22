import React from "react";
import{ List, StandardListItem } from "@ui5/webcomponents-react";

    export function MyTasks() {
        return (
            <List growing="None" headerText="My Tasks" mode="None" separators="All">
                <StandardListItem >
                    Book Lunch
                </StandardListItem>
                <StandardListItem >
                    Book Meeting
                </StandardListItem>
                <StandardListItem >

                    Email Customer
                </StandardListItem>
            </List>
        );
    }
/*export function MyTasks(){
    return(
    <div className="MyTasks">
        <h4> My Tasks</h4>
        <div classname="tasks">
            <div classname="task">
                <div classname="checkbox"></div>

                <div classname="text">Order Lunch</div>

                <div classname="delete-task">x</div>

            </div>
        </div>
    </div>
    )
}
*/