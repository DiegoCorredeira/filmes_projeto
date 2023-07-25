const API_KEY = "api_key=c2318667c3843865fe1a4900b7859bec";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = `${BASE_URL}/discover/movie?language=pt-BR&sort_by=popularity.desc&${API_KEY}`;
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const SEARCH_URL = `${BASE_URL}/search/movie?${API_KEY}`;

const genres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16, 
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");

let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let lastUrl = "";
let totalPages = 100;

window.addEventListener("load", () => {
  let loader = document.querySelector(".loader");
  loader.style.display = "none";
});

let selectedGenre = [];
setGenre();
/**
 * Função setGenre()
 * Cria e exibe uma lista de tags correspondentes a diferentes gêneros de filmes.
 * Permite ao usuário clicar nas tags para selecionar ou deselecionar os gêneros de interesse.
 * Atualiza dinamicamente a lista de gêneros selecionados e destaca visualmente as tags selecionadas.
 */
function setGenre() {
  tagsEl.innerHTML = "";
  genres.forEach((genre) => {
    const t = document.createElement("div");
    t.classList.add("tag");
    t.id = genre.id;
    t.innerText = genre.name;
    t.addEventListener("click", () => {
      if (selectedGenre.length == 0) {
        selectedGenre.push(genre.id);
      } else {
        if (selectedGenre.includes(genre.id)) {
          selectedGenre.forEach((id, idx) => {
            if (id == genre.id) {
              selectedGenre.splice(idx, 1);
            }
          });
        } else {
          selectedGenre.push(genre.id);
        }
      }
      console.log(selectedGenre);
      getMovies(API_URL + "&with_genres=" + encodeURI(selectedGenre.join(",")));
      highlightSelection();
    });
    tagsEl.append(t);
  });
}
getMovies(API_URL);
function getMovies(url) {
  /**
   * Obtém os dados dos filmes da API do TMDB com base na URL fornecida e exibe os filmes na página da web.
   *
   * @param {string} url - A URL da API para obter os dados dos filmes.
   * @returns {void} - Esta função não retorna nada. Ela atualiza a página da web com os dados dos filmes obtidos.
   */
  lastUrl = url;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results);
      if (data.results.length !== 0) {
        showMovies(data.results);
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;

        current.innerText = currentPage;

        if (currentPage <= 1) {
          prev.classList.add("disabled");
          next.classList.remove("disabled");
        } else if (currentPage >= totalPages) {
          prev.classList.remove("disabled");
          next.classList.add("disabled");
        } else {
          prev.classList.remove("disabled");
          next.classList.remove("disabled");
        }

        tagsEl.scrollIntoView({ behavior: "smooth" });
      } else {
        main.innerHTML = `<h1 class="no-results">No Results Found</h1>`;
      }
    });
}

function showMovies(data) {
  /**
   * Exibe os filmes na página da web com base nos dados fornecidos.
   *
   * @param {array} data - Os dados dos filmes a serem exibidos na página. Deve ser uma lista de filme.
   * @returns {void} - Esta função não retorna nada. Ela atualiza a página da web com os filmes exibidos.
   */
  main.innerHTML = "";

  data.forEach((movie) => {
    const { title, poster_path, vote_average, overview, id } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
             <img src="${
               poster_path
                 ? IMAGE_URL + poster_path
                 : "http://via.placeholder.com/1080x1580"
             }" alt="${title}">

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>

            <div class="overview">

                <h3>Sinopse</h3>
                ${overview}
                <br/> 
                <button class="know-more" id="${id}">Saiba mais</button
            </div>
        
        `;

    main.appendChild(movieEl);

    document.getElementById(id).addEventListener("click", () => {
      console.log(id);
      openNav(movie);
    });
  });
}

function getColor(vote) {
  /**
   * Retorna a cor correspondente à classificação de um filme com base na pontuação (voto) fornecida.
   *
   * @param {number} vote - A pontuação (voto) do filme, que deve estar em uma escala de 0 a 10.
   * @returns {string} - A cor correspondente à classificação do filme: "green" para alta classificação, "orange" para média classificação e "red" para baixa classificação.
   */
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

function closeNav() {
/**
 * Fecha a navegação (overlay) que exibe trailers de filmes na página.
 * 
 * @returns {void} - Esta função não retorna nada. Ela fecha a navegação ao ajustar a largura para "0%".
 */
  document.getElementById("myNav").style.width = "0%";
}
