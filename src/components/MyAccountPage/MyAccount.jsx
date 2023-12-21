import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Chart } from "react-chartjs-2";
import "chartjs-plugin-piechart-outlabels";
import styles from "./MyAccount.module.css";

const MyAccountPage = ({ user }) => {
  const [uploadedSongs, setUploadedSongs] = useState([]);
  const [genreFrequencyData, setGenreFrequencyData] = useState({});
  const chartRef = useRef(null);
  const [displayedSongs, setDisplayedSongs] = useState(15);
  const [isChangePasswordVisible, setChangePasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const sampleUploadedSongs = useMemo(
    () => [
      { title: "Soulful Blues", genre: "blues" },
      { title: "Classical Symphony No. 1", genre: "classical" },
      { title: "Pop Sensation", genre: "pop" },
      { title: "Urban Beats", genre: "hiphop" },
      { title: "City Nights", genre: "hiphop" },
      { title: "Smooth Jazz Vibes", genre: "jazz" },
      { title: "Pop Anthem", genre: "pop" },
      { title: "Eternal Love", genre: "pop" },
      { title: "Reggae Groove", genre: "reggae" },
      { title: "Rock Revolution", genre: "rock" },
      { title: "Bluesy Afternoon", genre: "blues" },
      { title: "Jazzy Exploration", genre: "jazz" },
      { title: "Pop Extravaganza", genre: "pop" },
      { title: "Disco Fever", genre: "disco" },
      { title: "Hip Hop Flow", genre: "hiphop" },
      { title: "Midnight Jazz Session", genre: "jazz" },
      { title: "Metal Mayhem", genre: "metal" },
      { title: "Pop Euphoria", genre: "pop" },
      { title: "Reggae Serenity", genre: "reggae" },
      { title: "Rock Fusion", genre: "rock" },
      { title: "Bluesy Feelings", genre: "blues" },
      { title: "Classical Serenade", genre: "classical" },
      { title: "Country Roads", genre: "country" },
      { title: "Disco Dancefloor", genre: "disco" },
      { title: "Hip Hop Chronicles", genre: "hiphop" },
      { title: "Jazz Odyssey", genre: "jazz" },
      { title: "Pop Delight", genre: "pop" },
      { title: "Pop Celebration", genre: "pop" },
      { title: "Pop Harmony", genre: "pop" },
      { title: "Rock Anthem", genre: "rock" },
      { title: "Pop Song", genre: "pop" },
      { title: "Pop Test", genre: "pop" },
    ],
    []
  );

  useEffect(() => {
    // Symulacja pobierania historii przesłanych piosenek z bazy danych
    setUploadedSongs(sampleUploadedSongs);

    // Przygotowanie danych do wykresu - częstość występowania gatunków
    const genreFrequency = sampleUploadedSongs.reduce((acc, song) => {
      acc[song.genre] = (acc[song.genre] || 0) + 1;
      return acc;
    }, {});

    const genreLabels = Object.keys(genreFrequency);
    const genreDataValues = Object.values(genreFrequency);

    setGenreFrequencyData({
      labels: genreLabels,
      datasets: [
        {
          data: genreDataValues,
          backgroundColor: generateColors(genreLabels.length),
          borderColor: "white",
          borderWidth: 1,
        },
      ],
    });
  }, [sampleUploadedSongs]);

  useEffect(() => {
    const chartCanvas = chartRef.current;
    const chartInstance = chartCanvas && chartCanvas.chart;

    if (chartInstance) {
      chartInstance.destroy();
    }

    // Renderowanie nowego wykresu typu pie chart
    if (
      genreFrequencyData &&
      genreFrequencyData.labels &&
      genreFrequencyData.labels.length > 0
    ) {
      const newChartInstance = new Chart(chartCanvas, {
        type: "pie",
        data: genreFrequencyData,
        options: {
          plugins: {
            pieceLabel: {
              render: "percentage",
              fontColor: "white",
              precision: 2,
            },
          },
          layout: {
            padding: {
              top: 75,
              bottom: 50,
            },
          },
          legend: {
            display: false,
          },
          elements: {
            arc: {
              borderWidth: 0,
            },
          },
        },
      });

      chartCanvas.chart = newChartInstance;
    }
  }, [genreFrequencyData]);

  const generateColors = (count) => {
    // Funkcja generująca kolorowe tła dla każdego gatunku
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * (360 / count)) % 360; // Rozłożenie kolorów w przestrzeni barw
      colors.push(`hsla(${hue}, 70%, 50%, 0.7)`);
    }
    return colors;
  };

  const handleChangePassword = async () => {
    try {
      // Tutaj użyj funkcji lub endpointu API do zmiany hasła
      // Przykład (załóżmy, że masz funkcję changePassword w swoim API):
      // await changePassword(user.id, newPassword);
      console.log("Hasło zostało zmienione!");
      //setChangePasswordVisible(false); // Schowaj formularz po udanej zmianie hasła
      navigate("/logout");
    } catch (error) {
      console.error("Błąd podczas zmiany hasła:", error.message);
    }
  };

  return (
    <div className={styles.container}>
      <Link to="/">Wróć do Strony Głównej</Link>
      <h2>Moje Konto</h2>
      {user ? (
        <div>
          <p>Imię: {user.name}</p>
          <p>Nazwisko: {user.surname}</p>
          <p>Email: {user.email}</p>
          <br />
          {/* Formularz zmiany hasła */}
          <div>
            {/* Przycisk pokazujący formularz zmiany hasła */}
            {!isChangePasswordVisible && (
              <button
                id="passwordChange"
                onClick={() => setChangePasswordVisible(true)}
              >
                Zmiana hasła
              </button>
            )}

            {/* Formularz zmiany hasła */}
            {isChangePasswordVisible && (
              <div>
                <label>
                  Aktualne hasło:
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </label>
                <label>
                  Nowe hasło:
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </label>
                <label>
                  Potwierdź hasło:
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </label>
                <button onClick={handleChangePassword}>Zmień hasło</button>
              </div>
            )}
          </div>

          {/* Wykres częstości występowania gatunków */}
          <div>
            <br />
            <h3>
              Najczęściej występujące gatunki na podstawie historii utworów:
            </h3>
            <canvas id="myChart" ref={chartRef}></canvas>
            {genreFrequencyData &&
            genreFrequencyData.labels &&
            genreFrequencyData.labels.length > 0 ? null : (
              <p>Brak danych do wygenerowania wykresu.</p>
            )}
          </div>

          {/* Historia przesłanych piosenek */}
          <div>
            <br />
            <h3>Historia przesłanych piosenek:</h3>
            <ul>
              {uploadedSongs && uploadedSongs.length > 0 ? (
                uploadedSongs.slice(0, displayedSongs).map((song, index) => (
                  <li key={index}>
                    <b>{song.title}</b> - {song.genre}
                  </li>
                ))
              ) : (
                <p>Brak przesłanych piosenek.</p>
              )}
            </ul>
            {uploadedSongs.length > displayedSongs && (
              <button onClick={() => setDisplayedSongs((prev) => prev + 15)}>
                Pokaż więcej
              </button>
            )}
          </div>
        </div>
      ) : (
        <p>
          Nie jesteś zalogowany. <Link to="/login">Zaloguj się</Link>
        </p>
      )}
    </div>
  );
};

export default MyAccountPage;
