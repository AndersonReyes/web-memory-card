import { useEffect, useState } from 'react';
import './App.css'

import { _ } from 'lodash';

import * as Pokedex from 'pokeapi-js-wrapper';

type Pokemon = {
  id: number, name: string, img: string, onClick?: () => void
}

const P = new Pokedex.Pokedex();


function Card(props: Pokemon) {
  return (
    <>
      <img className='Card' onClick={props.onClick} src={props.img} />
    </>
  );

}

function App() {
  const [pokemonCards, setPorkemonCards] = useState(Array<Pokemon>());
  const [score, setScore] = useState({score: 0, highScore: 0});
  const [clickedCards, setClickedCards] = useState(new Set());

  useEffect(() => {
    const fetchPokemonNames  =  P.getPokemonsList({limit: 25, offset: 0}).then(({results}) => results.map((p: {name: string}) => p.name));
    const pokemons: () => Promise<Pokemon[]> = async () => {
      const names: string[] = await fetchPokemonNames;
      const details = await Promise.all(names.map(name => P.getPokemonByName(name)));

      return details.map(p => {
        return {id: p.id, name: p.name, img: p.sprites.front_default}
      });
    };

    pokemons().then(poks => setPorkemonCards(_.shuffle(poks)));

  }, []);


  const cardOnClick = (pokemonName: string) => {
    console.log(score, clickedCards);

    if (clickedCards.has(pokemonName)) {
      // card already been clicked, reset score for new game
      setScore({score: 0, highScore: score.highScore}); 
      setClickedCards(new Set());
    } else {

     setScore({score: score.score + 1, highScore: Math.max(score.score + 1, score.highScore)}); 
      setClickedCards(clickedCards.add(pokemonName));
    }

    setPorkemonCards(_.shuffle(pokemonCards)); 
  };

  return (
    <>
      <h1>Memory Card Game</h1>
      <span>click on the pokemon images you have not clicked before</span>
      <div id="stats">
        <div key="score">Score: {score.score}</div>
        <div key="high-score">High Score: {score.highScore}</div>
      </div>
      <div id="board">
        {pokemonCards.map(c => <Card onClick={() => cardOnClick(c.name)} key={c.id} id={c.id} name={c.name} img={c.img} />)}
      </div>
    </>
  )
}

export default App
