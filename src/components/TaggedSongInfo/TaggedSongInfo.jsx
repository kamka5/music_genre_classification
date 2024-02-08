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
    if (genre === "Pop") return "#36A2EB";
    if (genre === "Rock") return "#FFCE56";
    if (genre === "Metal") return "#FF6384";
    if (genre === "Disco") return "#4CAF50";
    return "#000000";
  };

  const genres = [
    "Pop",
    "Pop",
    "Pop",
    "Disco",
    "Pop",
    "Pop",
    "Rock",
    "Disco",
    "Pop",
    "Rock",
    "Pop",
    "Pop",
    "Pop",
    "Rock",
    "Metal",
    "Metal",
    "Pop",
    "Rock",
    "Pop",
    "Disco",
  ];

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

  const optionsPieChart = {
    chart: {
      type: "pie",
      width: 750,
      height: 400,
    },
    labels: correlationChartData.map((entry) => entry.name),
  };

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
            Cofnij
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
              height={350}
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
              series={correlationChartData.map((entry) => entry.value)}
              type="pie"
              height={400} // Ustawiono tylko wysokość
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default TaggedSongInfo;
