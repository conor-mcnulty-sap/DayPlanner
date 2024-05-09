import React, { useEffect, useRef } from "react";
import {
  Form,
  FormGroup,
  FormItem,
  Input,
  Button,
} from "@ui5/webcomponents-react";

const CarpoolerForm = () => {
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
            <Input type="Text" />
          </FormItem>
        </FormGroup>
        <FormItem>
          <Button
            ref={{
              current: "[Circular]",
            }}
            onClick={function _a() {}}
          >
            Submit
          </Button>
          <Button
            design="Negative"
            ref={{
              current: "[Circular]",
            }}
            onClick={function _a() {}}
          >
            De-register
          </Button>
        </FormItem>
      </Form>
    </div>
  );
};

export default CarpoolerForm;
