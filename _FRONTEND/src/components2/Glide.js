import React, { useState, useEffect, useRef, useCallback, createContext, useMemo } from 'react'
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";

import "./Glide.css"
 // Add the import
import Glide from '@glidejs/glide'
import { useWindowSize,useClientWidth } from "../functions/hooks"
//import  { Breakpoints } from '@glidejs/glide/dist/glide.modular.esm'
import { MovieCoverBox, DirectorCard, Grid, Loading } from "../styled-components"


export const GlideBox = (props) => {
    //return <div></div>
    const childrenQuantity = props.children.length;
    const screenSize = useWindowSize().toLowerCase()
    const sizeProp = props[screenSize]

    const shouldCheckFlexCase = Array.isArray(sizeProp)


    const shouldBeFlexBox = (shouldCheckFlexCase && (childrenQuantity <= sizeProp[0])) ? true : false

    //const hasLessElements = props.flex
    //const willCarouselShow = props[carouselsize.toString()]
    //console.log("shouldBeFlexBox",shouldBeFlexBox)

    
    if (shouldBeFlexBox)  return <FlexBox quantity={childrenQuantity} {...props}>{props.children}</FlexBox>
    else return <GlideCarousel {...props}>{props.children}</GlideCarousel>

}


export const GlideCarousel = (props) => {
    const ref = useRef(null)

    const options = {
        type: 'carousel',
        startAt: 2,
        gap:8,
        autoplay:5000,
        focusAt:"center",
        animationTimingFunc:"ease-in-out",
        breakpoints :{
            370: {perView: props.xs   ?  props.xs   : 2 },
            480: {perView: props.s   ?  props.s   : 2 },
            736: {perView: props.m   ?  props.m   : 2   },
            980: {perView: props.l   ?  props.l   : 3   },
            1280:{perView: props.xl  ?  props.xl  : 4   },
            2000:{perView: props.xxl ?  props.xxl : 5   },
            5000:{perView: props.xxxl ?  props.xxxl : 7   },
        }
    }


    const styles = {
        slides:{
            display:"flex",
            justifyContent:"center",
            alignItems: "center",
            padding:"10px 5% 40px 5%",
            width:"100%"
        }
    }
    useEffect(()=>{
        if (ref.current){
            var glide = new Glide(ref.current, options).mount()
            return () => glide.destroy()
        }
    })
    return(
        <div className="glide pos-r" ref={ref}>
            <div data-glide-el="track" className="glide__track">
                <ul className="glide__slides" style={styles.slides}>
                    {props.children.map( (child, i) =>(
                        <li className="glide__slide" key={i}>{child}</li>

                    ))}
                </ul>
                <div className="glide__arrows" data-glide-el="controls">
                    <button className="glide__arrow glide__arrow--left" data-glide-dir="<">prev</button>
                    <button className="glide__arrow glide__arrow--right" data-glide-dir=">">next</button>
                </div>
                <div className="glide__bullets" data-glide-el="controls[nav]">
                    {props.children.map( (child, i) =>(
                        <button className="glide__bullet" data-glide-dir={`=${i}`} key={"button" + i}></button>

                    ))}
                </div>
            </div>
        </div>
    )
}

const FlexBox = (props) => {
    const childWidth = `${94 / props.quantity}%`
    const childMargin = `${10 / (props.quantity * 2)}%`
    const styles={
        child:{
            width: childWidth,
            maxWidth:props.maxWidth ? props.maxWidth : childWidth,
            height:"100%",
            margin:childMargin
        }
    }
    return (
        <Grid columns={[5]} m={[2]}>
            {props.children}
        </Grid>
    )
}


const FlexBox2 = (props) => {
    const childWidth = `${94 / props.quantity}%`
    const childMargin = `${10 / (props.quantity * 2)}%`
    const styles={
        child:{
            width: childWidth,
            maxWidth:props.maxWidth ? props.maxWidth : childWidth,
            height:"100%",
            margin:childMargin
        }
    }
    return (
        <div className="fbox-r jcfs  w100">
            {props.children.map((child, i )=> <div style={styles.child} key={"flexbox-child" + i}>{child }</div>)}
        </div>
    )
}
function areEqual(prevProps, nextProps) {
    const oldIds = prevProps.children.map(child => child.id)
    const newIds = nextProps.children.map(child => child.id)
    if (oldIds.length === newIds.length) return true
    return false
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
}

function carouselSize(){
    const w = window.innerWidth;
    console.log("w", w)
    if (w <= 480) return "s"
    else if (w <= 980) return "m"
    else if (w <= 1500) return "l"
    else if (w <= 2500) return "xl"
    else if (w <= 5000) return "xxl"
    return false
}



/*

export const GlideBox = (props) => {
    const ref = useRef(null)
    const [disabled, setDisabled] = useState(false);
    const [isCarousel, setIsCarousel] = useState(true);
    const childrenQuantity = props.children.length;
    


    const Floor = (num) => Math.ceil(num) 
    if (props.check){
        function caseSetter(){
            const w = window.innerWidth;
            console.log(childrenQuantity, w, Floor(props.l))
            if(      w <= 480   &&  props.s    &&  childrenQuantity <= Floor(props.s)   && !disabled ) setDisabled(true)
            else if( w <= 980   &&  props.m    &&  childrenQuantity <= Floor(props.m)   && !disabled ) setDisabled(true)
            else if( w <= 1500  &&  props.l    &&  childrenQuantity <= Floor(props.l)   && !disabled ) setDisabled(true)
            else if( w <= 2500  &&  props.xl   &&  childrenQuantity <= Floor(props.xl)  && !disabled ) setDisabled(true)
            else if( w <= 5000  &&  props.xxl  &&  childrenQuantity <= Floor(props.xxl) && !disabled ) setDisabled(true)
        }
        caseSetter()
    }

    const options = {
        type: 'carousel',
        startAt: disabled ? 1 : 3,
        gap:8,
        autoplay:5000,
        animationTimingFunc:"ease-in-out",
        breakpoints :{
            480: {
                perView: props.s ? props.s : 1.2,
                autoplay: (props.s && props.s >= props.children.length)
                    ? false
                    : 5000 
                },
            980: {
                perView: props.m ? props.m : 1.5,
                autoplay: (props.m && props.m >= props.children.length)
                    ? false
                    : 5000 
                },
            1500:{
                perView: props.l ? props.l : 3,
                autoplay: (props.l && props.l >= props.children.length)
                    ? false
                    : 5000 
                },
            2500:{
                perView: props.xl ? props.xl : 5,
                autoplay: (props.xl && props.xl >= props.children.length)
                    ? false
                    : 5000 
                },
            5000:{
                perView: props.xxl ? props.xxl : 9,
                autoplay: (props.xxl && props.xxl >= props.children.length)
                    ? false
                    : 5000 
                }
        }
    }
    //const bb = Breakpoints
    //console.log("bb", bb)


    const styles = {
        slides:{
            display:"flex",
            justifyContent:"center",
            alignItems: "center",
            padding:"10px 5% 40px 5%",
            width:"100%"
        },

    }


    useEffect(()=>{
        if (ref.current){
            var glide = new Glide(ref.current, options).mount()
            if (disabled) glide.disable()
            return () => glide.destroy()
        }
    })
    const Slide = ({child, i}) => {
        console.log(i ,childrenQuantity)
        if (disabled && i >= childrenQuantity) return <li className="glide__slide will-hide"key={i} >{child}</li>
        return <li className="glide__slide" key={i} >{child}</li>
    }

    return(
        <div className="glide pos-r" ref={ref}>
            <button onClick={() => setDisabled}>asd</button>
            <div data-glide-el="track" className="glide__track">
                <ul className="glide__slides" style={styles.slides}>
                    {props.children.map( (child, i) =>(
                        <Slide child={child} i={i} />
                    ))}
                </ul>

                {!disabled && 
                    <div className="glide__arrows" data-glide-el="controls">
                        <button className="glide__arrow glide__arrow--left" data-glide-dir="<">prev</button>
                        <button className="glide__arrow glide__arrow--right" data-glide-dir=">">next</button>
                    </div>}
                {!disabled && <div className="glide__bullets" data-glide-el="controls[nav]">
                    {props.children.map( (child, i) =>(
                        <button className="glide__bullet" data-glide-dir={`=${i}`} key={"button" + i}></button>

                    ))}
                </div>}
            </div>
        </div>
    )

}
*/