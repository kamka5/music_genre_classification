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
  const [isUploadFormVisible, setIsUploadFormVisible] = useState(true);
  const [isTagFormVisible, setIsTagFormVisible] = useState(false);
  const [isUploadSuccessMessageVisible, setIsUploadSuccessMessageVisible] =
    useState(false);

  const handleUploadComplete = (song) => {
    setUploadedSong(song);
    setEditedTags({
      title: song.title,
      artist: song.artist,
      album: song.album,
      year: song.year,
      genre: song.genre,
    });
    setIsUploadFormVisible(false);
    setIsTagFormVisible(true);
    setIsUploadSuccessMessageVisible(true);
  };

  const handleTagChange = (field, value) => {
    setEditedTags((prevTags) => ({
      ...prevTags,
      [field]: value,
    }));
  };

  const saveChanges = () => {
    if (!uploadedSong) {
      console.error("Nie wybrano pliku. Zapisywanie zmian niemożliwe.");
      return;
    }

    // Przykład: Zapisz zmiany tylko jeśli piosenka została przesłana
    // Tutaj można dodać logikę zapisywania tagów na serwerze

    // Alert informujący użytkownika o pomyślnym zapisaniu tagów
    alert(
      "Zapisano zmiany w tagach! \nWykryty i przypisany najbliższy gatunek - pop 67.21%. \n\nInne korelacje: disco - 23.55%, jazz - 8,07%, classical - 1,17%"
    );

    // Zresetuj stan uploadedSong
    setUploadedSong(null);

    // Przywróć widoczność formularza uploadu
    setIsUploadFormVisible(true);
    setIsTagFormVisible(false);
  };

  const cancelChanges = () => {
    setUploadedSong(null);
    setIsUploadFormVisible(true);
    setIsTagFormVisible(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>Oznaczanie utworów muzycznych</h1>
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
              <span> | </span>
              <Link to="/logout">Wyloguj</Link>
            </div>
          )}
        </nav>
      </header>

      {isUploadFormVisible && (
        <section className={styles.mainContent}>
          <h1>Prześlij i otaguj swoje pliki muzyczne</h1>

          {!user && (
            <div>
              <p>
                Otagowuj bez konieczności logowania się. By zyskać dostęp do
                historii przesłanych utworów i ich statystyki gatunków
                muzycznych, pokuś się o założenie konta.
              </p>
              <SongUploadForm
                onUploadComplete={handleUploadComplete}
                uploadedSong={uploadedSong}
              />
            </div>
          )}

          {user && (
            <div>
              <h1>Witaj, {user.name}!</h1>
              <SongUploadForm
                onUploadComplete={handleUploadComplete}
                uploadedSong={uploadedSong}
              />
            </div>
          )}
        </section>
      )}

      {isTagFormVisible && (
        <section className={styles.mainContent}>
          <div>
            {isUploadSuccessMessageVisible && (
              <p className={styles.successMessage}>
                Utwór o nazwie {uploadedSong.title}.mp3 został prawidłowo
                przesłany.
              </p>
            )}
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
            <p>
              <b>
                Gatunek zostanie rozpoznany i dodany do tagów utworu
                automatycznie.
              </b>
            </p>
            <br />
            <button onClick={saveChanges}>Zapisz zmiany</button>
            <button onClick={cancelChanges}>Anuluj zmiany</button>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
