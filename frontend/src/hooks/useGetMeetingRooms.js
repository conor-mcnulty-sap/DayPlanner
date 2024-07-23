import { useState, useEffect } from 'react';

export function useGetMeetingRooms(start_date_time, building, floor, end_date_time) {
    const [bookedMeetingRooms, setBookedMeetingRooms] = useState([]);

    useEffect(() => {
        const getBookings = async () => {
            fetch(`${process.env.REACT_APP_API_URL}/api/meetingrooms/checkavailabilitybuildingfloor?start_date_time=${start_date_time}&building=${building}&floor=${floor}&end_date_time=${end_date_time}`)
            .then((response) => {
                if(!response.ok) {
                    throw new Error(`Error fetching bookings: ${response.status}`);
                }
                return response.json();
            }).then((data) => {
                const bookedMeetingRoomIds = data.map((booking) => booking.id);
                setBookedMeetingRooms(bookedMeetingRoomIds)
            }).catch((error) => {
                console.error(`Error fetching bookings: ${error}`);
            });
        };
        
        getBookings();
    }, [start_date_time, building, floor, end_date_time]);

    return bookedMeetingRooms;
}