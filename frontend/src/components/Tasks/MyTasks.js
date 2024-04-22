import React from "react";
import{ List,StandardListItem, Icon} from "@ui5/webcomponents-react";
    import "@ui5/webcomponents-icons/dist/AllIcons.js";


export function MyTasks() {
    return (
        <List growing="None" headerText="My Tasks" mode="None" separators="All">
            <StandardListItem style={{ borderBottom: '1px solid #ddd', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'green', marginRight: '10px' }}></div>
                    <div>
                        <h3 style={{ margin: '0', color: 'Black' }}>Book Lunch</h3>
                        <p style={{ margin: '5px 0', color: '#666' }}>10am - Reminder to book lunch</p>
                    </div>
                    <Icon name="delete" />
                </div>
            </StandardListItem>

            <StandardListItem style={{ borderBottom: '1px solid #ddd', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'blue', marginRight: '10px' }}></div>
                    <div>
                        <h3 style={{ margin: '0', color: 'Black' }}>Finish report</h3>
                        <p style={{ margin: '5px 0', color: '#666' }}>4pm - Finish report for customer</p>
                    </div>
                    <Icon name="delete" />
                </div>
            </StandardListItem>

            <StandardListItem style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'orange', marginRight: '10px' }}></div>
                    <div>
                        <h3 style={{ margin: '0', color: 'Black' }}>Email Customer</h3>
                        <p style={{ margin: '5px 0', color: '#666' }}>12pm - Email customer to book call</p>
                    </div>
                    <Icon name="delete" />
                </div>
                
            </StandardListItem>
        </List>
    );
}


   /* export function MyTasks(){
        return(
        <div className="MyTasks">
            <h4> My Tasks</h4>
            <div className="tasks">
                <div classname="task">
                    <div className="checkbox"></div>
    
                    <div className="text">Order Lunch</div>
    
                    <div className="delete-task">x</div>
    
                </div>
            </div>
        </div>
        )
    }
    */