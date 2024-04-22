import { ColorPalettePopoverComponent } from './ColourPalette';
import {
  Form,
  Input,
  Label,
  TextArea,
  FormGroup,
  FormItem,
  TimePicker,
  Button
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-localization/dist/Assets.js";


export function TasksForm() {
  return (
    <Form
      backgroundDesign="Transparent"
      columnsL={1}
      columnsM={1}
      columnsS={1}
      columnsXL={2}
      labelSpanL={4}
      labelSpanM={2}
      labelSpanS={12}
      labelSpanXL={4}
    
      titleText="Create A Task"
    >
      <FormGroup >
        <FormItem label={
            <Label style={{  display: "flex",
            flexDirection: "column",
            alignItems: "flex-end", 
            paddingRight:"200px"}}>
              Title
            </Label>
        }
      >
          <Input type="Text" />
        </FormItem>
          <FormItem label={
              <Label style={{  display: "flex",
              flexDirection: "column",
              alignItems: "flex-end", 
              paddingRight:"200px"}}>
                Time
              </Label>
            }
          >
            <TimePicker
              placeholder="Enter Time"
              onChange={function _a(){}}
              onInput={function _a(){}}
            />
        </FormItem>
        <FormItem
          label={
            <Label style={{  display: "flex",
            flexDirection: "column",
            alignItems: "flex-end", 
            paddingRight:"200px"}}>
              Description
            </Label>
          }
        >
          <TextArea placeholder="Description" rows={5} />
        </FormItem>
        <FormItem  label={
            <Label style={{  display: "flex",
            flexDirection: "column",
            alignItems: "flex-end", 
            paddingRight:"200px"}}>
              Colour
            </Label>
          }>
          <ColorPalettePopoverComponent />
        </FormItem>
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
      </FormGroup>

    </Form>
  );
}
