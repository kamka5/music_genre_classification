// LoadingSpinner.jsx
import React from "react";
import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = () => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.waitingPara}>
        {" "}
        Trwa przesyłanie pliku... <br />
        Zajmie to do 10 sekund.
      </p>
    </div>
  );
};

export default LoadingSpinner;
