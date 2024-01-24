// SongList.jsx
import React, { useState } from "react";

const SongList = ({ songs, onSongClick }) => {
  const [selectedGenre, setSelectedGenre] = useState("all");

  const uniqueGenres = [...new Set(songs.map((song) => song.genre))];
  const filteredSongs =
    selectedGenre === "all"
      ? songs
      : songs.filter((song) => song.genre === selectedGenre);

  return (
    <div>
      <label>
        Filtruj według gatunku:
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="all">Wszystkie</option>
          {uniqueGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </label>
      <ul>
        {filteredSongs.map((song, index) => (
          <li key={index} onClick={() => onSongClick(song)}>
            <b>{song.title}</b> - {song.genre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongList;
