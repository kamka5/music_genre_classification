import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Dodano import Axiosa
import styles from "./Register.module.css";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Dodano stan do obsługi ładowania
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
    } else if (password.length < 8) {
      errors.password = "Hasło musi zawierać co najmniej 8 znaków.";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        password
      )
    ) {
      errors.password =
        "Hasło powinno zawierać co najmniej jedną małą literę, jedną wielką literę, jedną cyfrę i jeden znak specjalny.";
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

      // Wysyłanie żądania do backendu
      const response = await axios.post("http://localhost:3000/auth/signup", {
        firstName: name,
        lastName: surname,
        email,
        password,
      });

      // Przetwarzanie odpowiedzi z backendu
      const { access_token } = response.data;
      localStorage.setItem("accessToken", access_token);

      // Przenieś użytkownika do strony głównej po rejestracji
      navigate("/");
    } catch (error) {
      console.error("Błąd rejestracji:", error);
      // Dodaj obsługę błędów, np. wyświetlenie komunikatu użytkownikowi
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
      <button onClick={handleRegister} disabled={loading}>
        {loading ? "Trwa rejestracja..." : "Zarejestruj się"}
      </button>

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
