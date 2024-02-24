import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Register.module.css";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    const MAX_NAME_LENGTH = 100;
    const MAX_SURNAME_LENGTH = 100;
    const MAX_EMAIL_LENGTH = 255;
    const MAX_PASSWORD_LENGTH = 100;

    if (!name.trim()) {
      errors.name = "Pole Imię jest wymagane.";
    } else if (name.length > MAX_NAME_LENGTH) {
      errors.name = `Imię nie może przekraczać ${MAX_NAME_LENGTH} znaków.`;
    }

    if (!surname.trim()) {
      errors.surname = "Pole Nazwisko jest wymagane.";
    } else if (surname.length > MAX_SURNAME_LENGTH) {
      errors.surname = `Nazwisko nie może przekraczać ${MAX_SURNAME_LENGTH} znaków.`;
    }

    if (!email.trim()) {
      errors.email = "Pole Email jest wymagane.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Wprowadź poprawny adres email.";
    } else if (email.length > MAX_EMAIL_LENGTH) {
      errors.email = `Email nie może przekraczać ${MAX_EMAIL_LENGTH} znaków.`;
    }

    if (!password.trim()) {
      errors.password = "Pole Hasło jest wymagane.";
    } else if (password.length < 8 || password.length > MAX_PASSWORD_LENGTH) {
      errors.password = "Hasło musi zawierać od 8 do 100 znaków.";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        password
      )
    ) {
      errors.password =
        "Hasło powinno zawierać co najmniej jedną małą i wielką literę, cyfrę oraz znak specjalny.";
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = "Pole Potwierdź hasło jest wymagane.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Hasła nie pasują do siebie.";
    }

    return errors;
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleRegister();
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);

      const formErrors = validateForm();

      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }

      const response = await axios.post("http://localhost:3000/auth/signup", {
        firstName: name,
        lastName: surname,
        email,
        password,
      });

      const { access_token } = response.data;
      localStorage.setItem("accessToken", access_token);

      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrors({ email: "Konto o podanym mailu już istnieje." });
      } else {
        console.error("Błąd rejestracji:", error);
      }
    } finally {
      setLoading(false);
    }
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
        onKeyPress={handleKeyPress}
      />
      <input
        type="text"
        placeholder="Nazwisko"
        onChange={(e) => setSurname(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <input
        type="text"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <input
        type="password"
        placeholder="Hasło"
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <input
        type="password"
        placeholder="Potwierdź hasło"
        onChange={(e) => setConfirmPassword(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button
        onClick={handleRegister}
        disabled={loading}
        style={{ marginBottom: "5%" }}
      >
        {loading ? "Trwa rejestracja..." : "Zarejestruj się"}
      </button>

      {Object.keys(errors).length > 0 && (
        <div style={{ color: "red", marginTop: "-6%", marginBottom: "6%" }}>
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
