import React from "react";
import { Button } from "@ui5/webcomponents-react";
import "@ui5/webcomponents/dist/features/InputSuggestions.js"; // Ensure InputSuggestions feature is imported

function VerifyDesk() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <Button style={{ fontSize: '20px', padding: '20px 20px', width: '16rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} type="submit">
        Verify Desk
      </Button>
    </div>
  );
}

export default VerifyDesk;
