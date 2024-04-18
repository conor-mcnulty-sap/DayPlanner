import React from "react";
import { CarpoolForm } from "../components/CarpoolForm";
import { CarpoolList } from "../components/CarpoolList";

function Carpool() {
  const x = 10;

  return (
    <>
      <h1>Carpool</h1>
      <CarpoolForm />
      <CarpoolForm />
      <CarpoolList />
    </>
  );
}

export default Carpool;
