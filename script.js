const API_KEY = "c2318667c3843865fe1a4900b7859bec";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}`
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const SEARCH_URL = `${BASE_URL}/search/movie?${API_KEY}`;


function closeNav(){
    document.getElementById("myNav").style.width = "0%";
}