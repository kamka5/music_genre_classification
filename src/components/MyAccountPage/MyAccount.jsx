import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import styles from "./MyAccount.module.css";
import SongList from "./SongList";
import axios from "axios";

const MyAccountPage = () => {
  const [user, setUser] = useState(null);
  const [uploadedSongs, setUploadedSongs] = useState([]);
  const [genreFrequencyData, setGenreFrequencyData] = useState({});
  const [totalSongs, setTotalSongs] = useState(0);
  const [accountCreationDate, setAccountCreationDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get("http://localhost:3000/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        setUser(userResponse.data);
        setAccountCreationDate(userResponse.data.createdAt);
      } catch (error) {
        console.error("Błąd podczas pobierania danych użytkownika", error);
      }
    };

    const fetchUserSongs = async () => {
      try {
        const songsResponse = await axios.get(
          "http://localhost:3000/classification",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        const userSongs = songsResponse.data;

        setUploadedSongs(userSongs);

        const formattedSongs = userSongs.map((song) => ({
          title: song.tags.title,
          genre: song.genre,
          year: song.tags.title,
          album: song.tags.album,
          artist: song.tags.artist,
        }));

        setTotalSongs(formattedSongs.length);

        const genreFrequency = formattedSongs.reduce((acc, song) => {
          acc[song.genre] = (acc[song.genre] || 0) + 1;
          return acc;
        }, {});

        const sortedGenreFrequency = Object.entries(genreFrequency).sort(
          (a, b) => b[1] - a[1]
        );

        const genreLabelsWithCount = sortedGenreFrequency.map(
          (entry) => `${entry[0]} (${entry[1]})`
        );
        const genreDataValues = sortedGenreFrequency.map((entry) => entry[1]);
        const colors = generateColors(genreLabelsWithCount.length);

        setGenreFrequencyData({
          labels: genreLabelsWithCount,
          data: genreDataValues,
          colors: colors,
        });
      } catch (error) {
        console.error("Błąd podczas pobierania danych o piosenkach", error);
      }
    };

    fetchUserData();
    fetchUserSongs();
  }, []);

  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * (360 / count)) % 360;
      const saturation = 85;
      const lightness = 48;
      colors.push(`hsla(${hue}, ${saturation}%, ${lightness}%, 0.7)`);
    }
    return colors;
  };

  const handleSongClick = (song) => {
    navigate("/tagged-song-info", { state: { songInfo: song } });
  };

  return (
    <div className={styles.container}>
      <Link to="/">Wróć do Strony Głównej</Link>
      <h2 style={{ marginTop: "4%" }}>Twoje dane</h2>
      {user ? (
        <div>
          <div style={{ marginLeft: "1%", marginTop: "3%" }}>
            <p>
              <strong>Imię: </strong>
              {user.firstName}
            </p>
            <p>
              <strong>Nazwisko: </strong>
              {user.lastName}
            </p>
            <p>
              <strong>Email: </strong>
              {user.email}
            </p>
            <p>
              <strong>Liczba przesłanych plików muzycznych: </strong>
              {totalSongs}
            </p>{" "}
            <p style={{ marginTop: "3%" }}>
              Konto założono: {new Date(accountCreationDate).toLocaleString()}
            </p>{" "}
          </div>
          <br />
          <div>
            <br />
            <h2 style={{ textAlign: "center", marginBottom: "5%" }}>
              Najczęściej występujące gatunki na podstawie historii utworów
            </h2>
            {genreFrequencyData.labels && (
              <p
                style={{
                  textAlign: "center",
                  color: "#333",
                  marginTop: "-3%",
                  marginBottom: "4%",
                }}
              >
                Twój ulubiony gatunek to {genreFrequencyData.labels[0]}.
              </p>
            )}
            <br />
            {genreFrequencyData &&
            genreFrequencyData.labels &&
            genreFrequencyData.labels.length > 0 ? (
              <ReactApexChart
                options={{
                  labels: genreFrequencyData.labels,
                  colors: genreFrequencyData.colors,
                }}
                series={genreFrequencyData.data}
                type="donut"
                width="100%"
                height="350"
                style={{ maxWidth: "600px", margin: "auto" }}
              />
            ) : (
              <p>Brak danych do wygenerowania wykresu.</p>
            )}
          </div>
          <div>
            <br />
            <br />
            <h2 style={{ marginTop: "4%", marginBottom: "5%" }}>
              Historia przesłanych piosenek:
            </h2>
            <SongList songs={uploadedSongs} onSongClick={handleSongClick} />
          </div>
        </div>
      ) : (
        <div className={styles.notLoggedInContainer}>
          <p>Nie jesteś zalogowany.</p>
          <Link to="/login">
            <button className={styles.loginButton}>Zaloguj się</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyAccountPage;
