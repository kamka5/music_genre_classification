import React, { useEffect, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./TaggedSongInfo.module.css";

const TaggedSongInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  //const songInfo = location.state?.songInfo || {};
  const songInfo = useMemo(
    () => location.state?.songInfo || {},
    [location.state]
  );

  useEffect(() => {
    if (!Object.keys(songInfo).length) {
      navigate("/");
    }
  }, [songInfo, navigate]);

  if (!Object.keys(songInfo).length) {
    return null;
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDownload = async () => {
    if (songInfo && songInfo.url) {
      try {
        // Zakoduj nazwę pliku i zamień spacje na plusy
        const fileName = encodeURIComponent(songInfo.url);
        const downloadUrl = `http://localhost:3000/classification/download/${fileName}`;

        // Pobierz token JWT z odpowiedniego miejsca
        const jwtToken = localStorage.getItem("accessToken");

        if (!jwtToken) {
          console.error("Brak tokena JWT");
          return;
        }

        // Dodaj token do nagłówków
        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };

        // Użyj Fetch do pobrania pliku
        const response = await fetch(downloadUrl, { headers });

        if (!response.ok) {
          console.error(
            `Błąd podczas pobierania pliku. Status: ${response.status}`
          );
          return;
        }

        // Otwórz pobrany plik w nowym oknie przeglądarki
        const blob = await response.blob();
        const fileUrl = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = fileUrl;
        a.download = `${songInfo.tags.artist} - ${songInfo.tags.title}.mp3`; // Dodaj rozszerzenie pliku
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(fileUrl);
      } catch (error) {
        console.error("Błąd podczas pobierania pliku:", error);
      }
    }
  };

  const getColorByGenre = (genre) => {
    switch (genre) {
      case "blues":
        return "#267990";
      case "classical":
        return "#d092a6";
      case "country":
        return "#e6194B";
      case "disco":
        return "#f55231";
      case "hiphop":
        return "#3cb44b";
      case "jazz":
        return "#600000"; // Zmiana koloru dla jazz
      case "metal":
        return "#031";
      case "pop":
        return "#301095";
      case "reggae":
        return "#efe119";
      case "rock":
        return "#911eb4"; // Zmiana koloru dla rock
      default:
        return "#000000";
    }
  };

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

  const genres = transformGenres(songInfo.genreSequence);

  const uniqueGenres = Array.from(new Set(genres));

  const timeChartData = genres.map((genre, index) => ({
    x: `${index * 9}s`,
    y: [0, 1],
    fillColor: getColorByGenre(genre),
    name: genre,
  }));

  const transformGenreDistribution = (genreDistribution) => {
    // Suma wszystkich wartości
    const total = Object.values(genreDistribution).reduce(
      (sum, value) => sum + value,
      0
    );

    // Przekształć na tablicę obiektów z nazwami, wartościami procentowymi i kolorami
    const distributionArray = Object.entries(genreDistribution).map(
      ([genre, value]) => ({
        name: genre,
        value: (value / total) * 100,
        color: getColorByGenre(genre),
      })
    );

    // Ustaw kolor na podstawie palety kolorów
    const colorPalette = [
      "#301095",
      "#600",
      "#911eb4",
      "#267990",
      "#f55231",
      "#031",
      "#3cb44b",
      "#efe119",
      "#e6194B",
      "#d092a6",
    ];

    distributionArray.forEach((genreData, index) => {
      genreData.color = colorPalette[index % colorPalette.length];
    });

    return distributionArray;
  };

  const correlationChartData = transformGenreDistribution(
    songInfo.genreDistribution
  );

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
        const genre = genres[dataPointIndex].toUpperCase();
        const totalSeconds = parseInt(timeChartData[dataPointIndex].x, 10);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = (totalSeconds % 60).toString().padStart(2, "0");
        const totalSecondsEnd = totalSeconds + 9;
        const minutesEnd = Math.floor(totalSecondsEnd / 60);
        const secondsEnd = (totalSecondsEnd % 60).toString().padStart(2, "0");

        return `<div class="tooltip">${minutes}:${seconds}-${minutesEnd}:${secondsEnd} - ${genre}</div>`;
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
    colors: sortedCorrelationChartData.map((entry) => entry.color),
    labels: sortedCorrelationChartData.map((entry) => entry.name),
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
            <strong>Tytuł:</strong> {songInfo.tags.title || "Brak informacji"}
          </p>
          <p>
            <strong>Wykonawca:</strong>{" "}
            {songInfo.tags.artist || "Brak informacji"}
          </p>
          <p>
            <strong>Album:</strong> {songInfo.tags.album || "Brak informacji"}
          </p>
          <p>
            <strong>Rok wydania:</strong>{" "}
            {songInfo.tags.year || "Brak informacji"}
          </p>
          <p>
            <strong>Rozpoznany gatunek:</strong>{" "}
            <strong>{songInfo.genre || "Brak informacji"}</strong>
          </p>
          <br />
          {songInfo.url && (
            <Button variant="success" onClick={handleDownload}>
              Pobierz
            </Button>
          )}
          <Button variant="primary" onClick={handleGoBack}>
            Powrót
          </Button>
        </Col>
      </Row>
      <br />
      <h3>Dominujący gatunek w kolejnych segmentach 9-sekundowych</h3>
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
            Diagram Rozkładu Gatunków w utworze{" "}
            <span className={styles.songInfo}>"{songInfo.fileName}"</span> -
            gatunek rozpoznawany co 3s segment
          </h3>{" "}
          <br />
          <div className={styles.chartContainer}>
            <div className={styles.chartContainer}>
              <ReactApexChart
                options={optionsPieChart}
                series={seriesPieChart}
                type="pie"
                height={400}
              />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default TaggedSongInfo;
