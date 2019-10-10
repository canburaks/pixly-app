import React, { useState, useEffect, useRef, useCallback, createContext } from 'react'
import "./LazyImage.css";
import LazyLoad from "vanilla-lazyload";


// Export the context provider
const Context = createContext();
const options = { elements_selector: ".lazyImage__img" };


export const LazyImageProvider = ({ children }) => {
    // Create the state that will hold the LazyLoad API
    const [lazyLoad, setLazyLoad] = useState(null);

    // Prepare for doing stuff on mount and unmount
    useEffect(() => {
        // Initialise LazyLoad only if it doesn't exist yet
        if (!lazyLoad) setLazyLoad(new LazyLoad(options));
        // Clean up on unmount
        return () => lazyLoad && lazyLoad.destroy();
    }, [lazyLoad]);
    // Expose our LazyLoad API to its children components
    return <Context.Provider value={lazyLoad}>{children}</Context.Provider>;
}

export const LazyImageRaw = ({ src, aspectRatio, lazyLoad }) => { 
  // Calculate the aspect ratio
  const paddingTop = `${(aspectRatio[1] / aspectRatio[0]) * 100}%`;

  // Update lazyLoad on mount and when src and/or aspectRatio changes
  useEffect(() => {
    if (lazyLoad) lazyLoad.update();
  }, [src, aspectRatio, lazyLoad]);

  // Set the placeholder size on our wrapper div
  return (
    <div className="lazyImage" style={{ paddingTop }}>
      <img className="lazyImage__img"data-src={src}  />
    </div>
  );
};




export const withLazyImageContext = Component => props => (
  <Context.Consumer>
    {context => <Component {...props} lazyLoad={context} />}
  </Context.Consumer>
);

export const LazyImage =  withLazyImageContext(LazyImageRaw);


