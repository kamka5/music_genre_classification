// SongUploadForm.js

import React, { useState } from 'react';
import styles from './SongUpload.module.css';

const SongUploadForm = ({ onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const uploadSong = () => {
    if (!selectedFile) {
      console.error('Nie wybrano pliku.');
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith('.mp3')) {
      console.error('Niewłaściwy format pliku. Proszę przesłać plik MP3.');
      return;
    }

    const mockSongInfo = {
      title: 'Przykładowa Piosenka',
      artist: 'Przykładowy Artysta',
      album: 'Przykładowy Album',
      year: '2023',
      genre: 'Pop',
    };

    onUploadComplete(mockSongInfo);
  };

  return (
    <div className={styles.container}>
      <input type="file" accept=".mp3" onChange={handleFileChange} />
      <button onClick={uploadSong}>Prześlij piosenkę</button>
    </div>
  );
};

export default SongUploadForm;
