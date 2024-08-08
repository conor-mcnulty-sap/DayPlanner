import { useState, useEffect } from 'react';

export function useGetBookings(dateRange, selectedBuilding, selectedFloor = "3") {
    const [bookedDesks, setBookedDesks] = useState([]);

    useEffect(() => {
        const getBookings = async () => {
            let building = (selectedBuilding === 3) ? "DUB02" : "DUB05";
            fetch(`${process.env.REACT_APP_API_URL}/api/bookings/bookingsbydatefloor?date=${dateRange}&building=${building}&floor=${selectedFloor}`)
                .then((response) => {
                     if(!response.ok) {
                        throw new Error(`Error fetching bookings: ${response.status}`);
                     }
                     return response.json();
                }).then((data) => {
                    const bookedDeskIds = data.map((booking) => booking.desk_id);
                    setBookedDesks(bookedDeskIds)
                }).catch((error) => {
                    console.error(`Error fetching bookings: ${error}`);
                });
        };

        getBookings();
    }, [dateRange, selectedBuilding, selectedFloor]);

    return bookedDesks;
}