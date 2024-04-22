import React from "react";
import { Carousel } from "@ui5/webcomponents-react";

const MeetingRoomCarousel = () => {
  // todo: Function to get list of all meeting rooms.
  // const getMeetingRooms = () => {

  const sampleRooms = [
    { id: "R1", name: 'Grafton St', img: 'https://picsum.photos/300/100'},
    { id: "R2", name: 'Thomas St', img: 'https://picsum.photos/300/100'},
    { id: "R3", name: 'Henry St', img: 'https://picsum.photos/300/100'},
  ];

  const carouselStyle = {
    position: 'fixed',
    bottom: '10px',
    left: '10px',
    width: '50vw',
    height: '35vh'
  };

  return (
    <Carousel arrowsPlacement="Content" hidePageIndicator style={carouselStyle} backgroundDesign="Transparent" pageIndicatorBackgroundDesign="Transparent" cyclic>
      {sampleRooms.map((room) => (
        <div key={room.id} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <img src={room.img}
            alt="Meeting Room"
            style={{
              flex: '1 1 auto',
              width: "100%",
              objectFit: "cover",
            }}
          />
          <p style={{ color: 'black', textAlign: 'center', flex: '0 0 auto' }}>{room.name}</p>
        </div>
      ))}
    </Carousel>
  );
}

export default MeetingRoomCarousel;