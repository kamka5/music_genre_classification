// RegisterPage.js - strona rejestracji

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterPage = ({ setUser }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!name) {
      errors.name = 'Pole Imię jest wymagane.';
    }

    if (!surname) {
      errors.surname = 'Pole Nazwisko jest wymagane.';
    }

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

  const handleRegister = () => {
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Implementacja logiki rejestracji (zapytanie do backendu)
    const mockUser = { name, surname, email };

    setUser(mockUser);
  };

  return (
    <div>
      <h2>Zarejestruj się</h2>
      {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
      {errors.surname && <p style={{ color: 'red' }}>{errors.surname}</p>}
      {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
      {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
      <input type="text" placeholder="Imię" onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Nazwisko" onChange={(e) => setSurname(e.target.value)} />
      <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Hasło" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Zarejestruj się</button>

      <p>Masz już konto? <Link to="/login">Zaloguj się</Link></p>
    </div>
  );
};

export default RegisterPage;
