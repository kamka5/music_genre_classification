import React, { useState } from "react";
import axios from "axios";
import styles from "./SongUpload.module.css";

const SongUploadForm = ({ onUploadComplete, uploadedSong }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setError(null);
  };

  const uploadSong = async () => {
    if (!selectedFile) {
      setError("Nie wybrano pliku.");
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".mp3")) {
      setError("Niewłaściwy format pliku. Proszę przesłać plik MP3.");
      return;
    }

    try {
      const reader = new FileReader();

      reader.onload = async (event) => {
        const base64data = event.target.result;

        // W tym miejscu umieść odpowiednią ścieżkę URL serwera, który obsługuje przesyłanie pliku
        const response = await axios.post("URL_DO_SERWERA", {
          file: base64data,
        });

        // Odpowiedź z serwera zawierać może informacje o przesłanej piosence
        const uploadedSongInfo = response.data;

        onUploadComplete(uploadedSongInfo);
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error("Błąd podczas przesyłania pliku:", error);
      setError("Wystąpił błąd podczas przesyłania pliku. Spróbuj ponownie.");
    }

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
