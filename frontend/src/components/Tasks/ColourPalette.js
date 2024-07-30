import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { ColorPalettePopover, ColorPaletteItem } from '@ui5/webcomponents-react';
import { Button } from '@ui5/webcomponents-react/dist/Button';

const ColorPalettePopoverComponent = forwardRef((props, ref) => {
  const popoverRef = useRef();
  const [selectedColor, setSelectedColor] = useState(null);

  const onButtonClick = (e) => {
    if (popoverRef.current) {
      popoverRef.current.showAt(e.target);
    }
  };

  const onColorSelect = (e) => {
    console.log('Color select event:', e);
    const selectedColorValue = e.detail.color;
    console.log('Color selected:', selectedColorValue);
    setSelectedColor(selectedColorValue);
    if (props.onColorSelect) {
      props.onColorSelect(selectedColorValue);
    }
  };

  useImperativeHandle(ref, () => ({
    getColor: () => {
      console.log('Getting color:', selectedColor);
      return selectedColor;
    }
  }));

  return (
    <>
      <Button onClick={onButtonClick}>Choose Colour</Button>
      <ColorPalettePopover ref={popoverRef} onItemClick={onColorSelect}>
        <ColorPaletteItem value="#1B90FF" />
        <ColorPaletteItem value="#0070F2" />
        <ColorPaletteItem value="#5B738B" />
        <ColorPaletteItem value="#049F9A" />
        <ColorPaletteItem value="#36A41D" />
        <ColorPaletteItem value="#FFC933" />
        <ColorPaletteItem value="#E76500" />
        <ColorPaletteItem value="#D20A0A" />
        <ColorPaletteItem value="#DF1278" />
        <ColorPaletteItem value="#FF8AF0" />
        <ColorPaletteItem value="#7858FF" />
        <ColorPaletteItem value="#12171C" />
      </ColorPalettePopover>
    </>
  );
});

export default ColorPalettePopoverComponent;
