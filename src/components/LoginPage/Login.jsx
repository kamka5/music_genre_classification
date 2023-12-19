// LoginPage.js - strona logowania

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!email) {
      errors.email = 'Pole Email jest wymagane.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Wprowadź poprawny adres email.';
    }

    if (!password) {
      errors.password = 'Pole Hasło jest wymagane.';
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
    const mockUser = { name: 'John', email: 'john@example.com' };

    setUser(mockUser);
  };

  return (
    <div>
      <h2>Zaloguj się</h2>
      {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
      {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
      <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Hasło" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Zaloguj się</button>

      <p>Nie masz jeszcze konta? <Link to="/register">Zarejestruj się</Link></p>
    </div>
  );
};

export default LoginPage;
