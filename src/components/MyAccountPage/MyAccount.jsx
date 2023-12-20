import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Chart } from "react-chartjs-2";
import "chartjs-plugin-piechart-outlabels";
import styles from "./MyAccount.module.css";

const MyAccountPage = ({ user }) => {
  const [uploadedSongs, setUploadedSongs] = useState([]);
  const [genreFrequencyData, setGenreFrequencyData] = useState({});
  const chartRef = useRef(null);

  const sampleUploadedSongs = useMemo(
    () => [
      { title: "Song1", genre: "blues" },
      { title: "Song2", genre: "classical" },
      { title: "Song3", genre: "pop" },
      { title: "Song4", genre: "hiphop" },
      { title: "Song5", genre: "hiphop" },
      { title: "Song6", genre: "jazz" },
      { title: "Song7", genre: "pop" },
      { title: "Song8", genre: "pop" },
      { title: "Song9", genre: "reggae" },
      { title: "Song10", genre: "rock" },
      { title: "Song11", genre: "blues" },
      { title: "Song12", genre: "jazz" },
      { title: "Song13", genre: "pop" },
      { title: "Song14", genre: "disco" },
      { title: "Song15", genre: "hiphop" },
      { title: "Song16", genre: "jazz" },
      { title: "Song17", genre: "metal" },
      { title: "Song18", genre: "pop" },
      { title: "Song19", genre: "reggae" },
      { title: "Song20", genre: "rock" },
      { title: "Song21", genre: "blues" },
      { title: "Song22", genre: "classical" },
      { title: "Song23", genre: "country" },
      { title: "Song24", genre: "disco" },
      { title: "Song25", genre: "hiphop" },
      { title: "Song26", genre: "jazz" },
      { title: "Song27", genre: "pop" },
      { title: "Song28", genre: "pop" },
      { title: "Song29", genre: "pop" },
      { title: "Song30", genre: "rock" },
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
              top: 70,
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

  return (
    <div className={styles.container}>
      <Link to="/">Wróć do Strony Głównej</Link>
      <h2>Moje Konto</h2>
      {user ? (
        <div>
          <p>Imię: {user.name}</p>
          <p>Nazwisko: {user.surname}</p>
          <p>Email: {user.email}</p>

          {/* Wykres częstości występowania gatunków */}
          <div>
            <h3>Wykres częstości występowania gatunków:</h3>
            <canvas id="myChart" ref={chartRef}></canvas>
            {genreFrequencyData &&
            genreFrequencyData.labels &&
            genreFrequencyData.labels.length > 0 ? null : (
              <p>Brak danych do wygenerowania wykresu.</p>
            )}
          </div>

          {/* Historia przesłanych piosenek */}
          <div>
            <h3>Historia przesłanych piosenek:</h3>
            <ul>
              {uploadedSongs && uploadedSongs.length > 0 ? (
                uploadedSongs.map((song, index) => (
                  <li key={index}>{song.title}</li>
                ))
              ) : (
                <p>Brak przesłanych piosenek.</p>
              )}
            </ul>
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
