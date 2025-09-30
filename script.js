let loading = true;
let data = null;
let pokemons = [];
let pokemonData = null;
let currentPage = 1;
let itemsPerPage = 20;

const baseURLSpecies = "https://pokeapi.co/api/v2/pokemon-species/";
const baseURL = "https://pokeapi.co/api/v2/pokemon/";

const evoURL = "https://pokeapi.co/api/v2/evolution-chain/";
const imgURL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

const pokemonList = document.getElementById("pokemon-list");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageInfo = document.getElementById("page-info");
const pagination = document.getElementById("pagination");

const noDataHTML = "<p>No data available.</p>";

const loadingHTML = "<p>Loading...</p>";

const evolutionChainHTML = (chain) => {
  let current = chain;
  const items = [];

  while (current) {
    const id = current.species.url.split("/").filter(Boolean).pop();
    items.push(`
      <li class="evolution-item" >
      <button class="evo-button" onclick="fetchPokemon('${
        current.species.url
      }', '${current.species.name}')">
        <img class="pokemon-img" src="${imgURL + id}.png" alt="${
      current.species.name
    }" />
        <p>${current.species.name}</p>
        </button>
      </li>
    `);

    if (current.evolves_to && current.evolves_to.length > 0) {
      current = current.evolves_to[0];
    } else {
      break;
    }
  }

  return `
    <div class="evolution-chain">
      <h3>Evolution Chain</h3>
      <ul class="evolution-list">
        ${items.join("=>")} 
      </ul>
    </div>
  `;
};

const pokemonCardHTML = (pokemon) => `
  <div class="pokemon-card">
  <img class="pokemon-img" src="${
    imgURL + pokemon.url.split("/").filter(Boolean).pop()
  }.png" alt="${pokemon.name}" />
    <h3>${pokemon.name}</h3>
  <button class="button" onclick="fetchPokemon('${pokemon.url}', '${
  pokemon.name
}')">View Details</button>
  </div>
`;

const pokemonDetailCardHTML = (pokemon) => `
    <div class="pokemon-detail-card">
    <div class="pokemon-info">
        <img class="pokemon-img-detail" src="${imgURL + pokemon.id}.png" alt="${
  pokemon.name
}" />
      <div class="main-info">
      <h2>${pokemon.name} </h2>
      <p>Height: ${pokemon.height}</p>
      <p>Weight: ${pokemon.weight}</p>
      <p>Base Experience: ${pokemon.base_experience}</p>
      <p>Habitat: ${pokemon.habitat ? pokemon.habitat.name : "Unknown"}</p>
      <p>Color: ${pokemon.color ? pokemon.color.name : "Unknown"}</p>
      <p>Shape: ${pokemon.shape ? pokemon.shape.name : "Unknown"}</p>
      <p>Growth Rate: ${
        pokemon.growth_rate ? pokemon.growth_rate.name : "Unknown"
      }</p>
      <p>Egg Groups: ${
        pokemon.egg_groups
          ? pokemon.egg_groups.map((group) => group.name).join(", ")
          : "Unknown"
      }</p></div>
      <div>
        <div>
        <h3>Abilities</h3>
        <ul class="abilities-list">
          ${pokemon.abilities
            .map(
              (ability) =>
                `<li>${ability.ability.name} ${
                  ability.is_hidden ? "(Hidden)" : ""
                }</li>`
            )
            .join("")}
        </ul>
      </div>
      <div>
        <h3>Types</h3>
        <ul class="types-list">
          ${pokemon.types
            .map((type) => `<li class="">${type.type.name}</li>`)
            .join("")}
        </ul>
      </div>
      <div>
        <h3>Stats</h3>
        <ul class="stats-list">
          ${pokemon.stats
            .map(
              (stat) =>
                `<li>${stat.stat.name}: ${stat.base_stat} (Effort: ${stat.effort})</li>`
            )
            .join("")}
        </ul>
      </div>
      </div>

      <div>
      <div>
        ${
          pokemon.evolution_chain
            ? evolutionChainHTML(pokemon.evolution_chain.chain)
            : "<p>No evolution data available.</p>"
        } 

    </div>
    </div>
    

      </div>
  <button class="button" onclick="fetchData(${1},${itemsPerPage})">Back to List</button>

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

async function fetchData(page = 1, limit = 20) {
  loading = true;

  pagination.style.display = "block";

  pageInfo.textContent = `Page ${page}`;
  prevBtn.disabled = page === 1;
  nextBtn.disabled = page === Math.ceil(1203 / limit);

  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      fetchData(currentPage, itemsPerPage);
    }
  };

  nextBtn.onclick = () => {
    if (currentPage < Math.ceil(1203 / limit)) {
      currentPage++;
      fetchData(currentPage, itemsPerPage);
    }
  };
  renderPokemons();

  try {
    const response = await fetch(
      baseURLSpecies + `?offset=${(page - 1) * limit}&limit=${limit}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    data = await response.json();
    pokemons = data.results;

    loading = false;

    renderPokemons();
  } catch (error) {
    console.error("Fetch error:", error);
    loading = false;
  }
}

async function evoChain(pokemon) {
  loading = true;

  try {
    const response = await fetch(growthRateURL + pokemon.id);
    if (!response.ok) throw new Error("Network response was not ok");
    const evoChain = await response.json();
    loading = false;
    pokemon.evoChain = evoChain;
    console.log("evoChain", evoChain);
    return pokemon;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

async function fetchPokemon(url, name) {
  loading = true;

  pagination.style.display = "none";

  const id = url.split("/").filter(Boolean).pop();

  renderPokemon(pokemonData);

  try {
    const response2 = await fetch(baseURL + name);

    const data2 = await response2.json();

    const response = await fetch(baseURLSpecies + data2.id);

    const data = await response.json();

    const response3 = await fetch(data.evolution_chain.url);

    const data3 = await response3.json();

    pokemonData = { ...data, ...data2, evolution_chain: data3 };

    if (!response.ok) throw new Error("Network response was not ok");

    loading = false;
    renderPokemon(pokemonData);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

document.addEventListener(
  "DOMContentLoaded",
  fetchData(currentPage, itemsPerPage)
);
