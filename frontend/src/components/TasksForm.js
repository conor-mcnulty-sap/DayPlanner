import React from 'react';
import {
    Form,
    Input,
    Label,
    TextArea,
    Button,
    FormGroup,
    FormItem,
    TimePicker,
    ColorPalettePopover,
    ColorPaletteItem } from '@ui5/webcomponents-react';

export function TasksForm(){
  return(
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
  style={{
    alignItems: 'center'
  }}
  titleText="Test Form"
>
  <FormGroup titleText="Adding A Task">
    <FormItem label="Title">
      <Input type="Text" />
    </FormItem>
    <FormItem label="Time">
        <TimePicker
            onChange={function _a(){}}
            onInput={function _a(){}}
            valueState="None"
        />
    </FormItem>
    <FormItem label={<Label style={{alignSelf: 'start', paddingTop: '0.25rem'}}>Description</Label>}>
      <TextArea
        placeholder="Description"
        rows={5}
      />
    </FormItem>
    <FormItem label="Colour">
  
    <Button
    ref={{
      current: '[Circular]'
    }}
    onClick={function _a(){}}
  >
    Open ColorPalettePopover
  </Button>
  <ColorPalettePopover
    ref={{
      current: '[Circular]'
    }}
    onClose={function _a(){}}
    onItemClick={function _a(){}}
  >
    <ColorPaletteItem value="black" />
    <ColorPaletteItem value="darkblue" />
    <ColorPaletteItem value="#444444" />
    <ColorPaletteItem value="rgb(0,200,0)" />
    <ColorPaletteItem value="green" />
    <ColorPaletteItem value="darkred" />
    <ColorPaletteItem value="yellow" />
    <ColorPaletteItem value="blue" />
    <ColorPaletteItem value="cyan" />
    <ColorPaletteItem value="orange" />
    <ColorPaletteItem value="#5480e7" />
    <ColorPaletteItem value="#ff6699" />
  </ColorPalettePopover>
 
    </FormItem>
  </FormGroup>
</Form>
  )
}

