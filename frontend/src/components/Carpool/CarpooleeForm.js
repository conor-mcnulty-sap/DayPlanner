import React, { useEffect, useRef } from "react";
import {
  Form,
  FormGroup,
  FormItem,
  Input,
  Button,
} from "@ui5/webcomponents-react";

export function CarpooleeForm() {
  return (
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
        paddingLeft: "10rem",
        alignItems: "center",
      }}
      titleText="Apply For Carpool Lift"
    >
      <FormGroup titleText="Personal Data"  >
        <FormItem label="Name">
          <Input type="Text" />
        </FormItem>
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
      </FormItem>
    </Form>
  );
}
