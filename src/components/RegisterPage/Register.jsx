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

    if (!name) {
      errors.name = "Pole Imię jest wymagane.";
    }

    if (!surname) {
      errors.surname = "Pole Nazwisko jest wymagane.";
    }

    if (!email) {
      errors.email = "Pole Email jest wymagane.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Wprowadź poprawny adres email.";
    }

    if (!password) {
      errors.password = "Pole Hasło jest wymagane.";
    } else if (password.length < 8) {
      errors.password = "Hasło musi zawierać co najmniej 8 znaków.";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        password
      )
    ) {
      errors.password =
        "Hasło powinno zawierać co najmniej jedną małą literę, jedną wielką literę, cyfrę i znak specjalny.";
    }

    if (password !== confirmPassword) {
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
      console.error("Błąd rejestracji:", error);
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
