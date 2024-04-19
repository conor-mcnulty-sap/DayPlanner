import React from "react";

export function ColorPalettePopover() {
    const ColorPalettePopoverComponent = () => {
        const popoverRef = useRef();
        const onButtonClick = (e) => {
          popoverRef.current.showAt(e.target);
        };
        return (
            <>
              <Button onClick={onButtonClick}>Open ColorPalettePopover</Button>
              <ColorPalettePopover ref={popoverRef}>
                <ColorPaletteItem value="pink" />
                <ColorPaletteItem value="darkblue" />
              </ColorPalettePopover>
            </>
          );
        }
}
