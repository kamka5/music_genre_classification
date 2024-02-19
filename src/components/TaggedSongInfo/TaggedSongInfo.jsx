import React, { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./TaggedSongInfo.module.css";
import ReactAudioPlayer from "react-audio-player";

const TaggedSongInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const songInfo = useMemo(
    () => location.state?.songInfo || {},
    [location.state]
  );
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    if (location.state && location.state.uploadedSong) {
      const uploadedSong = location.state.uploadedSong;
      const decodedAudioData = atob(uploadedSong);

      const arrayBuffer = new ArrayBuffer(decodedAudioData.length);
      const uint8Array = new Uint8Array(arrayBuffer);

      for (let i = 0; i < decodedAudioData.length; i++) {
        uint8Array[i] = decodedAudioData.charCodeAt(i);
      }

      const blob = new Blob([uint8Array], { type: "audio/mp3" });
      const url = URL.createObjectURL(blob);

      setAudioUrl(url);
    } else {
      setAudioUrl(null);
    }
  }, [location.state]);

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
        const fileName = encodeURIComponent(songInfo.url);
        const downloadUrl = `http://localhost:3000/classification/download/${fileName}`;
        const jwtToken = localStorage.getItem("accessToken");

        if (!jwtToken) {
          console.error("Brak tokena JWT");
          return;
        }
        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };

        const response = await fetch(downloadUrl, { headers });

        if (!response.ok) {
          console.error(
            `Błąd podczas pobierania pliku. Status: ${response.status}`
          );
          return;
        }

        const blob = await response.blob();
        const fileUrl = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = fileUrl;
        a.download = `${songInfo.tags.artist} - ${songInfo.tags.title}.mp3`;
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
        return "#600000";
      case "metal":
        return "#031";
      case "pop":
        return "#301095";
      case "reggae":
        return "#efe119";
      case "rock":
        return "#911eb4";
      default:
        return "#000000";
    }
  };

  const transformGenres = (originalGenres) => {
    const transformedGenres = [];
    let currentGenreGroup = [];

    for (let i = 0; i < originalGenres.length; i++) {
      currentGenreGroup.push(originalGenres[i]);

      if (currentGenreGroup.length === 5 || i === originalGenres.length - 1) {
        if (currentGenreGroup.length === 5) {
          const genreCountMap = currentGenreGroup.reduce((map, genre) => {
            map.set(genre, (map.get(genre) || 0) + 1);
            return map;
          }, new Map());

          let mostFrequentGenre = currentGenreGroup[0];
          let maxCount = genreCountMap.get(mostFrequentGenre) || 0;

          for (const [genre, count] of genreCountMap) {
            if (count > maxCount) {
              mostFrequentGenre = genre;
              maxCount = count;
            }
          }
          transformedGenres.push(mostFrequentGenre);
        }
        currentGenreGroup = [];
      }
    }

    return transformedGenres;
  };

  const genres = transformGenres(songInfo.genreSequence);
  const uniqueGenres = Array.from(new Set(genres));

  const timeChartData = genres.map((genre, index) => ({
    x: `${index * 15}s`,
    y: [0, 1],
    fillColor: getColorByGenre(genre),
    name: genre,
  }));

  const transformGenreDistribution = (genreDistribution) => {
    const total = Object.values(genreDistribution).reduce(
      (sum, value) => sum + value,
      0
    );

    const distributionArray = Object.entries(genreDistribution).map(
      ([genre, value]) => ({
        name: genre,
        value: (value / total) * 100,
        color: getColorByGenre(genre),
      })
    );

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
        const totalSecondsEnd = totalSeconds + 15;
        const minutesEnd = Math.floor(totalSecondsEnd / 60);
        const secondsEnd = (totalSecondsEnd % 60).toString().padStart(2, "0");

        return `<div class="tooltip">${minutes}:${seconds}-${minutesEnd}:${secondsEnd} - ${genre}</div>`;
      },
    },
  };

  const legendColors = uniqueGenres.map((genre) => getColorByGenre(genre));

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

  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };

    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  return (
    <Container className={styles.container}>
      <Row>
        <Col>
          <h1 className={styles.songInfoTitle}>
            Informacje o otagowanej piosence
          </h1>
          <br />
          <h2 className={styles.songInfoSubT}>Przypisano następujące tagi:</h2>
          <div className={styles.songInform}>
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
              <strong>Rozpoznany głowny gatunek:</strong>{" "}
              <strong style={{ textTransform: "uppercase" }}>
                {songInfo.genre || "Brak informacji"}
              </strong>
            </p>
            <p>Przesłano {formatDate(songInfo.createdAt)}</p>
            <br />
            {songInfo.url && (
              <Button
                variant="success"
                className={styles.downloadBtn}
                onClick={handleDownload}
              >
                Pobierz
              </Button>
            )}
            <Button
              variant="primary"
              className={styles.goBackBtn}
              onClick={handleGoBack}
            >
              Powrót
            </Button>
          </div>
        </Col>
      </Row>
      <br />
      <br />
      <br />
      <h3>
        Dominujący gatunek w 15-sekundowych segmentach podzielonego utworu
      </h3>
      <Row>
        <Col md={12} className={styles.legendCol}>
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
      {location.state.uploadedSong && (
        <div>
          {audioUrl && (
            <ReactAudioPlayer
              src={audioUrl}
              autoPlay={false}
              controls
              style={{
                width: "82.4%",
                backgroundColor: "#727373",
                border: "1px solid #ddd",
                borderRadius: "50px",
                padding: "0.3%",
                marginLeft: "10.6%",
                marginTop: "-5%",
                marginBottom: "5%",
              }}
            />
          )}
        </div>
      )}
      <br />
      <Row>
        <Col>
          <h3>
            Dokładniejszy rozkład gatunków w utworze{" "}
            <span className={styles.songInfo}>
              "{songInfo.tags.artist} - {songInfo.tags.title}"
            </span>
          </h3>{" "}
          <h3 className={styles.songInfo}>
            Gatunek określany kolejno w każdym 3-sekundowym segmencie
          </h3>
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
          <div
            style={{
              marginBottom: "6%",
              textAlign: "center",
              marginTop: "1%",
            }}
          >
            <p
              style={{
                fontSize: "0.86em",
              }}
            >
              {" "}
              Powyższy diagram przedstawia strukturę utworu, bazując na
              fundamencie dziesięciu kluczowych gatunków muzycznych.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default TaggedSongInfo;
