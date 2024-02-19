// LoadingSpinner.js
import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingAnim = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <Spinner animation="border" variant="primary" />
      <p>Ładowanie...</p>
    </div>
  );
};

export default LoadingAnim;
