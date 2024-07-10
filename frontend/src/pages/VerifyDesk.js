import React, { useState, useEffect } from "react";
import { Button } from "@ui5/webcomponents-react";
import "@ui5/webcomponents/dist/features/InputSuggestions.js"; // Ensure InputSuggestions feature is imported

function VerifyDesk() {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Retrieve user's details from local storage
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      //console.log(userDetails.mail);
      setUserEmail(userDetails.mail);
      console.log("User email retrieved:", userDetails.mail); 
    }
  }, []);

  const handleVerifyClick = () => {
  
    fetch(`${process.env.REACT_APP_API_URL}/api/teambooking/verify?user_email=${userEmail}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
    
      },
  
    })
      .then(response => {
        if (response.ok) {
     
          console.log("Verification request sent successfully");

        } else {
              console.error("Failed to send verification request");
  
        }
      })
      .catch(error => {
        console.error("Error while sending verification request:", error);
     
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <Button
        style={{ fontSize: '20px', padding: '20px 20px', width: '16rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        type="submit"
        onClick={handleVerifyClick} 
      >
        Verify Desk
      </Button>
    </div>
  );
}

export default VerifyDesk;
