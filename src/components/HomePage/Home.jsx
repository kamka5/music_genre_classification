import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import SongUploadForm from "../SongUploadForm/SongUpload";
import LoadingSpinner from "./LoadingSpinner"; // Zaimportuj komponent LoadingSpinner
import styles from "./Home.module.css";
import axios from "axios";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const HomePage = ({ onLogout }) => {
  const [user, setUser] = useState(null);
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
  const [isLoading, setIsLoading] = useState(true); // Dodaj stan dla ładowania
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Zastąp 'yourJwtTokenKeyName' nazwą klucza, pod którym przechowujesz token w localStorage
        const response = await axios.get("http://localhost:3000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Błąd podczas pobierania danych użytkownika", error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []); // Pusty dependency array oznacza, że useEffect zostanie uruchomiony tylko raz po zamontowaniu komponentu

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

    // Tutaj można dodać logikę zapisywania tagów na serwerze
    // ...

    // Zresetuj stan uploadedSong
    setUploadedSong(null);

    // Przywróć widoczność formularza uploadu
    setIsUploadFormVisible(true);
    setIsTagFormVisible(false);

    // Przejdź na nową stronę po zapisaniu zmian
    navigate("/tagged-song-info", { state: { editedTags } });
  };

  const cancelChanges = () => {
    setUploadedSong(null);
    setIsUploadFormVisible(true);
    setIsTagFormVisible(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.reload();
  };

  const handleMyAccount = () => {
    navigate("/my-account");
  };

  const indices = Array.from({ length: 70 }, (_, index) => index + 1);

  // Tasuj tablicę liczb
  const shuffledIndices = shuffleArray(indices);

  // Utwórz tablicę okładek z użyciem tasowanych indeksów
  const albumCovers = shuffledIndices.map((index) =>
    require(`../../assets/coverImages/${index}.jpg`)
  );

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
                  <Button
                    variant="link"
                    className={styles.myAccountLink}
                    onClick={handleMyAccount}
                  >
                    Moje Konto
                  </Button>
                  <Button
                    variant="link"
                    className={styles.logoutLink}
                    onClick={handleLogout}
                  >
                    Wyloguj
                  </Button>
                </div>
              )}
            </nav>
          </header>
        </Col>
      </Row>
      {isLoading && <LoadingSpinner />}{" "}
      {/* Pokaż LoadingSpinner, gdy dane są ładowane */}
      {!isLoading && isUploadFormVisible && (
        <Row>
          <Col>
            <section className={styles.mainContent}>
              <h1 className={styles.h1Content}>
                ROZPOZNAJ GATUNEK I OTAGUJ SWOJE PLIKI MUZYCZNE
              </h1>

              {!user && (
                <div className={styles.centeredContent}>
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
                  <h1>Cześć {user.firstName},</h1>
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
      {!isLoading && isTagFormVisible && (
        <Row>
          <Col>
            <section className={styles.mainContent}>
              <div>
                {isUploadSuccessMessageVisible && (
                  <div className={styles.successMessage}>
                    Utwór o nazwie{" "}
                    <span className={styles.songTitle}>
                      {uploadedSong.title}.mp3
                    </span>{" "}
                    został prawidłowo przesłany.
                  </div>
                )}
                <h3 className={styles.editTagH3}>Edytuj Tagi:</h3>
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
      {!isUploadFormVisible ? null : (
        <Row>
          <Col>
            <div className={styles.albumCoversContainer}>
              <div className={styles.albumCovers}>
                {albumCovers.map((cover, index) => (
                  <img
                    key={index}
                    className={styles.albumCover}
                    src={cover}
                    alt={`Okładka albumu ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default HomePage;
