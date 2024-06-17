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
    </>
  );
});

export default ColorPalettePopoverComponent;