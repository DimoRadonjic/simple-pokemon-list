let loading = true;
let data = null;
let pokemons = [];
let pokemonData = null;

const baseURL = "https://pokeapi.co/api/v2/pokemon/";
const imgURL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

const pokemonList = document.getElementById("pokemon-list");

const noDataHTML = "<p>No data available.</p>";

const loadingHTML = "<p>Loading...</p>";

const pokemonCardHTML = (pokemon) => `
  <div class="pokemon-card">
  <img class="pokemon-img" src="${
    imgURL + pokemon.url.split("/").filter(Boolean).pop()
  }.png" alt="${pokemon.name}" />
    <h3>${pokemon.name}</h3>
<button onclick="fetchPokemon('${pokemon.name}')">View Details</button>
  </div>
`;

const pokemonDetailCardHTML = (pokemon) => `
    <div class="pokemon-detail-card">
    <img class="pokemon-img" src="${imgURL + pokemon.id}.png" alt="${
  pokemon.name
}" />
      <h2>${pokemon.name} (ID: ${pokemon.id})</h2>
      <p>Height: ${pokemon.height}</p>
      <p>Weight: ${pokemon.weight}</p>
      <p>Base Experience: ${pokemon.base_experience}</p>
<button onclick="fetchData()">Back to List</button>

    </div>
`;

const renderPokemons = () => {
  pokemonList.innerHTML = "";

  if (loading) {
    pokemonList.innerHTML = loadingHTML;
    return;
  }

  if (!pokemons || pokemons.length === 0) {
    pokemonList.innerHTML = noDataHTML;
    return;
  }
  pokemonList.innerHTML = pokemons
    .map((pokemon) => `<li>${pokemonCardHTML(pokemon)}</li>`)
    .join("");
};

const renderPokemon = (pokemon = null) => {
  pokemonList.innerHTML = "";
  if (loading) {
    pokemonList.innerHTML = loadingHTML;
    return;
  }

  if (!pokemons || pokemons.length === 0) {
    pokemonList.innerHTML = noDataHTML;
    return;
  }

  pokemonList.innerHTML = `<li>${pokemonDetailCardHTML(pokemon)}</li>`;
};

async function fetchData() {
  loading = true;

  try {
    const response = await fetch(baseURL);
    if (!response.ok) throw new Error("Network response was not ok");
    data = await response.json();
    pokemons = data.results;

    console.log(data.results);
    loading = false;

    renderPokemons();
  } catch (error) {
    console.error("Fetch error:", error);
    loading = false;
  }
}

async function fetchPokemon(name) {
  loading = true;
  console.log("name", name);

  try {
    const response = await fetch(baseURL + name);
    if (!response.ok) throw new Error("Network response was not ok");
    const pokemonData = await response.json();
    loading = false;
    renderPokemon(pokemonData);

    console.log(pokemonData);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchData);
