import React from "react";
import { useState, useContext } from "react"
import {  Link } from "react-router-dom";
import "./GridBox.css"
import { GlobalContext } from "../";


export const GridBox = (props) => {
    const className = setClassName("g-box", props.className, props.size, props.wide, props.narrow)
    
    return(
        <div className={className}>
            {props.children}
        </div>
    )
}
 export const GridItem = (props) =>{
    const cover = props.cover ? "cover" : null
    const className = setClassName("g-item", props.className, cover)
    const title = props.title ? props.title : "";
    const id = props.id || 1
    return(
        <div className={className} title={title} key={id}>
            {props.image && <img src={props.image} onClick={props.onClick} title={title} alt={title} />}
            {props.text && <p>{props.text}</p>}
            {props.children && 
                <div className="children-box">
                    {props.children}
                </div>}
        </div>
    )
 }

export const SpeedyGridBox = ({movies, header=null,coverSize="l", posterSize="m"}) =>{
    const state = useContext(GlobalContext);
    const speed = state.speed;

    const moviesCover = movies.filter(m => m.hasCover);
    const moviesPoster = movies.filter(m => !m.hasCover);

    return(
        <div>
            {header && <h4 className="t-xl t-bold mar-b-2x">{header}</h4>}
            {speed === "fast" 
            ?   <>
                    <GridBox size={coverSize}>
                        {moviesCover.map((movie) => (
                            <Link rel="nofollow" to={`/movie/${movie.slug}`} key={movie.id}>
                                <GridItem cover
                                    title={movie.name + " " + movie.year}

                                    className="box-shadow bor-rad-2x shadow"
                                    image={movie.coverPoster}
                                    text={movie.name}
                                >
                                </GridItem>
                            </Link>
                        ))}
                    </GridBox>
                    <GridBox size={posterSize}>
                        {moviesPoster.map((movie) => (
                            <Link rel="nofollow" to={`/movie/${movie.slug}`} key={movie.id}>
                                <GridItem cover
                                    title={movie.name + " " + movie.year}

                                    className="box-shadow bor-rad-2x shadow"
                                    image={movie.poster}
                                    text={movie.name}
                                >
                                </GridItem>
                            </Link>
                        ))}
                    </GridBox>
                </>
                : <GridBox size={posterSize}>
                    {movies.map((movie) => (
                        <Link rel="nofollow" to={`/movie/${movie.slug}`} key={movie.id}>
                            <GridItem cover
                                title={movie.name + " " + movie.year}

                                className="box-shadow bor-rad-2x shadow"
                                image={movie.poster}
                                text={movie.name}
                            >
                            </GridItem>
                        </Link>
                    ))}
                </GridBox>
            
            }
        </div>
    )


}

const setClassName = (defaultClassName, ...classNames) => {
    const cls = [defaultClassName, ...classNames.filter(x => x!==null)].join(" ")
    return cls
}

/*
EXAMPLEs

    <GridBox size="m">
        {allCrews.slice(0, 6).map((crew, index) => (
            <Link to={"/person" + `/${crew.person.slug}`} key={crew.person.id + index} key={crew.person.id}
                rel="nofollow">
                <GridItem
                    title={crew.person.name}
                    
                    className={"box-shadow bor-rad-2x "}
                    
                >
                    <img  className="bor-rad-2x lazyload mw100"
                        src={crew.person.poster}
                        alt={`${crew.person.name} Poster`}
                    />
                    <p className="t-s t-color-dark">{crew.person.name}</p>
                    <p className="t-s t-italic t-color-dark">{crew.job === "A" ? "Acting" : "Director"}</p>
                </GridItem>
            </Link>

        ))}
    </GridBox>


<GridItem
    cover
    title={movie.name}
    key={movie.id} text={movie.name}
    className={className}
    image={movie.coverPoster}
    onClick={() => go(movie.id)}
>
    {children}
</GridItem>

OR

*/