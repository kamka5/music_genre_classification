// SongUploadForm.js - formularz przesyłania piosenki

import React, { useState } from 'react';

const SongUploadForm = ({ onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    // Symulacja wysyłania pliku na serwer i odbierania odpowiedzi
    // W rzeczywistym środowisku, to zadanie należy zrealizować na serwerze.
    const mockResponse = {
      genre: 'Rock', // Tu otrzymujesz rozpoznany gatunek
      // Dodatkowe informacje z backendu
    };

    onUploadComplete(mockResponse);
  };

  return (
    <div>
      <h2>Prześlij piosenkę</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Prześlij</button>
    </div>
  );
};

export default SongUploadForm;
