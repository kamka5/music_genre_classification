// HomePage.js - główna strona aplikacji

import React, { useState } from 'react';
import SongUploadForm from '../SongUploadForm/SongUpload';

const HomePage = ({ user }) => {
  const [uploadedSong, setUploadedSong] = useState(null);

  const handleUploadComplete = (song) => {
    setUploadedSong(song);
  };

  return (
    <div>
      <h1>Witaj na Stronie Głównej!</h1>
      
      {user && (
        <div>
          <h1>Witaj, {user.name}!</h1>
          <SongUploadForm onUploadComplete={handleUploadComplete} />
        </div>
      )}

      {!user && (
        <div>
          <p>Aby skorzystać z funkcji rozpoznawania gatunku, przesyłaj piosenki bez konieczności logowania się.</p>
          <SongUploadForm onUploadComplete={handleUploadComplete} />
        </div>
      )}

      {uploadedSong && (
        <div>
          <h2>Rozpoznany gatunek: {uploadedSong.genre}</h2>
          <h3>Edytuj Tagi:</h3>
          <input type="text" value={uploadedSong.tags} onChange={(e) => console.log(e.target.value)} />
          {/* Dodaj więcej pól do edycji tagów, jeśli to potrzebne */}
          <button onClick={() => console.log('Zapisz zmiany w tagach')}>Zapisz zmiany</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
