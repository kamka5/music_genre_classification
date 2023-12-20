import React, { useState } from "react";
import styles from "./SongUpload.module.css";

const SongUploadForm = ({ onUploadComplete, uploadedSong }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setError(null); // Wyczyść błąd przy zmianie pliku
  };

  const uploadSong = () => {
    if (!selectedFile) {
      setError("Nie wybrano pliku.");
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".mp3")) {
      setError("Niewłaściwy format pliku. Proszę przesłać plik MP3.");
      return;
    }

    // Tutaj można dodać logikę przesyłania pliku na serwer
    // Po zakończeniu przesyłania pliku można uzyskać informacje o piosence z serwera

    // Przykładowe informacje o piosence
    const mockSongInfo = {
      title: selectedFile.name.replace(/\.[^/.]+$/, ""),
      artist: "Przykładowy Artysta",
      album: "Przykładowy Album",
      year: "2023",
      genre: "Pop",
    };

    // Wywołaj funkcję przekazaną z props, aby przekazać informacje o piosence do komponentu nadrzędnego
    onUploadComplete(mockSongInfo);

    // Opcjonalnie: Zresetuj stan komponentu, aby umożliwić ponowne przesyłanie plików
    setSelectedFile(null);
  };

  return (
    <div className={styles.container}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {uploadedSong ? (
        <p>Plik {uploadedSong.title} został prawidłowo przesłany.</p>
      ) : (
        <>
          <input type="file" accept=".mp3" onChange={handleFileChange} />
          <button onClick={uploadSong}>Prześlij piosenkę</button>
        </>
      )}
    </div>
  );
};

export default SongUploadForm;
