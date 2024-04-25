import React from "react";
import {TasksForm} from "../components/Tasks/TasksForm";
import {MyTasks} from "../components/Tasks/MyTasks";
import { Grid } from "@ui5/webcomponents-react";

function Tasks() {
    return (
        <React.StrictMode>
            <Grid defaultSpan="XL6 L12 M12 S12" vSpacing="1rem" hSpacing="1rem">
                <div style={{ marginRight: "20px" }}>
                    <MyTasks/>
                </div>
                <div style={{ marginLeft: "1rem" }}>
                    <TasksForm/>
                </div>
                

            </Grid>
        </React.StrictMode>
    );
}

export default Tasks;