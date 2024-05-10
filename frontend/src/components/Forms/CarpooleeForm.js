import React from "react";
import {
  Form,
  FormGroup,
  FormItem,
  Input,
  Button,
  Card,
  CardHeader
} from "@ui5/webcomponents-react";

const CarpooleeForm = () => {
  return (
    <Card
      header={<CardHeader titleText="Get a Lift" />}
      style={{
        width: "100%",
        maxHeight: "50vh",
      }}>
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
            marginBottom: "1rem",
          }}
        >
          <FormGroup titleText="Personal Data">
            <FormItem label="Eircode">
              <Input type="Text" />
            </FormItem>
          </FormGroup>
          <FormItem>
            <Button onClick={function _a() {}}>
              Submit
            </Button>
          </FormItem>
        </Form>
      </div>
    </Card>
  );
};

export default CarpooleeForm;