import React, { useRef } from "react";
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
  const userId = "I744418"; // Default user

  const handleSubmit = async (event) => {
    event.preventDefault();

    const eircode = eircodeRef.current.value;
    console.log(eircode);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/carpools/addcarpooler`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            eircode: eircode,
            
          }),
        }
      );

      if (!response.ok) {
        // Handle non-OK responses
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  const handleDeregister = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/carpools/removecarpooler`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
          }),
        }
      );

      if (!response.ok) {
        // Handle non-OK responses
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  return (
    <Card
      header={<CardHeader titleText="Give a Lift" />}
      style={{
        width: "100%",
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
