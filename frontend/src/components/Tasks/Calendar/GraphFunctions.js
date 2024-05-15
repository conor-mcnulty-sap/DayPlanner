var graph = require('@microsoft/microsoft-graph-client');

function getAuthenticatedClient(accessToken) {
  // Initialize Graph Client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: done => {
      done(null, accessToken.accessToken);
    }
  });

  return client;
}

export async function getUserDetails(accessToken) {
  const client = getAuthenticatedClient(accessToken);

  const user = await client.api('/me').get();
  return user;
}

export async function getEvents(accessToken) {
  const client = getAuthenticatedClient(accessToken);

  const now = new Date();
  now.setHours(0,0,0,0);
  const today = new Date().toISOString();
  const tomorrow = new Date(today + (24 * 60 * 60 * 1000)).toISOString();

  const events = await client
    .api('/me/events')
    .filter(`start/dateTime ge '${today}' and start/dateTime le '${tomorrow}'`)
    .select('subject,organizer,start,end,location,')
    .orderby('createdDateTime DESC')
    .get();

  return events;
}
export async function createEvents(accessToken, event) {
  const client = getAuthenticatedClient(accessToken);

  let res = await client.api('/me/events').post(event);
  console.log('Created RDV...');
  return res;
}
