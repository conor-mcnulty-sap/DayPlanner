import React, { useState, useEffect } from "react";
import { Button, Dialog, Text } from "@ui5/webcomponents-react";
import "@ui5/webcomponents/dist/features/InputSuggestions.js"; // Ensure InputSuggestions feature is imported

function VerifyDesk() {
  const [userEmail, setUserEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
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
          setIsDialogOpen(true); // Show dialog on success
        } else {
          console.error("Failed to send verification request");
        }
      })
      .catch(error => {
        console.error("Error while sending verification request:", error);
      });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
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

      <Dialog
        headerText="Desk Verification"
        open={isDialogOpen}
        onAfterClose={handleDialogClose}
      >
        <div style={{ padding: '1rem' }}>
          <Text>The desk has been successfully verified.</Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
          <Button onClick={handleDialogClose}>OK</Button>
        </div>
      </Dialog>
    </div>
  );
}

export default VerifyDesk;
