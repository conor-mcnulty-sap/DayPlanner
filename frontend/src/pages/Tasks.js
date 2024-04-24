import React from "react";
import {TasksForm} from "../components/Tasks/TasksForm";
import {MyTasks} from "../components/Tasks/MyTasks";
import { Grid } from "@ui5/webcomponents-react";
import SignIn from "../components/SignIn"
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
                <SignIn/>

            </Grid>
        </>
    );
}


export default Tasks;