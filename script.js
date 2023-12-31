/**
 * API_KEY: A chave de API necessária para acessar a API The Movie Database. Chave obrigatória para fazer requisição.
 * BASE_URL: URL base para fazer requisição à API The Movie Database.
 * API_URL: A URL completa para obter dados de filmes da API. Ela recupera filmes populares ordenados por popularidade em ordem decrescente e no idioma PT-BR.
 * IMAGE_URL: A URL base para imagens de filmes. Obtem a imagem do filme.
 * SEARCH_URL: A URL completa para pesquisar filmes na API. Permite pesquisar filmes (será sempre em PT-BR)
 */
const API_KEY = "api_key=c2318667c3843865fe1a4900b7859bec";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = `${BASE_URL}/discover/movie?language=pt-BR&sort_by=popularity.desc&${API_KEY}`;
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const SEARCH_URL = `${BASE_URL}/search/movie?language=pt-BR&${API_KEY}`;

const genres = [
  {
    id: 28,
    name: "Ação",
  },
  {
    id: 12,
    name: "Aventura",
  },
  {
    id: 16,
    name: "Animação",
  },
  {
    id: 35,
    name: "Comedia",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentário",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Familiar",
  },
  {
    id: 14,
    name: "Fantasia",
  },
  {
    id: 36,
    name: "Historia",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Musica",
  },
  {
    id: 9648,
    name: "Mistério",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Ficção cientifica",
  },
  {
    id: 10770,
    name: "Série",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "Guerra",
  },
  {
    id: 37,
    name: "Velho Oeste",
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

function highlightSelection() {
  /**
   * Destaca visualmente as tags de gênero selecionadas na página.
   *
   * @returns {void} - Esta função não retorna nada. Ela destaca as tags de gênero selecionadas adicionando a classe "highlight".
   */
  const tags = document.querySelectorAll(".tag");
  tags.forEach((tag) => {
    tag.classList.remove("highlight");
  });
  clearBtn();
  if (selectedGenre.length != 0) {
    selectedGenre.forEach((id) => {
      const hightlightedTag = document.getElementById(id);
      hightlightedTag.classList.add("highlight");
    });
  }
}

function clearBtn() {
  /**
   * Exibe ou oculta o botão "Clear" (Limpar) na página, permitindo que o usuário limpe as seleções de gênero feitas.
   *
   * @returns {void} - Esta função não retorna nada. Ela manipula a exibição do botão "Clear".
   */
  let clearBtn = document.getElementById("clear");
  if (clearBtn) {
    clearBtn.classList.add("highlight");
  } else {
    let clear = document.createElement("div");
    clear.classList.add("tag", "highlight");
    clear.id = "clear";
    clear.innerText = "Limpar";
    clear.addEventListener("click", () => {
      selectedGenre = [];
      setGenre();
      getMovies(API_URL);
    });
    tagsEl.append(clear);
  }
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
  axios
    .get(url)
    .then((response) => {
      const data = response.data;
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
        main.innerHTML = `<h1 class="no-results">Não foi encontrado um resultado.</h1>`;
      }
    })
    .catch((error) => {
      console.log("Erro!!", error);
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

const overlayContent = document.getElementById("overlay-content");
function openNav(movie) {
  /**
   * Abre a navegação (overlay) para exibir trailers de filmes na página.
   *
   * @param {object} movie - Objeto contendo informações do filme, incluindo o ID necessário para obter os trailers.
   * @returns {void} - Esta função não retorna nada. Ela abre a navegação (overlay) e carrega os trailers de filmes na página.
   */
  let id = movie.id;
  fetch(BASE_URL + "/movie/" + id + "/videos?" + API_KEY)
    .then((res) => res.json())
    .then((videoData) => {
      console.log(videoData);
      if (videoData) {
        document.getElementById("myNav").style.width = "100%";
        if (videoData.results.length > 0) {
          let embed = [];
          let dots = [];
          videoData.results.forEach((video, idx) => {
            let { name, key, site } = video;

            if (site == "YouTube") {
              embed.push(`
              <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          
          `);

              dots.push(`
              <span class="dot">${idx + 1}</span>
            `);
            }
          });

          let content = `
        <h1 class="no-results">${movie.original_title}</h1>
        <br/>
        
        ${embed.join("")}
        <br/>

        <div class="dots">${dots.join("")}</div>
        
        `;
          overlayContent.innerHTML = content;
          activeSlide = 0;
          showVideos();
        } else {
          overlayContent.innerHTML = `<h1 class="no-results">Não foi encontrado um resultado.</h1>`;
        }
      }
    });
}

function closeNav() {
  /**
   * Fecha a navegação (overlay) que exibe trailers de filmes na página.
   *
   * @returns {void} - Esta função não retorna nada. Ela fecha a navegação ao ajustar a largura para "0%".
   */
  document.getElementById("myNav").style.width = "0%";
}

let activeSlide = 0;
let totalVideos = 0;

function showVideos() {
  /**
   * Atualiza a exibição dos vídeos incorporados (embed) e os pontos indicadores (dots) de um slider de vídeos.
   *
   * @param {number} activeSlide - O índice do vídeo atualmente visível no slider.
   * @returns {void} - Esta função não retorna nada. Ela atualiza a exibição dos vídeos e os pontos indicadores com base no índice fornecido.
   */
  let embedClasses = document.querySelectorAll(".embed");
  let dots = document.querySelectorAll(".dot");

  totalVideos = embedClasses.length;
  embedClasses.forEach((embedTag, idx) => {
    if (activeSlide == idx) {
      embedTag.classList.add("show");
      embedTag.classList.remove("hide");
    } else {
      embedTag.classList.add("hide");
      embedTag.classList.remove("show");
    }
  });

  dots.forEach((dot, indx) => {
    if (activeSlide == indx) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");

leftArrow.addEventListener("click", () => {
  if (activeSlide > 0) {
    activeSlide--;
  } else {
    activeSlide = totalVideos - 1;
  }

  showVideos();
});

rightArrow.addEventListener("click", () => {
  if (activeSlide < totalVideos - 1) {
    activeSlide++;
  } else {
    activeSlide = 0;
  }
  showVideos();
});

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

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value;
  selectedGenre = [];
  setGenre();
  if (searchTerm) {
    getMovies(SEARCH_URL + "&query=" + searchTerm);
  } else {
    getMovies(API_URL);
  }
});

prev.addEventListener("click", () => {
  if (prevPage > 0) {
    pageCall(prevPage);
  }
});

next.addEventListener("click", () => {
  if (nextPage <= totalPages) {
    pageCall(nextPage);
  }
});

function pageCall(page) {
  /**
   * A função pageCall recebe um número de página como entrada e modifica a URL para obter filmes da página correspondente.
   * Se o parâmetro de consulta "page" ainda não existir na URL, ele adiciona o parâmetro "page" à URL e obtém filmes da página especificada.
   * Se o parâmetro de consulta "page" já existir, ele atualiza o número da página e obtém filmes de acordo com o número fornecido.
   *
   * @param {number} page - O número da página para obter filmes.
   * @returns {void} - Esta função não retorna nada. Ela atualiza a URL e obtém filmes com base no número da página fornecido.
   */
  let urlSplit = lastUrl.split("?");
  let queryParams = urlSplit[1].split("&");
  let key = queryParams[queryParams.length - 1].split("=");
  if (key[0] != "page") {
    let url = lastUrl + "&page=" + page;
    getMovies(url);
  } else {
    key[1] = page.toString();
    let a = key.join("=");
    queryParams[queryParams.length - 1] = a;
    let b = queryParams.join("&");
    let url = urlSplit[0] + "?" + b;
    getMovies(url);
  }
}
