import React, { useState } from 'react'
import { AUTOCOMPLETE_MOVIE } from "../../functions/query";
import {  Query } from 'react-apollo'
import { withRouter } from "react-router-dom";

import { useFocus, useHover } from 'use-events';
import "./Search.css"

const SearchBar = (props) =>{
    const { clickHandler,bring, searchIt  } = props;
    const [isFocused, bind] = useFocus();
    const [isHovered, bindHover] = useHover();

    //const [isActive] = useClickOutside(ref, () =>setShowResults(false));
    //const [isOpen, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    //const [ showResults, setShowResults ] = useState(true);
    const searchItHandler = (e) => {
        e.preventDefault();
        props.history.push(`/${localStorage.getItem("USERNAME")}/search/${search}/1`);
    }

    const click = (movie) => {
        clickHandler(movie);
        setSearch("");
    }
    return(
        <form autoComplete="off" onSubmit={searchIt ? (e) => (searchItHandler(e), setSearch("")) : null} >
            <div className="autocomplete" style={{width:"90%", marginRight:15}} >
                <input {...bind}
                    id="search-input" type="text" name="search" placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} 
                    />
                <Query query={AUTOCOMPLETE_MOVIE} variables={{search, first:bring ? bring : 6, skip:0}} skip={search.length<4} >
                    {({data, loading})=>{
                        if(loading) return <div></div>
                        if (data){
                            const items = data.searchMovie
                            return(
                                <div className="autocomplete-items" {...bindHover}>
                                    {((search.length>2 && (isFocused || isHovered)) && (items && items.length>0))&& items.map(movie =>(
                                        <div key={movie.id} 
                                            onClick={() => (click(movie), console.log("clicked"))}
                                            style={{display:"flex" ,flexDirection:"row", justifyContent:"flex-start", alignItems:"center"}}
                                            >
                                            <img src={movie.poster} style={{height:45, width:30}} />
                                            <p style={{marginLeft:10, fontSize:14}} >{movie.name}</p>
                                        </div>
                                    ))}
                                </div>
                        )}
                        else return <div></div>
                    }}
                </Query>
            </div>
        </form>
    )
}

export default withRouter(SearchBar);