import React, { useRef } from "react";
import {
  Form,
  FormGroup,
  FormItem,
  Input,
  Button,
} from "@ui5/webcomponents-react";

const CarpoolerForm = () => {
  const eircodeRef = useRef();
  const userId = '1'; // Default user

  const handleSubmit = async (event) => {
    event.preventDefault();

    const eircode = eircodeRef.current.value;
    console.log(eircode);
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/carpools/addcarpooler`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        eircode: eircode,
      }),
    });

    const data = await response.json();
    console.log(data);
  };

  const handleDeregister = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/carpools/removecarpooler`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
      }),
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
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
        }}
        titleText="Apply to give a Carpool Lift"
      >
        <FormGroup titleText="Personal Data">
          <FormItem label="Eircode">
            <Input type="Text" ref={eircodeRef} />
          </FormItem>
        </FormGroup>
        <FormItem>
          <Button type="submit" onClick={handleSubmit}>
            Submit
          </Button>
          <Button
            design="Negative"
            onClick={handleDeregister}
          >
            De-register
          </Button>
        </FormItem>
      </Form>
    </div>
  );
};

export default CarpoolerForm;