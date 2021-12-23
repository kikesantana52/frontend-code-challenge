import React, { useEffect, useState } from "react";
import "./App.css";

const URL_PATH =
  "https://raw.githubusercontent.com/joseluisq/pokemons/master/pokemons.json";

const Pokemon = ({ data }) => {
  return (
    <li>
      <img src={data.sprites.normal} alt="" />
      <div className="info">
        <h1>{data.name}</h1>
        {data.type.map((type, idx) => {
          return (
            <span key={idx} className={"type " + type.toLowerCase()}>
              {type}
            </span>
          );
        })}
      </div>
    </li>
  );
};

const App = () => {
  const fetchData = async () => {
    setLoading(true);
    const data = await (await fetch(URL_PATH)).json();
    setLoading(false);
    setPokemons(data.results);
  };

  const searchPokemon = async (e) => {
    const searchText = e.target.value;
    if (searchText === "") {
      setFilteredPokemons([]);
      return;
    }
    const filter = "(.*)" + searchText.toUpperCase() + "(.*)";
    const regexp = new RegExp(filter, "g");
    const pokemonsToShowByName = pokemons.filter((currentPokemon) =>
      regexp.test(currentPokemon.name.toUpperCase())
    );
    const pokemonsToShowByType = pokemons.filter((currentPokemon) => {
      let hasAvailableType = false;
      currentPokemon.type.forEach((type) => {
        regexp.test(type.toUpperCase()) && (hasAvailableType = true);
      });
      return hasAvailableType;
    });

    const result = [
      ...new Set([...pokemonsToShowByName, ...pokemonsToShowByType]),
    ].slice(0, 4);
    setFilteredPokemons(result);
  };

  useEffect(() => {
    fetchData();
  }, []);
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [isLoading, setLoading] = useState(false);
  return (
    <>
      <label htmlFor="maxCP" className="max-cp">
        <input type="checkbox" id="maxCP" />
        <small>Maximum Combat Points</small>
      </label>
      <input
        type="text"
        className="input"
        placeholder="Pokemon or type"
        onChange={searchPokemon}
      />
      {isLoading && <div className="loader"></div>}
      <ul className="suggestions">
        {filteredPokemons.length > 0 ? (
          filteredPokemons.map((pokemon, idx) => (
            <Pokemon key={idx} data={pokemon} />
          ))
        ) : (
          <li>
            <span>No Results</span>
          </li>
        )}
      </ul>
    </>
  );
};

export default App;
