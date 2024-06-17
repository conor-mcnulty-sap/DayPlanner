var graph = require('@microsoft/microsoft-graph-client');

function getAuthenticatedClient(accessToken) {
  // Initialize Graph Client
  const client = graph.Client.init({
    // Use the provided access token to authenticate requests
    authProvider: done => {
      done(null, accessToken.accessToken);
    }
  });

  return client;
}

function cache(user) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userDetails', JSON.stringify(user));
    console.log('User details stored in localStorage:', JSON.stringify(user)); // Debugging log
  }
}

export async function getUserDetails(accessToken) {
  const client = getAuthenticatedClient(accessToken);

  const user = await client
    .api('/me')
    .select('userPrincipalName,id,displayName,mail,givenName,surname')
    .get();
  
  cache(user);
}

export async function getEvents(accessToken) {
  const client = getAuthenticatedClient(accessToken);

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const today = new Date(now.getTime()).toISOString();
  const tomorrow = new Date(now.getTime() + (24 * 60 * 60 * 1000)).toISOString();
  console.log(today);
  console.log(tomorrow);

  const events = await client
    .api('/me/events')
    .filter(`start/dateTime ge '${today}' and start/dateTime le '${tomorrow}'`)
    .select('subject,organizer,start,end,location,')
    .orderby('createdDateTime ASC')
    .get();

  return events;
}

export async function createEvents(accessToken, event) {
  const client = getAuthenticatedClient(accessToken);

  let res = await client.api('/me/events').post(event);
  console.log('Created RDV...');
  return res;
}


export async function getSchedule(accessToken, details) {
  const client = getAuthenticatedClient(accessToken);

  let res = await client.api('/me/calendar/getschedule').post(details);
  console.log('Created RDV...');
  return res;
}
