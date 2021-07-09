import React, { useState, useEffect, useRef } from "react";
import { useGraphQL } from "./grec"


export const useBeforeUnload = (enabled = true, message, action) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handler = (event) => {
      event.preventDefault();

      if (message) {
        event.returnValue = message;
      }
      if (action) action()

      return message;
    };

    window.addEventListener('beforeunload', handler);

    return () => window.removeEventListener('beforeunload', handler);
  }, [message, enabled]);
};



export const useFocus = (ref, defaultState = false) => {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    const onFocus = () => setState(true);
    const onBlur = () => setState(false);
    ref.current.addEventListener("focus", onFocus);
    ref.current.addEventListener("blur", onBlur);

    return () => {
      ref.current.removeEventListener("focus", onFocus);
      ref.current.removeEventListener("blur", onBlur);
    };
  }, []);

  return state;
};



//useOnClickOutside(ref, () => setOpen(false))
export function useOnClickOutside(ref, handler) {
  useEffect(
    () => {
      const listener = event => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }

        handler(event);
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );
}
// Hook
export function useKeyPress(targetKey) {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState(false);
  
    // If pressed key is our target key then set to true
    function downHandler({ key }) {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    }
  
    // If released key is our target key then set to false
    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };
  
    // Add event listeners
    useEffect(() => {
      window.addEventListener('keydown', downHandler);
      window.addEventListener('keyup', upHandler);
      // Remove event listeners on cleanup
      return () => {
        window.removeEventListener('keydown', downHandler);
        window.removeEventListener('keyup', upHandler);
      };
    }, []); // Empty array ensures that effect is only run on mount and unmount
  
    return keyPressed;
  }


// Hook
export function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}


export const useScrollPosition = () => {
    const [scrollPosition, setScrollPosition] = useState(0)
  
    useEffect(() => {
      let last_known_scroll_position = 0
      let ticking = false
      const handleScroll = e => {
        last_known_scroll_position = window.scrollY
  
        if (!ticking) {
          window.requestAnimationFrame(function () {
            setScrollPosition(last_known_scroll_position)
            ticking = false
          })
  
          ticking = true
        }
      }
      window.addEventListener('scroll', handleScroll)
  
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    })
  
    return scrollPosition
  }
  

//const [hoverRef, isHovered] = useHover();
export function useHover() {
    const [value, setValue] = useState(false);
    const debouncedValue = useDebounce(value, 100)
    const ref = useRef(null);

    const handleMouseOver = () => setValue(true);
    const handleMouseOut = () => setValue(false);

    useEffect(
        () => {
            const node = ref.current;
            if (node) {
                node.addEventListener('mouseover', handleMouseOver);
                node.addEventListener('mouseout', handleMouseOut);

                return () => {
                    node.removeEventListener('mouseover', handleMouseOver);
                    node.removeEventListener('mouseout', handleMouseOut);
                };
            }
        },
         // Recall only if ref changes
    );

    return [ref, debouncedValue];
}

export function useAuthCheck() {
    function authCheck(){
        if (localStorage.getItem("USERNAME") !== null && localStorage.getItem("AUTH_TOKEN") !== null){
            return true
        }
        return false
    }
    const [status, setStatus] = useState(authCheck())//      

    const authListener = () => {
        const currentStatus = authCheck();
        // console.log("current status", status)
        if (status !== currentStatus) {
            // console.log("auth status changed", status)
            setStatus(authCheck())
            // console.log("new status", status)
        }
    }
    useEffect(() => {
        //console.log("ue")
        authListener()
    })
    return status
}

export function useLocation(){
    const [ location, setLocation ] = useState(window.location.pathname)
    function locListener(){
        const isSamePage = location==window.location.pathname
        //console.log("isSamePage", isSamePage)

        if(!isSamePage){
            setLocation(window.location.pathname)
        }
    }
    useEffect(() =>{
        locListener()
        window.addEventListener("location", locListener);
        // for removing repeatedly rendering
        return () =>{
            window.removeEventListener("location", locListener);
        }
    },[window.location.pathname])
    //console.log("hook", location)

    return location
}

export function useGql(query, variables){
    const { data,loading, error } = useGraphQL(query, variables)
    const response = { data, loading, error }

    return response
}

function ResponsiveSize(width,xs=370, s=480, m=736, l=980, xl=1280 ){
    if (width<xs) return "XS";
    else if (width<s && width>=xs) return "S";
    else if (width<m && width>=s) return "M";
    else if (width<l && width>=m) return "L";
    else if (width<xl && width>=l) return "XL";
    else if(width<1581 && width>=xl) return "XXL";
    else if (width >=2500) return "XXXL"
    else return "XXXL"
}

export function useWindowWidth() {
  const [screenSize, setScreenSize] = useState(window.innerWidth)//      S | M | L
  
  const screenListener = () => {
      const currentSize = window.innerWidth;
      //if size (not width) is changed, then change state
      if (screenSize != currentSize) {
          setScreenSize(currentSize);
      }
  }

  useEffect(() => {
      // Once screenSize changed this will be fired
      window.addEventListener("resize", screenListener);
      // for removing repeatedly rendering
      return () => {
          window.removeEventListener("resize", screenListener);
      }
  })


  return screenSize
}

export function useWindowSize() {
    const [screenSize, setScreenSize] = useState(ResponsiveSize(window.innerWidth))//      S | M | L
    
    const screenListener = () => {
        const currentSize = ResponsiveSize(window.innerWidth);
        //if size (not width) is changed, then change state
        if (screenSize != currentSize) {
            setScreenSize(currentSize);
        }
    }

    useEffect(() => {
        // Once screenSize changed this will be fired
        window.addEventListener("resize", screenListener);
        // for removing repeatedly rendering
        return () => {
            window.removeEventListener("resize", screenListener);
        }
    })


    return screenSize
}
//Get Responsive values
export function useValues(values){
    const screen = useWindowSize()
    const variations = values.length
    function pair(screen){
        switch(screen){
            case "XS":
                return values[0]
            case "S":
                return values[1] || values[variations -1]
            case "M":
                return values[2] || values[variations -1]
            case "L":
                return values[3] || values[variations -1]
            case "XL":
                return values[4] || values[variations -1]
            case "XXL":
                return values[5] || values[variations -1]
            case "XXXL":
                return values[6] || values[variations -1]
        }
    }
    const result = pair(screen)
    //console.log(values, screen, variations, result)
    return result
}



export function useWindowLocation(){
    const pathname = window.location.pathname;
    const [ location, setLocation] = useState(pathname)//      
    
    const locationListener = () =>{
        const currentLocation = window.location.pathname;
        //console.log("current", currentLocation)
        //console.log("previous", location)
        if(location!=currentLocation){
            //console.log("window location changes",location)
            setLocation(currentLocation)
        }
    }

    useEffect(() =>{
        locationListener()

    }, [window.location.pathname])

    return location
}

export function useClientWidth(nodeId){
    const [ width, setWidth] = useState(null)//      
    
    const widthListener = () =>{
        const currentWidth = document.getElementById(nodeId)[0].clientWidth
        if(width!=currentWidth){
            setWidth(currentWidth)
        }
    }
    

    useEffect(() =>{
        widthListener()
    })

    return width
}

export function useClientHeight(clsname){
  const [ height, setHeight] = useState(null)//      
  
  const heightListener = () =>{
      const currentWidth = document.getElementsByClassName(clsname)[0].clientHeight
      if(height!=currentWidth){
          setHeight(currentWidth)
      }
  }
  

  useEffect(() =>{
      heightListener()
  })

  return height
}

//const [loaded, error] = useScript('https://pm28k14qlj.codesandbox.io/test-external-script.js');
let cachedScripts = [];
export function useScript(src, defer=null) {
  // Keeping track of script loaded and error state
  const [state, setState] = useState({
    loaded: false,
    error: false
  });

  useEffect(
    () => {
      // If cachedScripts array already includes src that means another instance ...
      // ... of this hook already loaded this script, so no need to load again.
      if (cachedScripts.includes(src)) {
        setState({
          loaded: true,
          error: false
        });
      } else {
        cachedScripts.push(src);

        // Create script
        let script = document.createElement('script');
        script.src = src;
        script.async = true;
        if (defer){
          script.defer = true
        }
        

        // Script event listener callbacks for load and error
        const onScriptLoad = () => {
          setState({
            loaded: true,
            error: false
          });
        };

        const onScriptError = () => {
          // Remove from cachedScripts we can try loading again
          const index = cachedScripts.indexOf(src);
          if (index >= 0) cachedScripts.splice(index, 1);
          script.remove();

          setState({
            loaded: true,
            error: true
          });
        };

        script.addEventListener('load', onScriptLoad);
        script.addEventListener('error', onScriptError);

        // Add script to document body
        document.body.appendChild(script);

        // Remove event listeners on cleanup
        return () => {
          script.removeEventListener('load', onScriptLoad);
          script.removeEventListener('error', onScriptError);
        };
      }
    },
    [src] // Only re-run effect if script src changes
  );

  return [state.loaded, state.error];
}



/*


export function usePersistLists(){
    const localLists = JSON.parse(window.localStorage.getItem("lists")) || [];
    const [ lists, updateLists] = useState(localLists)

    function movieCounter(movieLists){
        var totalMovies = 0;
        movieLists.forEach(liste => totalMovies + liste.numMovies);
        return totalMovies
    }

    const updateState = () =>{
        //console.log("update state fired")
        const currentLists = JSON.parse(window.localStorage.getItem("lists")) || [];
        const currentNumMovies = currentLists.length>0 ?  movieCounter(currentLists) : 0;
        const oldNumMovies = movieCounter(lists);

        if(currentLists.length!=lists.length || currentNumMovies!=oldNumMovies){
            updateLists(currentLists);
        }
    }

    useEffect(() =>{

        window.addEventListener("storage", updateState);
        //console.log("hooks ue add")
        return ()=>{
            window.removeEventListener("storage", updateState);
            //console.log("hooks ue remove")
        }
    })


    //console.log("persist lists", lists)
    return lists
}

export function useLocalStorage(){
    const [ lists, updateLists ] = useState([])

    function jsonize(input){
        if((typeof input)==="string"){
            return JSON.parse(input)
        }
        else if((typeof input)===Object){
            return JSON.stringify(input)
        }
    }

    function storeListener(){
        const myLists = jsonize(localStorage.getItem("LISTS"))
        const stateNums = movieCounter(lists)
        const storedNums = movieCounter(myLists)
        if(myLists.length!==lists.length || stateNums!==storedNums){
            updateLists(myLists)
        }
        else{
        }
    }

    function movieCounter(movieList){
        var sum = 0;
        movieList.forEach(movie => sum +=movie.numMovies)
        return sum
    }
    const storedLists = jsonize(localStorage.getItem("LISTS"))
    useEffect(() =>{
        storeListener()
        return () =>{
        }
    }, [storedLists])

    return lists
}


export function useTimer(start, limit=null ){
    const [active, setActive] = useState(false)

    const [startTime, setStartTime ] = useState(null)
    const [ passedTime, setpassedTime ] = useState(0)

    const update = () => {
        if (active){
            setpassedTime(now().toFixed(0) - startTime)
        }
    }

    useEffect(() =>{
        //when start props was changed to true from parent
        if (start==true && startTime==null && active==false){
            setStartTime(now().toFixed(0));
            setActive(true);
        }
        // when start props changed to false from parent
        else if(start==false && startTime!=null && active==true){
            setActive(false)
            return () => console.log("finished by parent")
        }
        // when limit time is up and terminated by limit
        else if(limit && passedTime>=limit && active==true){
            setActive(false);
            return () => console.log("finished by limit")
        }
        else if (start==true && startTime!=null && active==true){
            update()
        }
    })
    return passedTime
}
*/