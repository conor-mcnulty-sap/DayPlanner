import React, { useRef, useEffect, useState } from "react";
import {
  Form,
  FormGroup,
  FormItem,
  Input,
  Button,
  Card,
  CardHeader,
} from "@ui5/webcomponents-react";

const CarpoolerForm = () => {
  const eircodeRef = useRef();
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      setUserId(userDetails.id);
      setDisplayName(userDetails.displayName);
      setEmail(userDetails.email); 
  
      console.log("User ID:", userDetails.id);
      console.log("Email:", userDetails.mail);
      console.log("Display Name:", userDetails.displayName);
    }
  }, []);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const eircode = eircodeRef.current.value;
  
    try {
      const queryParams = new URLSearchParams({
        user_id: userId,
        eircode: eircode,
      });
  
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/carpools/addcarpooler?${queryParams}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // Set the content type to form-urlencoded
          },
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.text(); // Read response as text
      console.log("Response data:", data); // Log response data
  
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };
  
  const handleDeregister = async () => {
    try {
      const queryParams = new URLSearchParams({
        user_id: userId,
      });
  
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/carpools/removecarpooler?${queryParams}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // Set the content type to form-urlencoded
          },
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.text(); // Read response as text
      console.log("Response data:", data); // Log response data
  
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };
  
  return (
  
    <Card
      header={<CardHeader titleText="Give a Lift" />}
      style={{ 
        width: "50%",
        height:"18rem",
        maxHeight: "50vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Form
          backgroundDesign="Transparent"
          columnsL={1}
          columnsM={1}
          columnsS={1}
          columnsXL={1}
          labelSpanL={4}
          labelSpanM={2}
          labelSpanS={12}
          labelSpanXL={4}
          style={{
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <FormGroup titleText="Personal Data">
            <FormItem label="Eircode">
              <Input type="Text" ref={eircodeRef} />
            </FormItem>
          </FormGroup>
          <FormItem>
            <Button
              type="submit"
              onClick={handleSubmit}
              style={{ marginRight: "20px" }}
            >
              Submit
            </Button>

            <Button design="Negative" onClick={handleDeregister}>
              De-register
            </Button>
          </FormItem>
        </Form>
      </div>
    </Card>
  );
};

export default CarpoolerForm;
