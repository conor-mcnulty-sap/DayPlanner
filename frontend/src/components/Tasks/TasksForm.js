import React, { useRef, useState, useEffect } from 'react';
import {
  Form,
  Input,
  Label,
  TextArea,
  FormGroup,
  FormItem,
  TimePicker,
  Button,
  Card,
  CardHeader,
} from '@ui5/webcomponents-react';
import '@ui5/webcomponents-localization/dist/Assets.js';
import ColorPalettePopoverComponent from './ColourPalette';

const TaskForm = () => {
  const titleRef = useRef(null);
  const colourRef = useRef(null);
  const timeRef = useRef(null);
  const descRef = useRef(null);

  const [today, setToday] = useState(new Date().toISOString().split('T')[0]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      setUserId(userDetails.id); 
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get values from refs
    const title = titleRef.current ? titleRef.current.value : '';
    const colour = colourRef.current ? colourRef.current.getColor() : '';
    const time = timeRef.current ? timeRef.current.value : '';
    const desc = descRef.current ? descRef.current.value : '';

    console.log('Title:', title);
    console.log('Colour:', colour);
    console.log('Date:', today);
    console.log('Time:', time);
    console.log('Description:', desc);
    console.log('ID:', userId); 

 
    const params = new URLSearchParams({
      user_id: userId,
      task_name: title,
      task_description: desc,
      task_date: today,
      task_time: time,
      task_colour: colour,
    });

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/addtask?${params.toString()}`, {
        method: 'POST',
      });

      if (!response.ok) {
        console.error('Server error:', response.status, response.statusText);
        return;
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (data) {
        console.log('Response from server:', data);
      } else {
        console.error('No data received from server');
      }
    } catch (error) {
      console.error('Network error:', error);
    }

    if (titleRef.current) titleRef.current.value = '';
    if (timeRef.current) timeRef.current.value = '';
    if (descRef.current) descRef.current.value = '';
    if (colourRef.current) colourRef.current.value = 'null';
  };

  return (
    <Card header={<CardHeader titleText="Create A Task" />}>
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
        style={{ paddingLeft: '20px', paddingRight: '20px' }}
        onSubmit={handleSubmit}
      >
        <FormGroup>
          <FormItem label={<Label>Title</Label>}>
            <Input type="text" ref={titleRef} />
          </FormItem>
          <FormItem label={<Label>Time</Label>}>
            <TimePicker ref={timeRef} formatPattern="HH:mm" placeholder="Enter Time" />
          </FormItem>
          <FormItem label={<Label>Description</Label>}>
            <TextArea placeholder="Description" rows={5} ref={descRef} />
          </FormItem>
          <FormItem label={<Label>Colour</Label>}>
            <ColorPalettePopoverComponent ref={colourRef} />
          </FormItem>
          <FormItem>
            <Button type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </FormItem>
        </FormGroup>
      </Form>
    </Card>
  );
};

export default TaskForm;
