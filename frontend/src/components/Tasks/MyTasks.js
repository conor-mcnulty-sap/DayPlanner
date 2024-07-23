import React, { Component } from "react";
import {
  Card,
  CardHeader,
  Icon
} from "@ui5/webcomponents-react";
import moment from "moment";
import { deleteEvents } from './Calendar/GraphFunctions';
import { PublicClientApplication, BrowserAuthError } from '@azure/msal-browser';
import config from './Calendar/Config';

export default class MyTasks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: "",
      tasksData: [],
      completedTasks: {},
      msalInstance: null,
    };
  }

  componentDidMount() {
    this.fetchUserTasks();
  }

  async componentDidMount() {
    try {
      console.log("Attempting to acquire token silently");
      var accessToken = await window.msal.acquireTokenSilent({
        scopes: config.scopes
      });
      console.log("Access token acquired", accessToken);
    } catch (err) {
      console.log("Failed to acquire access token", err);
    }

    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      this.setState({ userId: userDetails.id }, () => {
        this.retrieveTasks();
      });
    }
  }

  retrieveTasks() {
    const { userId } = this.state;
    if (userId) {
      const today = moment().format("YYYY-MM-DD");
      fetch(
        `${process.env.REACT_APP_API_URL}/api/tasks/usertasks?user_id=${userId}&date=${today}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("My Tasks: ", data);
          this.setState({ tasksData: data });
        })
        .catch((error) => console.log("My Tasks failed: ", error));
    }
  }

  handleDeleteTask = async (event_id) => {
    console.log("Deleting event with id:", event_id);

    try {
      var accessToken = await window.msal.acquireTokenSilent({
        scopes: config.scopes
      });

      // First, delete the task from Outlook
      await deleteEvents(accessToken, event_id);
      console.log("Task deleted from Outlook successfully");

      // Then, delete the task from local storage
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/removetask?id=${event_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Task deleted successfully from local storage");

      // Remove the task from the UI
      this.setState((prevState) => ({
        tasksData: prevState.tasksData.filter((task) => task.event_id !== event_id),
      }));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  handleToggleTaskCompletion = (taskId) => {
    this.setState((prevState) => ({
      completedTasks: {
        ...prevState.completedTasks,
        [taskId]: !prevState.completedTasks[taskId],
      },
    }));
  };

  render() {
    const { tasksData, completedTasks } = this.state;

    const filteredTasks = tasksData.filter((task) =>
      moment(task.date).isSame(moment(), "day")
    );

    return (
      <Card header={<CardHeader titleText="My Tasks" />} style={{}}>
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            style={{
              borderBottom: "1px solid #ddd",
              marginBottom: "10px",
              paddingBottom: "5px",
              position: "relative",
              paddingTop: "5px",
              cursor: "pointer",
            }}
            onClick={() => this.handleToggleTaskCompletion(task.id)}
          >
            <div style={{ display: "flex", left: "10px", alignItems: "left" }}>
              <div
                style={{
                  width: "3px",
                  height: "20px",
                  backgroundColor: task.colour,
                  borderRadius: "2px",
                  marginRight: "10px",
                  marginLeft: "18px",
                }}
              ></div>
              <div>
                <h3
                  style={{
                    margin: "0",
                    textAlign: "left",
                    color: "#666",
                    fontWeight: "normal",
                    textDecoration: completedTasks[task.id] ? "line-through" : "none",
                  }}
                >
                  {moment(task.time, "HH:mm").format("h:mm A")} - {task.task}
                </h3>
                <h4
                  style={{
                    margin: "1px 0",
                    textAlign: "left",
                    color: "#666",
                    fontWeight: "normal",
                    textDecoration: completedTasks[task.id] ? "line-through" : "none",
                  }}
                >
                  {task.description}
                </h4>
              </div>
            </div>
            <Icon
              name="delete"
              style={{
                position: "absolute",
                right: "10px",
                top: "25%",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                this.handleDeleteTask(task.event_id); 
              }}
            />
          </div>
        ))}
      </Card>
    );
  }
}
