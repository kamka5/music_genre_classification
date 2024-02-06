import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  XAxis,
  YAxis,
  Legend as RechartsLegend,
} from "recharts";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./TaggedSongInfo.module.css";

const TaggedSongInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editedTags = location.state?.editedTags || {};

  const handleGoBack = () => {
    navigate(-1);
  };

  const genres = [
    "Pop",
    "Pop",
    "Pop",
    "Disco",
    "Pop",
    "Rock",
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
    "Metal",
    "Disco",
  ];

  const timeChartData = genres.map((genre, index) => ({
    time: `${index * 9}s`,
    genre: genre,
  }));

  const correlationChartData = [
    { name: "Blues", value: 40, color: "#FF6384" },
    { name: "Rock", value: 20, color: "#36A2EB" },
    { name: "Pop", value: 25, color: "#FFCE56" },
    { name: "Jazz", value: 15, color: "#4CAF50" },
  ];

  return (
    <Container className={styles.container}>
      <Row>
        <Col>
          <h1 className={styles.songInfoTitle}>
            Informacje o otagowanej piosence:
          </h1>
          <br />
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
      <Row>
        <Col>
          <h3>Wykres Zmian Gatunku w Czasie</h3>
          <div className={styles.chartContainer}>
            <LineChart
              width={800}
              height={400}
              data={timeChartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <XAxis dataKey="time" />
              <YAxis
                type="category"
                dataKey="genre"
                tickCount={4}
                domain={genres}
                ticks={genres}
                tickFormatter={(value) => value}
              />
              <Tooltip />
              <Line
                type="step"
                dataKey="genre"
                stroke="#36A2EB" // Zmiana koloru na niebieski
                fill="#36A2EB"
                connectNulls={false}
                name="Gatunek"
              />
            </LineChart>
          </div>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <h3>Diagram Korelacji Gatunków</h3>
          <div className={styles.chartContainer}>
            <PieChart width={750} height={400}>
              <Pie
                dataKey="value"
                data={correlationChartData}
                outerRadius={170}
                label
              >
                {correlationChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsLegend
                verticalAlign="top"
                align="left"
                layout="vertical"
                iconType="circle"
              />
              <Tooltip />
            </PieChart>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default TaggedSongInfo;
