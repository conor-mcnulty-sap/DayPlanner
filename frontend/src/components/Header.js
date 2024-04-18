import React, { useCallback, useEffect, useState } from 'react';
import {
    Page,
    Title,
    Panel,
    FlexBox,
    FlexBoxDirection,
    Input,
    Button,
    ButtonDesign,
    ValueState,
  } from '@ui5/webcomponents-react';

export function Header(){

    return (
        <Page
          header={<Title>Day Planner App</Title>}
          style={{
            height: '100vh',
          }}>

        
        </Page>
      );
}