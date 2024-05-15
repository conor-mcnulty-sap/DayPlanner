import React, { Component } from "react";
import { Icon,Table, Card, CardHeader,StandardListItem,List } from "@ui5/webcomponents-react";
import moment from 'moment';
import { getEvents } from "./GraphFunctions";
import config from "./Config";



function formatDateTime(dateTime) {
  return moment.utc(dateTime).local().format();
}


export default class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: []
    };
  }

  async componentDidMount() {
    try {
      const accessToken = await window.msal.acquireTokenSilent({
        scopes: config.scopes
      });
      const events = await getEvents(accessToken);
  
      this.setState({ events: events.value });
    } catch (err) {
      this.props.showError('ERROR', JSON.stringify(err));
    }
  }

  render() {

    
    return (
      <Card header={
        <CardHeader
          titleText="My Calendar"
        />
      }
 
    >
 
        
        
          {this.state.events.map(event => (
           
          <List>
            <StandardListItem style={{ borderBottom: '1px solid #ddd', marginBottom: '10px', position: 'relative' }}>
                <div style={{ display: 'flex',left:'10px', alignItems: 'left' }}>

                    <div style={{ width: '4px', height: '20px', backgroundColor: 'purple', borderRadius: '2px', marginRight: '10px' }}></div>
                        <div>

                           <h4 style={{ margin: '0', textAlign:'left',color: '#666',fontWeight:'normal'}}> {formatDateTime(event.start.dateTime)} - {event.subject}</h4>
                           <h5 style={{ margin: '1px 0',textAlign:'left', color: '#666',fontWeight:'normal'}}> {event.organizer.emailAddress.name} - {event.location.displayName}</h5>

                            

                        </div>
                    </div>

              
            </StandardListItem>
            </List>
          
          ))}
        
      
    </Card>
    );
  }
}
/*

    return (
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

                           <h4 style={{ margin: '0', textAlign:'left',color: '#666',fontWeight:'normal'}}> {formatDateTime(event.start.dateTime)}- {event.subject}</h4>
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
        </Card>
    );
 */