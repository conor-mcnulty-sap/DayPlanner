import React from "react";
import {TasksForm} from "../components/Tasks/TasksForm";
import {MyTasks} from "../components/Tasks/MyTasks";
import { Grid } from "@ui5/webcomponents-react";
function Tasks() {
    return (
        <>
            <Grid defaultSpan="auto" vSpacing={"120rem"}>
                <div style={{ marginRight: "20px" , marginTop: "295px"}}>
                    <MyTasks/>
                </div>
                <div style={{ marginLeft: "10rem" }}>
                    <TasksForm/>
                </div>
            </Grid>
        </>
    );
}


export default Tasks;