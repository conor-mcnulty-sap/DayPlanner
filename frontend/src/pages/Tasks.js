import React from 'react';
import Calendar from '../components/Tasks/Calendar/MyCalendar';
import { MyTasks } from '../components/Tasks/MyTasks';
import  TasksForm  from '../components/Tasks/TasksForm';

const Tasks = ({ isAuthenticated, user, logout, login }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
      <div style={{ marginTop: '10px' }}>
        {isAuthenticated && <Calendar isAuthenticated={isAuthenticated} user={user} logout={logout} />}
        
        <div style={{ marginTop: '20px' }}>
          <MyTasks />
        </div>
      </div>

      <div style={{ flex: 1, marginLeft: '20px' }}>
        <div >
          <TasksForm />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
