// 🔑 REPLACE THIS WITH YOUR ACTUAL TMDB API KEY
const TMDB_API_KEY = 'd663591b083dc466c1cfebb69113888c';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Map moods to movie genres
const moodToGenres = {
    happy: [35, 10751, 16], // Comedy, Family, Animation
    sad: [18, 10749], // Drama, Romance
    excited: [28, 12, 878], // Action, Adventure, Sci-Fi
    scared: [27, 9648], // Horror, Mystery
    relaxed: [10749, 10402, 99], // Romance, Music, Documentary
    adventurous: [12, 14, 878], // Adventure, Fantasy, Sci-Fi
    romantic: [10749, 35], // Romance, Comedy
    thrilled: [53, 80, 9648], // Thriller, Crime, Mystery
    inspired: [18, 36, 99], // Drama, History, Documentary
    angry: [28, 80, 53], // Action, Crime, Thriller
    bored: [12, 14, 878], // Adventure, Fantasy, Sci-Fi
    curious: [9648, 878, 99] // Mystery, Sci-Fi, Documentary
};

// Find the best matching mood
function findClosestMood(userMood) {
    const lowerMood = userMood.toLowerCase();
    
    // Check for direct matches
    for (let mood in moodToGenres) {
        if (lowerMood.includes(mood)) {
            return moodToGenres[mood];
        }
    }
    
    // Check synonyms
    const synonyms = {
        joyful: 'happy', cheerful: 'happy', fun: 'happy',
        depressed: 'sad', emotional: 'sad',
        pumped: 'excited', hyped: 'excited',
        frightened: 'scared', terrified: 'scared',
        calm: 'relaxed', peaceful: 'relaxed', chill: 'relaxed',
        loving: 'romantic', sweet: 'romantic',
        tense: 'thrilled', suspenseful: 'thrilled',
        motivated: 'inspired',
        frustrated: 'angry', mad: 'angry',
        lazy: 'bored'
    };
    
    for (let synonym in synonyms) {
        if (lowerMood.includes(synonym)) {
            return moodToGenres[synonyms[synonym]];
        }
    }
    
    // Default genres
    return [28, 35, 18, 12];
}

// Fetch movies from TMDB
async function searchMovies() {
    const moodInput = document.getElementById('moodInput');
    const moviesGrid = document.getElementById('moviesGrid');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    
    const mood = moodInput.value.trim();
    
    if (!mood) {
        showError('Please describe your mood!');
        return;
    }
    
    if (TMDB_API_KEY === 'YOUR_TMDB_API_KEY_HERE') {
        showError('Please add your TMDB API key in script.js!');
        return;
    }
    
    // Show loading
    loading.style.display = 'block';
    moviesGrid.innerHTML = '';
    error.style.display = 'none';
    
    try {
        const genres = findClosestMood(mood);
        const genreQuery = genres.join(',');
        
        const response = await fetch(
            `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreQuery}&sort_by=popularity.desc&vote_count.gte=100&page=1`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }
        
        const data = await response.json();
        displayMovies(data.results.slice(0, 12));
        
    } catch (err) {
        showError('Failed to fetch movies. Please check your API key!');
        console.error(err);
    } finally {
        loading.style.display = 'none';
    }
}

// Display movies on the page
function displayMovies(movies) {
    const moviesGrid = document.getElementById('moviesGrid');
    moviesGrid.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        
        const posterUrl = movie.poster_path 
            ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
            : 'https://via.placeholder.com/200x300?text=No+Image';
        
        movieCard.innerHTML = `
            <img src="${posterUrl}" alt="${movie.title}">
            <div class="movie-info">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-details">
                    <span>⭐ ${movie.vote_average.toFixed(1)}</span>
                    <span>${movie.release_date?.split('-')[0] || 'N/A'}</span>
                </div>
            </div>
        `;
        
        moviesGrid.appendChild(movieCard);
    });
}

// Show error message
function showError(message) {
    const error = document.getElementById('error');
    error.textContent = message;
    error.style.display = 'block';
}

// Event listeners
document.getElementById('searchBtn').addEventListener('click', searchMovies);
document.getElementById('moodInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchMovies();
    }
});