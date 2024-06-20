import React, { useState } from "react";
import { MultiInput, Token } from "@ui5/webcomponents-react";
import "@ui5/webcomponents/dist/features/InputSuggestions.js"; // Ensure InputSuggestions feature is imported

function VerifyDesk() {
    const [emails, setEmails] = useState([]);
  
    const handleEmailChange = (event) => {
      setEmails(event.detail.tokens.map(token => token.text));
    };
  
    return (
        <MultiInput
        onChange={function _a(){}}
        onInput={function _a(){}}
        onSuggestionItemPreview={function _a(){}}
        onSuggestionItemSelect={function _a(){}}
        onTokenDelete={function _a(){}}
        onValueHelpTrigger={function _a(){}}
        style={{
          width: '400px'
        }}
        tokens={<><Token onInput={handleEmailChange} /></>}
        slot="tokens"
        type="Text"
        valueState="None"
      />
    );
  }
  
export default VerifyDesk;
