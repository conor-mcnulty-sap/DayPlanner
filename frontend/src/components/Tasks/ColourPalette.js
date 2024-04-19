import React, { useRef } from 'react';
import { ColorPalettePopover, ColorPaletteItem } from '@ui5/webcomponents-react';
import { Button } from '@ui5/webcomponents-react/dist/Button';

export function ColorPalettePopoverComponent() {
  const popoverRef = useRef();

  const onButtonClick = (e) => {
    popoverRef.current.showAt(e.target);
  };

  return (
    <>
      <Button onClick={onButtonClick}>Colour</Button>
      <ColorPalettePopover ref={popoverRef}>
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
}