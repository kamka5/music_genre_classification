import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import SongUploadForm from "../SongUploadForm/SongUpload";
import LoadingAnim from "./LoadingAnim";
import LoadingSpinner2 from "../SongUploadForm/LoadingSpinner";
import styles from "./Home.module.css";
import axios from "axios";
import Overlay from "./Overlay";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const HomePage = () => {
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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [originalFilename, setOriginalFilename] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://localhost:3000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setIsLoading(false);
        setIsUserLoggedIn(true);
      } catch (error) {
        setIsLoading(false);
        setIsUserLoggedIn(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUploadComplete = ({ uploadedSong, fileName }) => {
    setUploadedSong(uploadedSong);
    setOriginalFilename(fileName);
    setEditedTags({
      title: fileName,
      artist: "Artysta",
      album: "Album",
      year: 2000,
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

  const saveChanges = async () => {
    if (!uploadedSong) {
      console.error("Nie wybrano pliku. Zapisywanie zmian niemożliwe.");
      return;
    }

    setIsUploading(true);

    const fileName = originalFilename;
    const tags = {
      title: editedTags.title,
      artist: editedTags.artist,
      album: editedTags.album,
      year: editedTags.year.toString(),
    };

    const data = {
      base64Data: uploadedSong,
      fileName: fileName,
      tags: tags,
    };

    try {
      const token = localStorage.getItem("accessToken");
      const songsResponse = await axios.post(
        "http://localhost:3000/classification/",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUploadedSong(null);

      setIsUploadFormVisible(true);
      setIsTagFormVisible(false);

      const userSong = songsResponse.data;

      navigate("/tagged-song-info", {
        state: { songInfo: userSong, uploadedSong: uploadedSong },
      });
    } catch (error) {
      console.error("Błąd podczas przesyłania piosenki na serwer:", error);
    } finally {
      setIsUploading(false);
    }
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

  const indices = Array.from({ length: 100 }, (_, index) => index + 1);

  const shuffledIndices = shuffleArray(indices);

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
      {isLoading && <Overlay />}
      {isLoading && <LoadingAnim />}{" "}
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
                    Zaloguj, się by móc rozpoznać gatunek i oznaczać piosenki.
                    Dodatkowo zyskasz dostęp do historii przesłanych utworów,
                    statystyk na ich temat i nie tylko.
                  </p>
                  <SongUploadForm
                    onUploadComplete={handleUploadComplete}
                    isUserLoggedIn={isUserLoggedIn}
                  />
                </div>
              )}

              {user && (
                <div>
                  <h1>Cześć {user.firstName}</h1>
                  <SongUploadForm
                    onUploadComplete={handleUploadComplete}
                    isUserLoggedIn={isUserLoggedIn}
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
                    Plik o nazwie "{""}
                    <span className={styles.songTitle}>
                      {originalFilename}.mp3
                    </span>
                    {""}" został prawidłowo przesłany.
                  </div>
                )}
                <h3 className={styles.editTagH3}>Edytuj Tagi:</h3>
                <label>
                  Tytuł:
                  <input
                    className={styles.customInput}
                    type="text"
                    value={editedTags.title}
                    onChange={(e) => handleTagChange("title", e.target.value)}
                  />
                </label>
                <label>
                  Wykonawca:
                  <input
                    className={styles.customInput}
                    type="text"
                    value={editedTags.artist}
                    onChange={(e) => handleTagChange("artist", e.target.value)}
                  />
                </label>
                <label>
                  Album:
                  <input
                    className={styles.customInput}
                    type="text"
                    value={editedTags.album}
                    onChange={(e) => handleTagChange("album", e.target.value)}
                  />
                </label>
                <label>
                  Rok wydania:
                  <input
                    className={styles.customInput}
                    type="text"
                    value={editedTags.year}
                    onChange={(e) => handleTagChange("year", e.target.value)}
                  />
                </label>
                <p>
                  <b>
                    Gatunku nie musisz wprowadzać{" "}
                    <span role="img" aria-label=":)">
                      😊
                    </span>
                  </b>
                  <br />
                  Zostanie on rozpoznany i dodany do tagów utworu automatycznie.
                </p>
                {isUploading && <Overlay />}
                {isUploading && <LoadingSpinner2 />} <br />
                {!isUploading && (
                  <div>
                    <Button variant="primary" onClick={saveChanges}>
                      Zapisz zmiany
                    </Button>
                    <Button variant="secondary" onClick={cancelChanges}>
                      Anuluj zmiany
                    </Button>
                  </div>
                )}
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
