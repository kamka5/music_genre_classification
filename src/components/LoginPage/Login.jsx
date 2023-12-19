// LoginPage.js - strona logowania

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (!email) {
      errors.email = "Pole Email jest wymagane.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Wprowadź poprawny adres email.";
    }

    if (!password) {
      errors.password = "Pole Hasło jest wymagane.";
    }

    return errors;
  };

  const handleLogin = () => {
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Implementacja logiki logowania (zapytanie do backendu)
    const mockUser = { name: "John", email: "john@example.com" };

    setUser(mockUser);

    // Przenieś użytkownika do strony głównej po zalogowaniu
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <nav>
        <Link to="/">Powrót do strony głównej</Link>
      </nav>
      <h2>Zaloguj się</h2>
      <input
        type="text"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Hasło"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Zaloguj się</button>

      {Object.keys(errors).length > 0 && (
        <div style={{ color: "red" }}>
          {Object.values(errors).map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      <p>
        Nie masz jeszcze konta? <Link to="/register">Zarejestruj się</Link>
      </p>
    </div>
  );
};

export default LoginPage;
