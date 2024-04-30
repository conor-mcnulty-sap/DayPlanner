import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [desks, setDesks] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [favourites, setFavorites] = useState([]);
  const [users, setUsers] = useState([]);
  const [lastbooked, setLastBooked] = useState([]);
  const currentDate = new Date();
  
  useEffect(() => {
    getDesks();
    getBookings();
    getFavourites();
    getUsers();
    getLastBooked();
  }, []);

// Refresh Page
    function refreshPage() {
        window.location.reload(false);
    }


// Get Desks
  async function getDesks() {
    const { data } = await supabase.from("desks").select();
    setDesks(data);
  }

// Get Bookings
async function getBookings() {
    const { data } = await supabase.from("bookings").select('*,desks(*)');
    setBookings(data);
    console.log('Bookings:', data);
}

// Get Favourites
async function getFavourites() {
    const { data } = await supabase.from("favourites").select();
    setFavorites(data);
}

// Get Users
async function getUsers() {
    const { data } = await supabase.from("users").select();
    setUsers(data);
}

// Get Last Booked
async function getLastBooked() {
    const { data } = await supabase.from("last_booked").select();
    setLastBooked(data);
}

// Book Desk
async function bookDesk() {
    console.log('booking desk');
    let input_user_id = "1";
    let input_desk_id = "101";
    let input_date = "2021-10-01";

    // Check if desk is already booked
    let isBooked = bookings.some((booking) => booking.desk_id === input_desk_id && booking.date === input_date);
    console.log('isBooked:', isBooked);

    if (isBooked) {
        console.error('Desk is already booked');
        // Alert saying desk is booked
        alert('Desk is already booked');
        return;
        }
    else {
        console.log('Desk is available');
        // Book desk
        const { data, error } = await supabase.from('bookings').insert( {user_id:input_user_id, desk_id: input_desk_id, date:input_date });
        // Add to last booked
        const { data2, error2 } = await supabase.from('last_booked').insert( {user_id:input_user_id, desk_id: input_desk_id });
        if (error) {
          console.error('Error booking desk:', error.message);
        } else {
          setBookings([...bookings, data[0]]);
        }

        if (error2) {
          console.error('Error adding to last booked:', error2.message);
        }
        else {
          setLastBooked([...lastbooked, data2[0]]);
        }
    }
}

// Remove Booking
async function removeBooking() {
    console.log('removing booking 1 ');
    let input_user_id = "1";
    let input_desk_id = "101";
    let input_date = "2021-10-01";

    // Check if desk is already booked
    let isBooked = bookings.some((booking) => booking.user_id === input_user_id && booking.desk_id === input_desk_id && booking.date === input_date);
    console.log('isBooked:', isBooked);

    if (isBooked) {
        console.log('Removing booking 2');
        const { error } = await supabase.from('bookings').delete().match({ user_id: input_user_id, desk_id: input_desk_id, date: input_date });
        if (error) {
          console.error('Error removing booking:', error.message);
        } else {
          setBookings(bookings.filter((booking) => booking.desk_id !== input_desk_id || booking.date !== input_date));
        }
    }
    else {
        console.error('Desk is not booked');
        // Alert saying desk is not booked
        alert('Desk is not booked');
    }
}

// Favourite Desk
async function favouriteDesk() {
    console.log('favouriting desk');
    let input_user_id = "2";
    let input_desk_id = "101";

    // Check if desk is already favourited
    let isFavourited = favourites.some((favourite) => favourite.user_id === input_user_id && favourite.desk_id === input_desk_id);
    console.log('isFavourited:', isFavourited);

    if (isFavourited) {
        console.error('Desk is already favourited');
        // Alert saying desk is already favourited
        alert('Desk is already favourited');
        return;
        }
    else {
      const { data, error } = await supabase.from('favourites').insert( {user_id:input_user_id, desk_id: input_desk_id });
      if (error) {
        console.error('Error favouriting desk:', error.message);
        } else {
        setFavorites([...favourites, data[0]]);
      }
    }
}

// Unfavourite Desk
async function unfavouriteDesk() {
    console.log('unfavouriting desk');
    let input_user_id = "2";
    let input_desk_id = "101";

    const { error } = await supabase.from('favourites').delete().match({ user_id: input_user_id, desk_id: input_desk_id });
    if (error) {
      console.error('Error unfavouriting desk:', error.message);
    } else {
      setFavorites(favourites.filter((favourite) => favourite.desk_id !== input_desk_id ));
    }
}

// Filter Desks By Floor
async function filterDesksByFloor() {
    console.log('filtering desks by floor');
    let input_floor = "1";

    const { data, error } = await supabase.from('desks').select().eq('floor', input_floor);
    if (error) {
      console.error('Error filtering desks by floor:', error.message);
    } else {
      setDesks(data);
    }
}

// What users is in at a certain date
async function userAtDate() {
    console.log('checking users at date');
    let input_date = "2021-10-01";

    const { data, error } = await supabase.from('bookings').select('*,desks(*)').eq('date', input_date);
    if (error) {
      console.error('Error checking user at date:', error.message);
    } else {
      setBookings(data);
      console.log('Users at date:', data);
    }
}





return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {/* Desks */}
      <div style={{ marginRight: '20px' }}>
        <p>Desks</p>
        <ul>
          {desks.map((desk) => (
            <li key={desk.name}>{desk.name}</li>
          ))}
        </ul>
        {/* Floor */}
        <div>
          <p>Floor</p>
          <ul>
            {desks.map((desk) => (
              <li key={desk.floor}>{desk.floor}</li>
            ))}
          </ul>
          </div>
      </div>
  
      {/* Bookings */}
      <div>
        <p>Bookings</p>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {/* Booking IDs */}
          <div style={{ marginRight: '20px' }}>
            <p>Booking IDs</p>
            <ul>
              {bookings.map((booking) => (
                <li key={1}>{booking.id}</li>
              ))}
            </ul>
          </div>

          {/* Desk Id */}
          <div style={{ marginRight: '20px' }}>
            <p>Desk ID</p>
            <ul>
              {bookings.map((booking) => (
                <li key={booking.desk_id}>{booking.desk_id}</li>
              ))}
            </ul>
          </div>
  
          {/* Desk Name */}
          <div style={{ marginRight: '20px' }}>
            <p>Desk Name</p>
            <ul>
              {bookings.map((booking) => (
                <li key={booking.desks.name}>{booking.desks.name}</li>
              ))}
            </ul>
          </div>
  
          {/* Dates */}
          <div>
            <p>Dates</p>
            <ul>
              {bookings.map((booking) => (
                <li key={booking.date}>{booking.date}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Favourites */}
        <div>
          <p>Favourites</p>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {/* User IDs */}
            <div style={{ marginRight: '20px' }}>
              <p>User IDs</p>
              <ul>
                {favourites.map((favourite) => (
                  <li key={favourite.user_id}>{favourite.user_id}</li>
                ))}
              </ul>
            </div>
    
            {/* Desk IDs */}
            <div>
              <p>Desk IDs</p>
              <ul>
                {favourites.map((favourite) => (
                  <li key={favourite.desk_id}>{favourite.desk_id}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Users */}
        <div>
          <p>Users</p>
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.id}</li>
            ))}
          </ul>
        </div>

        {/* Last Booked */}
        <div>
          <p>Last Booked</p>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {/* User IDs */}
            <div style={{ marginRight: '20px' }}>
              <p>User IDs</p>
              <ul>
                {lastbooked.map((lastbooked) => (
                  <li key={lastbooked.user_id}>{lastbooked.user_id}</li>
                ))}
              </ul>
            </div>
    
            {/* Desk IDs */}
            <div>
              <p>Desk IDs</p>
              <ul>
                {lastbooked.map((lastbooked) => (
                  <li key={lastbooked.desk_id}>{lastbooked.desk_id}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>


          

        <div>
          <button onClick={bookDesk}>Book Desk</button>

          <button onClick={removeBooking}>Remove Desk</button>

          <button onClick={favouriteDesk}>Favourite Desk</button>

          <button onClick={unfavouriteDesk}>Unfavourite Desk</button>

          <button onClick={userAtDate}>User At Date</button>
          
          <button onClick={filterDesksByFloor}>Filter Desks By Floor</button>

        </div>
      </div>
    </div>
  );
  
}

export default App;

  