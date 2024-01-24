// TaggedSongInfo.jsx
import React from "react";
import { Container, Row, Col, Button, ProgressBar } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import { useNavigate, useLocation } from "react-router-dom";
import "./TaggedSongInfo.module.css";

const TaggedSongInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editedTags = location.state?.editedTags || {};

  const handleGoBack = () => {
    navigate(-1); // -1 oznacza powrót do poprzedniej strony
  };

  // Mockowe dane dla wykresu czasowego
  const timeChartData = {
    labels: ["0s", "3s", "6s", "9s", "12s", "15s"],
    datasets: [
      {
        label: "Zmiana Gatunku w Czasie",
        data: [editedTags.genre, "rock", "pop", "jazz", "blues", "rock"],
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        lineTension: 0.1,
      },
    ],
  };

  // Mockowe dane dla wykresu korelacji gatunków
  const correlationChartData = {
    labels: ["Blues", "Rock", "Pop", "Jazz"],
    datasets: [
      {
        data: [30, 20, 25, 15],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
      },
    ],
  };

  // Konfiguracja dla wykresu korelacji gatunków
  const correlationChartOptions = {
    legend: {
      display: true,
      position: "right", // Możesz dostosować pozycję legendy
    },
    maintainAspectRatio: false, // Ustawienie utrzymania proporcji
    responsive: true, // Włączenie responsywności
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2>Informacje o otagowanej piosence:</h2>
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
          <Button variant="primary" onClick={handleGoBack}>
            Cofnij
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Wykres Zmian Gatunku w Czasie</h3>
          <div style={{ maxWidth: "100%", margin: "0 auto" }}>
            <ProgressBar>
              {timeChartData.labels.map((label, index) => (
                <ProgressBar
                  key={index}
                  variant="info"
                  now={(index / (timeChartData.labels.length - 1)) * 100}
                  label={label}
                />
              ))}
            </ProgressBar>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Wykres Korelacji Gatunków</h3>
          <div style={{ maxWidth: "50%", margin: "0 auto" }}>
            <Doughnut
              data={correlationChartData}
              options={correlationChartOptions}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default TaggedSongInfo;
