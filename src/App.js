import React,  {useState, useEffect} from 'react';
import PokemonList from './PokemonList'
import axios from 'axios'
import Pagination from './Pagination';

function App() {
  const [pokemon, setPokemon] = useState([])
  const [currentPageUrl, setCurrentPageUrl] = useState("https://pokeapi.co/api/v2/pokemon")
  const [nextPageUrl, setNextPageUrl] = useState()
  const [prevPageUrl, setPrevPageUrl] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    setLoading(true)
    const controller = new AbortController();
    axios.get(currentPageUrl, {
      signal:controller.signal

    }).then(res =>{
         setLoading(false)
      setNextPageUrl(res.data.next)
      setPrevPageUrl(res.data.previous)
      setPokemon(res.data.results.map(p =>p.name))
    })
    .catch((error)=>{
      if(error.name === "CanceledError"){
        console.log("Request cancelled:", error.message);
      }
      else{
        console.error(error);
      }
    });

    return () => controller.abort();
  }, [currentPageUrl])

  function gotoNextPage(){
    setCurrentPageUrl(nextPageUrl)
  }
  function gotoPrevPage(){
    setCurrentPageUrl(prevPageUrl)
  }

  if (loading) return "Loading ..." 
  return (
    <>
        <PokemonList pokemon={pokemon}/>
        <Pagination 
          gotoNextPage = {nextPageUrl ? gotoNextPage : null}
          gotoPrevPage = {prevPageUrl ? gotoPrevPage : null}
          />
    </>
  );
}

export default App;
