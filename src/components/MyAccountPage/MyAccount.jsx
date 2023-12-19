// MyAccountPage.js

import React from "react";
import { Link } from "react-router-dom";
import styles from "./MyAccount.module.css";

const MyAccountPage = ({ user }) => {
  return (
    <div className={styles.container}>
      <h2>Moje Konto</h2>
      {user ? (
        <div>
          <p>Imię: {user.name}</p>
          <p>Nazwisko: {user.surname}</p>
          <p>Email: {user.email}</p>
          <Link to="/">Wróć do Strony Głównej</Link>
        </div>
      ) : (
        <p>
          Nie jesteś zalogowany. <Link to="/login">Zaloguj się</Link>
        </p>
      )}
    </div>
  );
};

export default MyAccountPage;
