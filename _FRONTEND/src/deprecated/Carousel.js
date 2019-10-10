import React, { useState, useEffect, useRef, useCallback, createContext } from 'react'
import EmblaCarouselReact from "embla-carousel-react";


import "./Carousel.css"; // Add the import

export const Carousel = ({children}) => {
    const [carousel, initCarousel] = useState(null); // The carousel API
    const [selectedIndex, setSelectedIndex] = useState(0);
    // Add scrollSnaps state containing all snap points
    const [scrollSnaps, setScrollSnaps] = useState([]);
    const scrollTo = useCallback(index => carousel.scrollTo(index), [carousel]);
      // Add prev button enabled state
    const [prevBtnEnabled, togglePrevBtnEnabled] = useState(false);
    // Add next button enabled state 
    const [nextBtnEnabled, toggleNextBtnEnabled] = useState(false); 
    
    // Add scrollPrev
    const scrollPrev = useCallback(() => carousel.scrollPrev(), [carousel]);
    // Add scrollNext
    const scrollNext = useCallback(() => carousel.scrollNext(), [carousel]);

    useEffect(() => {
    // On every new snap point select, update selectedIndex
    const onSelect = () => {
        setSelectedIndex(carousel.selectedScrollSnap());
        // Toggle buttons enabled/disabled
        togglePrevBtnEnabled(carousel.canScrollPrev());
        toggleNextBtnEnabled(carousel.canScrollNext());
    };

    // When our carousel has mounted:
    if (carousel) {
      // Store snap points provided by the carousel
      setScrollSnaps(carousel.scrollSnapList());
      // Hook our onSelect function to the carousel select event
      carousel.on("select", onSelect);
      // Invoke onSelect
      onSelect();
    }
    // Destroy the carousel component on unmount
    return () => carousel && carousel.destroy();
  }, [carousel]);

    return(
        <div className="carousel">
            <div className="carousel__wrap">
                {/* Grab the carousel API in the emblaRef 
                    function prop and assign it to our carousel state  */}
                <EmblaCarouselReact
                className="carousel__viewport"
                emblaRef={initCarousel}
                options={{ loop: true /* Carousel Options */ }}
                htmlTagName="div"
                >
                <div className="carousel__container">
                    {children.map((Child, index) => (
                        <div className="carousel__item" key={index}>
                            {Child}
                        </div>
                    ))}
                </div>
                </EmblaCarouselReact>
                <PrevBtn onClick={scrollPrev} enabled={prevBtnEnabled} />
                <NextBtn onClick={scrollNext} enabled={nextBtnEnabled} />
            </div>
        
            <div className="carousel__dots">
                {scrollSnaps.map((snap, index) => (
                    <DotBtn
                        selected={index === selectedIndex}
                        onClick={() => scrollTo(index)}
                        key={index}
                    />
                ))}
            </div>
        </div>
    )
}





const DotBtn = ({ selected, onClick }) => (
  <button
    className={`carousel__dot${selected ? " is-selected" : ""}`}
    onClick={onClick}
  />
);


const PrevBtn = ({ enabled, onClick }) => (
  <button
    className="carousel__arrowBtn carousel__arrowBtn--prev"
    disabled={!enabled}
    onClick={onClick}
  >
    <svg className="carousel__arrowBtn__svg" viewBox="138 -1.001 366.5 644">
      <path d="M428.36 12.5c16.67-16.67 43.76-16.67 60.42 0 16.67 16.67 16.67 
        43.76 0 60.42L241.7 320c148.25 148.24 230.61 230.6 247.08 247.08 16.67 16.66 
        16.67 43.75 0 60.42-16.67 16.66-43.76 16.67-60.42 0-27.72-27.71-249.45-249.37-277.16-277.08a42.308
        42.308 0 0 1-12.48-30.34c0-11.1 4.1-22.05 12.48-30.42C206.63 234.23 400.64 40.21 428.36 12.5z" />
    </svg>
  </button>
);

const NextBtn = ({ enabled, onClick }) => (
  <button
    className="carousel__arrowBtn carousel__arrowBtn--next"
    disabled={!enabled}
    onClick={onClick}
  >
    <svg className="carousel__arrowBtn__svg" viewBox="0 0 238.003 238.003">
      <path d="M181.776 107.719L78.705 4.648c-6.198-6.198-16.273-6.198-22.47 
        0s-6.198 16.273 0 22.47l91.883 91.883-91.883 91.883c-6.198 6.198-6.198 16.273 
        0 22.47s16.273 6.198 22.47 0l103.071-103.039a15.741 15.741 0 0 
        0 4.64-11.283c0-4.13-1.526-8.199-4.64-11.313z" />
    </svg>
  </button>
);