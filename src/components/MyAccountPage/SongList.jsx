import React, { useState } from "react";
import styles from "./SongList.module.css";

const SongList = ({ songs, onSongClick }) => {
  const [selectedGenre, setSelectedGenre] = useState("");
  const [displayedSongs, setDisplayedSongs] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");

  const uniqueGenres = [...new Set(songs.map((song) => song.genre))];

  const filteredSongsByGenre =
    selectedGenre === ""
      ? songs
      : songs.filter((song) => song.genre === selectedGenre);

  const filteredSongsBySearch = searchTerm
    ? filteredSongsByGenre.filter(
        (song) =>
          song.tags.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          song.tags.artist.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredSongsByGenre;

  const handleShowMore = () => {
    const newDisplayedSongs = Math.min(
      displayedSongs + 10,
      filteredSongsBySearch.length
    );
    setDisplayedSongs(newDisplayedSongs);
  };

  return (
    <div>
      <div className={styles.selectContainer}>
        <label>
          <span className={styles.filterSpan}>Filtruj według gatunku:</span>
          <select
            className={styles.customSelect}
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="" className={styles.customOption}>
              Wszystkie
            </option>
            {uniqueGenres.map((genre) => (
              <option key={genre} value={genre} className={styles.customOption}>
                {genre}
              </option>
            ))}
          </select>
        </label>
      </div>
      <br />
      <div className={styles.searchContainer}>
        <label>
          Wyszukaj po nazwie:
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </div>
      <ul className={styles.songList}>
        {filteredSongsBySearch.slice(0, displayedSongs).map((song, index) => (
          <li
            key={index}
            className={styles.songItem}
            onClick={() => onSongClick(song)}
          >
            <b>
              {song.tags.artist} - {song.tags.title}
            </b>{" "}
            - {song.genre} ({formatDate(song.createdAt)})
          </li>
        ))}
      </ul>
      {filteredSongsBySearch.length > displayedSongs && (
        <button onClick={handleShowMore}>Pokaż więcej</button>
      )}
    </div>
  );
};

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

export default SongList;
