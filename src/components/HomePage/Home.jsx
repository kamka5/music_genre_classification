import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import SongUploadForm from "../SongUploadForm/SongUpload";
import styles from "./Home.module.css"; // Zaimportuj plik ze stylami
import NotificationComponent from "../NotificationComponent/Notification";

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
  const [notificationMessage, setNotificationMessage] = useState("");

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
    setNotificationMessage(`
    <b>Zmiany w tagach zostały zapisane!</b> <br/><br/>
    <b>Tagi wprowadzone przez użytkownika:</b> <br/>
    Tytuł: ${editedTags.title} <br/>
    Wykonawca: ${editedTags.artist} <br/>
    Album: ${editedTags.album} <br/>
    Rok wydania: ${editedTags.year || "brak informacji"}<br/>
    <b>Przypisany gatunek - pop 67.21%</b> <br/><br/>
    Inne korelacje: <br/>
    disco - 23.55%, <br/>
    jazz - 8,07%, ,<br/>
    classical - 1,17% <br/>
    <br/> 
  `);

    // Zresetuj stan uploadedSong
    setUploadedSong(null);

    // Przywróć widoczność formularza uploadu
    setIsUploadFormVisible(true);
    setIsTagFormVisible(false);
  };

  const closeNotification = () => {
    setNotificationMessage("");
  };

  const cancelChanges = () => {
    setUploadedSong(null);
    setIsUploadFormVisible(true);
    setIsTagFormVisible(false);
  };

  return (
    <Container className={styles.container}>
      <Row>
        <Col>
          <header className={styles.header}>
            <div className={styles.logoContainer}>
              <img
                className={styles.logo}
                src={require("../../assets/logo.png")}
                alt="Logo aplikacji"
              />
              <h1 className={styles.pageTitle}>
                Oznaczanie utworów muzycznych
              </h1>
            </div>
            <nav className={styles.nav}>
              {!user && (
                <div className="d-flex">
                  <Link to="/login" className={`${styles.loginLink} mr-2`}>
                    Zaloguj się
                  </Link>
                  <Link
                    to="/register"
                    className={`${styles.registerLink} ml-2`}
                  >
                    Zarejestruj się
                  </Link>
                </div>
              )}

              {user && (
                <div>
                  <Link to="/my-account" className={styles.myAccountLink}>
                    Moje Konto
                  </Link>
                  <Link to="/logout" className={styles.logoutLink}>
                    Wyloguj
                  </Link>
                </div>
              )}
            </nav>
          </header>
        </Col>
      </Row>

      {isUploadFormVisible && (
        <Row>
          <Col>
            <section className={styles.mainContent}>
              <h1 className={styles.h1Content}>
                ROZPOZNAJ GATUNEK I OTAGUJ SWOJE PLIKI MUZYCZNE
              </h1>

              {!user && (
                <div>
                  <p>
                    Oznaczaj bez konieczności logowania. By zyskać dostęp do
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
                  <h1>Witaj {user.name},</h1>
                  <SongUploadForm
                    onUploadComplete={handleUploadComplete}
                    uploadedSong={uploadedSong}
                  />
                </div>
              )}
            </section>
          </Col>
        </Row>
      )}

      {isTagFormVisible && (
        <Row>
          <Col>
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
                  <b>Gatunku nie musisz wprowadzać 😊</b>
                  <br />
                  Zostanie on rozpoznany i dodany do tagów utworu automatycznie.
                </p>
                <br />
                <Button variant="primary" onClick={saveChanges}>
                  Zapisz zmiany
                </Button>
                <Button variant="secondary" onClick={cancelChanges}>
                  Anuluj zmiany
                </Button>
              </div>
            </section>
          </Col>
        </Row>
      )}

      {/* Dodaj komponent powiadomień */}
      {notificationMessage && (
        <Row>
          <Col>
            <NotificationComponent
              message={notificationMessage}
              onClose={closeNotification}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default HomePage;
