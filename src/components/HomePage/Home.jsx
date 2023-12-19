// HomePage.js - główna strona aplikacji

import React, { useState } from "react";
import { Link } from "react-router-dom";
import SongUploadForm from "../SongUploadForm/SongUpload";
import styles from "./Home.module.css"; // Zaimportuj plik ze stylami

const HomePage = ({ user }) => {
  const [uploadedSong, setUploadedSong] = useState(null);
  const [editedTags, setEditedTags] = useState({
    title: "",
    artist: "",
    album: "",
    year: "",
    genre: "",
  });

  const handleUploadComplete = (song) => {
    setUploadedSong(song);
    setEditedTags({
      title: song.title,
      artist: song.artist,
      album: song.album,
      year: song.year,
      genre: song.genre,
    });
  };

  const handleTagChange = (field, value) => {
    setEditedTags((prevTags) => ({
      ...prevTags,
      [field]: value,
    }));
  };

  const saveChanges = () => {
    // Tutaj dodaj logikę zapisywania zmian w tagach na serwerze
    console.log("Zapisano zmiany w tagach:", editedTags);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>MusicApp</h1>
        </div>
        <nav className={styles.nav}>
          {!user && (
            <div>
              <Link to="/login">Zaloguj się</Link>
              <span> | </span>
              <Link to="/register">Zarejestruj się</Link>
            </div>
          )}

          {user && (
            <div>
              <Link to="/my-account">Moje Konto</Link>
            </div>
          )}
        </nav>
      </header>

      <section className={styles.mainContent}>
        <h1>Witaj na Stronie Głównej!</h1>

        {!user && (
          <div>
            <p>Przesyłaj piosenki bez konieczności logowania się.</p>
            <SongUploadForm onUploadComplete={handleUploadComplete} />
          </div>
        )}

        {user && (
          <div>
            <h1>Witaj, {user.name}!</h1>
            <SongUploadForm onUploadComplete={handleUploadComplete} />
          </div>
        )}

        {uploadedSong && (
          <div>
            <h2>Rozpoznany gatunek: {uploadedSong.genre}</h2>
            <h3>Edytuj Tagi:</h3>
            <label>
              Tytuł:
              <input
                type="text"
                value={editedTags.title}
                onChange={(e) => handleTagChange("title", e.target.value)}
              />
            </label>
            <label>
              Wykonawca:
              <input
                type="text"
                value={editedTags.artist}
                onChange={(e) => handleTagChange("artist", e.target.value)}
              />
            </label>
            <label>
              Album:
              <input
                type="text"
                value={editedTags.album}
                onChange={(e) => handleTagChange("album", e.target.value)}
              />
            </label>
            <label>
              Rok wydania:
              <input
                type="text"
                value={editedTags.year}
                onChange={(e) => handleTagChange("year", e.target.value)}
              />
            </label>
            <label>
              Gatunek (automatycznie uzupełniony):
              <input
                type="text"
                value={editedTags.genre}
                onChange={(e) => handleTagChange("genre", e.target.value)}
                disabled
              />
            </label>
            <button onClick={saveChanges}>Zapisz zmiany</button>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
