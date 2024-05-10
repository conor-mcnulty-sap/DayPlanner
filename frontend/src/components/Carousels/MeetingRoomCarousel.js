import React from "react";
import { Carousel, Card } from "@ui5/webcomponents-react";

const MeetingRoomCarousel = () => {
  const sampleRooms = [
    { id: "R1", name: "Grafton St", img: "https://picsum.photos/300/100" },
    { id: "R2", name: "Thomas St", img: "https://picsum.photos/300/100" },
    { id: "R3", name: "Henry St", img: "https://picsum.photos/300/100" },
  ];

  const carouselStyle = {
    width: "50vw",
    height: "35vh",
  };

  return (
    <Card>
      <Carousel
        arrowsPlacement="Content"
        hidePageIndicator
        style={carouselStyle}
        backgroundDesign="Transparent"
        pageIndicatorBackgroundDesign="Transparent"
        cyclic
      >
        {sampleRooms.map((room) => (
          <div
            key={room.id}
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src={room.img}
              alt="Meeting Room"
              style={{
                height: "80%", // Set a specific height for the image
                width: "100%",
                objectFit: "cover",
              }}
            />
            <p style={{ color: "black", textAlign: "center", height: "20%" }}> 
              {room.name}
            </p>
          </div>
        ))}
      </Carousel>
    </Card>
  );
};

export default MeetingRoomCarousel;