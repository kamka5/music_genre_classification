import React, { useState } from "react";
import styles from "./SongUpload.module.css";

const SongUploadForm = ({ onUploadComplete, uploadedSong }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setError(null);
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

    // Wywołaj funkcję przekazaną z props, aby przekazać informacje o piosence do komponentu nadrzędnego
    onUploadComplete(selectedFile, selectedFile.name.replace(/\.[^/.]+$/, ""));

    // Opcjonalnie: Zresetuj stan komponentu, aby umożliwić ponowne przesyłanie plików
    setSelectedFile(null);
  };

  return (
    <div className={styles.container}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {uploadedSong ? (
        <p className={styles.successMessage}>
          Plik {uploadedSong.title} został prawidłowo przesłany.
        </p>
      ) : (
        <div className={styles.formContent}>
          <label htmlFor="fileInput" className={styles.customUploadButton}>
            {selectedFile
              ? selectedFile.name
              : "Wybierz plik mp3 do przesłania..."}
          </label>
          <input
            type="file"
            id="fileInput"
            className={styles.fileInput}
            accept=".mp3"
            onChange={handleFileChange}
          />
          {selectedFile && (
            <button onClick={uploadSong} className={styles.uploadButton}>
              Prześlij piosenkę
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SongUploadForm;
