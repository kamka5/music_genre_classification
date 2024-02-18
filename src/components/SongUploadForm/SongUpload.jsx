import React, { useState } from "react";
import styles from "./SongUpload.module.css";
import { useNavigate } from "react-router-dom";

const SongUploadForm = ({ onUploadComplete, isUserLoggedIn }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile) {
      setSelectedFile(droppedFile);
      setError(null);
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
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
      const base64Data = await readFileAsBase64(selectedFile);
      onUploadComplete({
        uploadedSong: base64Data,
        fileName: selectedFile.name.replace(/\.[^/.]+$/, ""),
      });
      setSelectedFile(null);
    } catch (error) {
      console.error("Błąd podczas wczytywania pliku:", error);
      setError("Błąd podczas wczytywania pliku.");
    }
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result.split(",")[1]);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <div
      className={`${styles.container} ${isDragging ? styles.dragging : ""}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className={styles.formContent}>
        <label
          htmlFor="fileInput"
          className={styles.customUploadButton}
          onClick={() => !isUserLoggedIn && navigate("/login")}
        >
          {selectedFile ? selectedFile.name : "Wybierz plik mp3 do przesłania"}
        </label>
        <br />
        {!selectedFile && (
          <span className={styles.dropArea}>albo go tutaj upuść</span>
        )}
        <input
          type="file"
          id="fileInput"
          className={styles.fileInput}
          accept=".mp3"
          onChange={handleFileChange}
          disabled={!isUserLoggedIn}
        />
        {selectedFile && (
          <button onClick={uploadSong} className={styles.uploadButton}>
            Prześlij piosenkę
          </button>
        )}
      </div>
    </div>
  );
};

export default SongUploadForm;
