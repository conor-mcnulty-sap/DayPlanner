import React from 'react';
import Calendar from '../components/Tasks/Calendar/MyCalendar';
import { MyTasks } from '../components/Tasks/MyTasks';
import  TasksForm  from '../components/Tasks/TasksForm';
import { Grid } from "@ui5/webcomponents-react";

const Tasks = ({ isAuthenticated, user, logout, login }) => {
  return (
    <div
    style={{
      margin: "2rem auto 4rem auto", // Center the content
      width: "90%", // Adjust the width of the page
      alignItems: "start", // Align items to the start
    }}
  >
      <Grid
        defaultSpan="xl6 l6 m6 s12"
        vSpacing={"2rem"}
        hSpacing={"2rem"}
        style={{ margin: "2rem" }}
      >
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
      <div style={{ }}>
        {isAuthenticated && <Calendar isAuthenticated={isAuthenticated} user={user} logout={logout} />}
        
        <div style={{ width: "200%" }}>
          <MyTasks />
        </div>
      </div>

      <div style={{ flex: 1, marginLeft: '20px' }}>
        <div style={{ width: "150%", marginLeft:"23rem" }}>
          <TasksForm />
        </div>
      </div>
    </div>
    </Grid>
    </div>
  );
};

export default Tasks;
