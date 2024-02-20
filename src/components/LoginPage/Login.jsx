import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.css";
import { jwtDecode } from "jwt-decode";

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          return;
        }

        const decodedToken = jwtDecode(accessToken);

        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem("accessToken");
          navigate("/login");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Błąd sprawdzania ważności tokena:", error);
      }
    };

    checkTokenValidity();
  }, [navigate]);

  const validateForm = () => {
    const errors = {};
    const MAX_EMAIL_LENGTH = 255;
    const MAX_PASSWORD_LENGTH = 100;

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      errors.email = "Pole Email jest wymagane.";
    } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      errors.email = "Wprowadź poprawny adres email.";
    } else if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
      errors.email = `Email nie może przekraczać ${MAX_EMAIL_LENGTH} znaków.`;
    }

    if (!trimmedPassword) {
      errors.password = "Pole Hasło jest wymagane.";
    } else if (trimmedPassword.length > MAX_PASSWORD_LENGTH) {
      errors.password = `Hasło nie może przekraczać ${MAX_PASSWORD_LENGTH} znaków.`;
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

      const response = await axios.post("http://localhost:3000/auth/signin", {
        email: email.trim(),
        password: password.trim(),
      });

      const { access_token } = response.data;
      localStorage.setItem("accessToken", access_token);

      navigate("/");
    } catch (error) {
      console.error(
        "Błąd logowania:",
        (error.response && error.response.data) || error.message
      );

      if (error.response && error.response.status === 401) {
        setErrors({ general: "Nieprawidłowy email lub hasło." });
      } else {
        setErrors({ general: "Wystąpił błąd podczas logowania." });
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
      <button
        onClick={handleLogin}
        disabled={loading}
        style={{ marginBottom: "5%" }}
      >
        {loading ? "Trwa logowanie..." : "Zaloguj się"}
      </button>

      {Object.keys(errors).length > 0 && (
        <div style={{ color: "red", paddingBottom: "2%", marginTop: "-5%" }}>
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
