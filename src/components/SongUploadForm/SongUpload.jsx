// SongUpload.jsx
import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner"; // Zaimportuj LoadingSpinner
import styles from "./SongUpload.module.css";

const SongUpload = ({ onUploadComplete, uploadedSong }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

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

    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", selectedFile.name.replace(/\.[^/.]+$/, ""));

    try {
      // Przesłanie pliku na serwer
      const response = await fetch("http://localhost:3000/classification/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Wystąpił błąd podczas przesyłania pliku.");
      }

      const result = await response.json();
      onUploadComplete(result);
    } catch (error) {
      console.error("Błąd podczas przesyłania pliku:", error);
      setError("Wystąpił błąd podczas przesyłania pliku. Spróbuj ponownie.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      {uploading && (
        <div className={styles.overlay}>
          <LoadingSpinner />
        </div>
      )}
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
            <div className={styles.uploadControls}>
              <button
                onClick={uploadSong}
                className={styles.uploadButton}
                disabled={uploading}
              >
                Prześlij piosenkę
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SongUpload;
