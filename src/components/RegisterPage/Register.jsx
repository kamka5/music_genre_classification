// RegisterPage.js - strona rejestracji

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.css";

const RegisterPage = ({ setUser }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (!name) {
      errors.name = "Pole Imię jest wymagane.";
    }

    if (!surname) {
      errors.surname = "Pole Nazwisko jest wymagane.";
    }

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

  const handleRegister = () => {
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Implementacja logiki rejestracji (zapytanie do backendu)
    const mockUser = { name, surname, email };

    setUser(mockUser);

    // Przenieś użytkownika do strony głównej po rejestracji
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <nav>
        <Link to="/">Powrót do strony głównej</Link>
      </nav>
      <h2>Zarejestruj się</h2>
      <input
        type="text"
        placeholder="Imię"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nazwisko"
        onChange={(e) => setSurname(e.target.value)}
      />
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
      <button onClick={handleRegister}>Zarejestruj się</button>

      {Object.keys(errors).length > 0 && (
        <div style={{ color: "red" }}>
          {Object.values(errors).map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      <p>
        Masz już konto? <Link to="/login">Zaloguj się</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
