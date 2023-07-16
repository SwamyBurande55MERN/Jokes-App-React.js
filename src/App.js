import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css";

const App = () => {
  const [joke, setJoke] = useState(null);
  const [rating, setRating] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarks, setShowBookmarks] = useState(false);

  useEffect(() => {
    fetchJoke();
  }, []);

  const fetchJoke = async () => {
    try {
      const response = await axios.get(
        'https://official-joke-api.appspot.com/random_joke'
      );
      setJoke(response.data);
      setRating(getRatingFromLocalStorage(response.data.id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleRate = (value) => {
    setRating(value);
    saveRatingToLocalStorage(joke.id, value);
  };

  const handleBookmark = () => {
    const newBookmark = { ...joke, rating };
    setBookmarks([...bookmarks, newBookmark]);
    saveBookmarksToLocalStorage([...bookmarks, newBookmark]);
  };

  const removeBookmark = (id) => {
    const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
    setBookmarks(updatedBookmarks);
    saveBookmarksToLocalStorage(updatedBookmarks);
  };

  const getRatingFromLocalStorage = (jokeId) => {
    const ratings = JSON.parse(localStorage.getItem('jokeRatings')) || {};
    return ratings[jokeId] || null;
  };

  const saveRatingToLocalStorage = (jokeId, ratingValue) => {
    const ratings = JSON.parse(localStorage.getItem('jokeRatings')) || {};
    const updatedRatings = { ...ratings, [jokeId]: ratingValue };
    localStorage.setItem('jokeRatings', JSON.stringify(updatedRatings));
  };

  const saveBookmarksToLocalStorage = (bookmarks) => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  };

  const loadBookmarksFromLocalStorage = () => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    setBookmarks(savedBookmarks);
  };

  const toggleBookmarksModal = () => {
    setShowBookmarks(!showBookmarks);
  };

  const handleNewJoke = () => {
    fetchJoke();
  };

  useEffect(() => {
    loadBookmarksFromLocalStorage();
  }, []);

  return (
    <div className="container main">
      <header>
        <h1>🤣🤣JOKES APP 🤣🤣</h1>
        <button className="btn btn-primary" onClick={handleNewJoke}>
          NEW 👆 JOKE
        </button>
        <button
          className="btn btn-primary"
          onClick={toggleBookmarksModal}
          style={{ marginLeft: '10px' }}
        >
          BOOKMARKED 🔖 JOKES : ({bookmarks.length})
        </button>
      </header>

      <main>
        {joke ? (
          <div className="joke-card">
            <p><b>Joke Type : </b>{joke.type}</p>
            <p>{joke.setup}</p>
            <p>{joke.punchline}</p>
            <div className="rating">
              <span>Rate this joke :</span>
              {[1, 2, 3, 4, 5].map((value) => (
                <span
                  key={value}
                  className={`star ${rating === value ? 'active' : ''}`}
                  onClick={() => handleRate(value)}
                >
                  ★
                </span>
              ))}
            </div>
            <button className="btn btn-primary" onClick={handleBookmark}>
              Add Bookmark 🔖
            </button>
          </div>
        ) : (
          <p>Loading joke...</p>
        )}
      </main>

      {showBookmarks && (
        <div className="modal bm">
          <div className="modal-content">
            <span className="close" onClick={toggleBookmarksModal}>
              &times;
            </span>
            <h2>Bookmarks 🔖</h2>
            {bookmarks.length > 0 ? (
              bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="bookmark">
                  <p><b>Type:</b> {bookmark.type}</p>
                  <p>{bookmark.setup}</p>
                  <p>{bookmark.punchline}</p>
                  <button
                    className="btn btn-danger" style={{ backgroundColor: "red", color: "white" }}
                    onClick={() => removeBookmark(bookmark.id)}
                  >
                    Remove Bookmark
                  </button>
                </div>
              ))
            ) : (
              <p>No bookmarks saved.</p>
            )}
          </div>
        </div>
      )}

      <footer>
        <p>
          <b>Author :</b> Swamy Burande
          <br />
          <b>Source code :</b> <a href="https://github.com/SwamyBurande55MERN">GitHub</a>
        </p>
      </footer>
    </div>
  );

};

export default App;
