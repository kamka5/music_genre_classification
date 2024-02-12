import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.css";

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Sprawdź, czy użytkownik jest już zalogowany po załadowaniu komponentu
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      // Przenieś użytkownika do strony głównej
      navigate("/");
    }
  }, [navigate]); // Pusta tablica zależności oznacza, że useEffect zostanie uruchomiony tylko raz po zamontowaniu komponentu

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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      const formErrors = validateForm();

      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }

      // Wysyłanie żądania do backendu
      const response = await axios.post("http://localhost:3000/auth/signin", {
        email,
        password,
      });

      // Przetwarzanie odpowiedzi z backendu
      const { access_token } = response.data;
      localStorage.setItem("accessToken", access_token);

      // Przenieś użytkownika do strony głównej po zalogowaniu
      navigate("/");
    } catch (error) {
      console.error(
        "Błąd logowania:",
        (error.response && error.response.data) || error.message
      );
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
      <h2>Zaloguj się</h2>
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
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Trwa logowanie..." : "Zaloguj się"}
      </button>

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
