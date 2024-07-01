import React, { useState, useEffect } from "react";
import {
  List,
  StandardListItem,
  Icon,
  Card,
  CardHeader,
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/AllIcons.js";
import moment from "moment";

export function MyTasks() {
  const [userId, setUserId] = useState("");
  const [tasksData, setTaskData] = useState([]);
  const [completedTasks, setCompletedTasks] = useState({});

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      setUserId(userDetails.id);
    }
  }, []);

  useEffect(() => {
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
          setTaskData(data);
        })
        .catch((error) => console.log("My Tasks failed: ", error));
    }
  }, [userId]);

  const filteredTasks = tasksData.filter((task) =>
    moment(task.date).isSame(moment(), "day")
  );

  const handleDeleteTask = (taskId) => {
    fetch(
      `${process.env.REACT_APP_API_URL}/api/tasks/removetask?id=${taskId}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("Task deleted successfully");
        // Remove the task from the UI
        setTaskData((prevTasks) =>
          prevTasks.filter((task) => task.id !== taskId)
        );
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  const handleToggleTaskCompletion = (taskId) => {
    setCompletedTasks((prevCompletedTasks) => ({
      ...prevCompletedTasks,
      [taskId]: !prevCompletedTasks[taskId],
    }));
  };

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
          onClick={() => handleToggleTaskCompletion(task.id)}
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
                {" "}
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
                {" "}
                {task.description}{" "}
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
              e.stopPropagation(); // Prevent the click event from propagating to the parent div
              handleDeleteTask(task.id);
            }}
          />
        </div>
      ))}
    </Card>
  );
}
