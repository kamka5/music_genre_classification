import React from "react";
import ReactApexChart from "react-apexcharts";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./TaggedSongInfo.module.css";

const TaggedSongInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editedTags = location.state?.editedTags || {};

  const handleGoBack = () => {
    navigate(-1);
  };

  const getColorByGenre = (genre) => {
    switch (genre) {
      case "blues":
        return "#1E90FF";
      case "classical":
        return "#FF1493";
      case "country":
        return "#8B4513";
      case "disco":
        return "#aCaFa0";
      case "hip-hop":
        return "#9966CC";
      case "jazz":
        return "#50FF55"; // Zmiana koloru dla jazz
      case "metal":
        return "#FF0804";
      case "pop":
        return "#36c2fB";
      case "reggae":
        return "#0000c0";
      case "rock":
        return "#FFA500"; // Zmiana koloru dla rock
      default:
        return "#000000";
    }
  };

  const originalGenres = [
    "jazz",
    "jazz",
    "jazz",
    "pop",
    "pop",
    "hiphop",
    "pop",
    "pop",
    "reggae",
    "hiphop",
    "pop",
    "jazz",
    "pop",
    "rock",
    "pop",
    "hiphop",
    "pop",
    "pop",
    "pop",
    "jazz",
    "hiphop",
    "pop",
    "pop",
    "pop",
    "pop",
    "rock",
    "pop",
    "pop",
    "pop",
    "pop",
    "jazz",
    "disco",
    "pop",
    "pop",
    "pop",
    "pop",
    "pop",
    "disco",
    "rock",
    "jazz",
    "jazz",
    "jazz",
    "pop",
    "jazz",
    "jazz",
    "pop",
    "hiphop",
    "hiphop",
    "hiphop",
    "pop",
    "pop",
    "pop",
    "pop",
    "pop",
    "pop",
    "disco",
    "pop",
    "pop",
    "pop",
    "pop",
    "pop",
    "pop",
    "disco",
    "pop",
    "pop",
    "pop",
    "pop",
    "jazz",
    "pop",
    "pop",
    "jazz",
    "disco",
    "pop",
    "jazz",
    "jazz",
    "jazz",
    "rock",
    "pop",
    "jazz",
    "jazz",
    "classical",
    "classical",
  ];

  const transformGenres = (originalGenres) => {
    const transformedGenres = [];
    let currentGenreGroup = [];

    // Zdefiniowanie funkcji poza pętlą
    const findRepeatedGenre = (uniqueGenres, currentGenreGroup) => {
      return uniqueGenres.find(
        (genre) => currentGenreGroup.filter((g) => g === genre).length >= 2
      );
    };

    for (let i = 0; i < originalGenres.length; i++) {
      currentGenreGroup.push(originalGenres[i]);

      // Sprawdzamy, czy mamy już 3 gatunki w grupie
      if (currentGenreGroup.length === 3 || i === originalGenres.length - 1) {
        // Grupujemy gatunki
        const uniqueGenres = Array.from(new Set(currentGenreGroup));
        let combinedGenre;

        // Tworzymy jedną nazwę gatunku, biorąc pod uwagę powtórzenia
        if (uniqueGenres.length === 1) {
          combinedGenre = uniqueGenres[0];
        } else {
          // Użycie funkcji zdefiniowanej poza pętlą
          const repeatedGenre = findRepeatedGenre(
            uniqueGenres,
            currentGenreGroup
          );

          if (repeatedGenre) {
            combinedGenre = repeatedGenre;
          } else {
            // Jeśli brak powtórzeń, bierzemy środkowy/losowy
            combinedGenre = uniqueGenres[Math.floor(uniqueGenres.length / 2)];
          }
        }

        // Dodajemy gatunek do nowej tablicy przekształconych gatunków
        transformedGenres.push(combinedGenre);

        // Resetujemy grupę gatunków
        currentGenreGroup = [];
      }
    }

    return transformedGenres;
  };

  const genres = transformGenres(originalGenres);

  const uniqueGenres = Array.from(new Set(genres));

  const timeChartData = genres.map((genre, index) => ({
    x: `${index * 9}s`,
    y: [0, 1],
    fillColor: getColorByGenre(genre),
    name: genre,
  }));

  const correlationChartData = [
    { name: "Blues", value: 40, color: "#FF6384" },
    { name: "Rock", value: 20, color: "#36A2EB" },
    { name: "Pop", value: 25, color: "#FFCE56" },
    { name: "Jazz", value: 15, color: "#4CAF50" },
  ];

  const optionsRangeBar = {
    chart: {
      type: "rangeBar",
      height: 400,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    xaxis: {
      labels: {
        show: false,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      offsetY: 10,
    },
    tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const genre = genres[dataPointIndex];
        return `<div class="tooltip">${genre}</div>`;
      },
    },
  };

  const legendColors = uniqueGenres.map((genre) => getColorByGenre(genre));

  // Tworzymy legendę "kolor-gatunek"
  const legend = uniqueGenres.map((genre, index) => ({
    name: genre,
    fillColor: legendColors[index],
  }));

  const sortedCorrelationChartData = correlationChartData.sort(
    (a, b) => b.value - a.value
  );

  const optionsPieChart = {
    chart: {
      type: "pie",
      width: 750,
      height: 400,
    },
    labels: sortedCorrelationChartData.map((entry) => entry.name), // Zaktualizowano etykiety
  };

  const seriesPieChart = sortedCorrelationChartData.map((entry) => entry.value);

  return (
    <Container className={styles.container}>
      <Row>
        <Col>
          <h1 className={styles.songInfoTitle}>
            Informacje o otagowanej piosence
          </h1>
          <br />
          <h2>Przypisano następujące tagi:</h2>
          <p>
            <strong>Tytuł:</strong> {editedTags.title || "Brak informacji"}
          </p>
          <p>
            <strong>Wykonawca:</strong> {editedTags.artist || "Brak informacji"}
          </p>
          <p>
            <strong>Album:</strong> {editedTags.album || "Brak informacji"}
          </p>
          <p>
            <strong>Rok wydania:</strong> {editedTags.year || "Brak informacji"}
          </p>
          <p>
            <strong>Gatunek:</strong> {editedTags.genre || "Brak informacji"}
          </p>
          <br />
          <Button variant="primary" onClick={handleGoBack}>
            Powrót
          </Button>
        </Col>
      </Row>
      <br />
      <h3>Główny Rozpoznany Gatunek w Danym Segmencie</h3>
      <br />
      <Row>
        <Col md={12} className={styles.legendCol}>
          {/* Legenda po prawej stronie */}
          <div className={styles.legendContainer}>
            {legend.map((item, index) => (
              <div key={index} className={styles.legendItem}>
                <span
                  className={styles.legendColor}
                  style={{ backgroundColor: item.fillColor }}
                ></span>
                {item.name}
              </div>
            ))}
          </div>
        </Col>
      </Row>
      <Row className={styles.chartRow}>
        <Col className={styles.chartCol}>
          <div className={styles.chartContainer}>
            <ReactApexChart
              options={optionsRangeBar}
              series={[{ data: timeChartData }]}
              type="rangeBar"
              height={400}
            />
          </div>
        </Col>
      </Row>

      <br />
      <Row>
        <Col>
          <h3>
            Diagram Korelacji Gatunków w utworze{" "}
            <span className={styles.songInfo}>
              {editedTags.artist} - {editedTags.title}
            </span>
          </h3>

          <br />
          <div className={styles.chartContainer}>
            <ReactApexChart
              options={optionsPieChart}
              series={seriesPieChart}
              type="pie"
              height={400}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default TaggedSongInfo;
