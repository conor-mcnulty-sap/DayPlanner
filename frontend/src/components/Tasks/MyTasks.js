import React from "react";
import { useState, useEffect } from "react";
import{ List,StandardListItem, Icon, Card,CardHeader} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/AllIcons.js";
    import moment from 'moment';


      
export function MyTasks() {

  const [userId, setUserId] = useState('');

  useEffect(() => {
    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      setUserId(userDetails.id); 
    }
  }, []);
    const [tasksData, setTaskData] = useState([]);

    useEffect(() => {
      fetch(`${process.env.REACT_APP_API_URL}/api/tasks/usertasks?user_id=${userId}`)
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
    }, []);





    return (
        <Card header={
            <CardHeader
              titleText="My Tasks"
            />
          }
         
        >
     
            
            
              {tasksData.map(tasks => (
               
              <List>
                <StandardListItem style={{ borderBottom: '1px solid #ddd', marginBottom: '10px', position: 'relative' }}>
                    <div style={{ display: 'flex',left:'10px', alignItems: 'left' }}>
    
                        <div style={{ width: '4px', height: '20px', backgroundColor: (tasks.colour), borderRadius: '2px', marginRight: '10px' }}></div>
                            <div>
    
                               <h4 style={{ margin: '0', textAlign:'left',color: '#666',fontWeight:'normal'}}>  {moment(tasks.time, 'HH:mm').format('h:mm A')} - {tasks.task}</h4>
                               <h5 style={{ margin: '1px 0',textAlign:'left', color: '#666',fontWeight:'normal'}}> {tasks.description} </h5>
    
                                
    
                            </div>
                        </div>
    
                        <Icon name="delete" style={{ position: 'absolute', right: '10px', top: '50%' }} />
                </StandardListItem>
                </List>
              
              ))}
            
          
        </Card>

    );
}

        /*
        <Card header={
            <CardHeader
              titleText="My Tasks"
            />
          }
          
        >
            <List>
            <StandardListItem style={{ borderBottom: '1px solid #ddd', marginBottom: '10px', position: 'relative' }}>
                <div style={{ display: 'flex',left:'10px', alignItems: 'left' }}>

                    <div style={{ width: '4px', height: '20px', backgroundColor: 'red', borderRadius: '2px', marginRight: '10px' }}></div>
                        <div>

                           <h4 style={{ margin: '0', textAlign:'left',color: '#666',fontWeight:'normal'}}> 10am - Book Lunch</h4>
                            <h5 style={{ margin: '1px 0',textAlign:'left', color: '#666',fontWeight:'normal'}}>  Reminder to book lunch</h5>

                        </div>
                    </div>

                <Icon name="delete" style={{ position: 'absolute', right: '10px', top: '50%' }} />
            </StandardListItem>

            <StandardListItem style={{ borderBottom: '1px solid #ddd', marginBottom: '10px', position: 'relative' }}>
                <div style={{ display: 'flex',left:'10px', alignItems: 'left' }}>

                    <div style={{ width: '4px', height: '20px', backgroundColor: 'blue', borderRadius: '2px', marginRight: '10px' }}></div>
                        <div>

                           <h4 style={{ margin: '0',textAlign:'left', color: '#666',fontWeight:'normal'}}> 4pm - Email Client</h4>
                            <h5 style={{ margin: '1px 0',textAlign:'left', color: '#666',fontWeight:'normal'}}>  Email Client to book call</h5>

                        </div>
                    </div>
                    
                <Icon name="delete" style={{ position: 'absolute', right: '10px', top: '50%' }} />
            </StandardListItem>

            <StandardListItem style={{ borderBottom: '1px solid #ddd', marginBottom: '10px', position: 'relative' }}>
                <div style={{ display:'flex',left:'10px'}}>

                    <div style={{ width: '4px', height: '20px', backgroundColor: 'green', borderRadius: '2px', marginRight: '10px' }}></div>
                        <div>

                           <h4 style={{ margin: '0', textAlign:'left', color: '#666',fontWeight:'normal'}}>5pm - Request Carpool</h4>
                            <h5 style={{ margin: '1px 0', textAlign:'left',color: '#666',fontWeight:'normal'}}>Need to request carpool for tomorrow</h5>

                        </div>
                    </div>
                    
                <Icon name="delete" style={{ position: 'absolute', right: '10px', top: '50%'}} />
            </StandardListItem>
            </List>
        </Card>*/
 