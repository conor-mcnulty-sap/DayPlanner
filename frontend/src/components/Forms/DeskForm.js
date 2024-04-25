import React, { useEffect, useRef } from "react";
import {
  Form,
  FormGroup,
  FormItem,
  Input,
  Button,
  DatePicker
} from "@ui5/webcomponents-react";

export function DeskForm({ selectedDesk }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
        titleText="Book a Desk"
      >
        <FormGroup titleText=""  >
        <FormItem label="Building">
          <Input type="Text" value={selectedDesk ? selectedDesk.building : ''} />
        </FormItem>
        <FormItem label="Floor">
          <Input type="Text" value={selectedDesk ? selectedDesk.floor : ''} />
        </FormItem>
        <FormItem label="Desk">
          <Input type="Text" value={selectedDesk ? selectedDesk.popup : ''} />
        </FormItem>
          <FormItem label="Date">
          <DatePicker
                  formatPattern="yyyy-MM-dd"
                  onChange={function _a() {}}
                  onInput={function _a() {}}
                  valueState="None"
                />
                </FormItem>
        </FormGroup>
      </Form>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Button
          ref={{
            current: "[Circular]",
          }}
          onClick={function _a() {}}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}