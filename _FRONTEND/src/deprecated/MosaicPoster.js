import React from 'react'
import { useState, useEffect } from "react"
import  {  useClientWidth } from "../functions/hooks"
import {  Link } from "react-router-dom";
import  { print } from "../functions/lib"


const MosaicPoster = ({item,parentClientWidth, id}) =>{
    const images = item.image
    const uniqueElementId = id + item.id.toString()
    //const cw = useClientWidth(uniqueElementId)
    const cw = parentClientWidth ? (parentClientWidth - 8) : null

    const [clientWidth, setClientWidth] = useState(cw)
    const onePosterWidth = calculatePosterWidth(clientWidth, 4);
    const clientHeight = onePosterWidth * 1.5

    useEffect(()=>{
        if (cw !== clientWidth){
            setClientWidth(cw)
            //console.log("cw setted")
        }
    })

    return(
        <div className="mosaic-poster-box" 
            style={{
                    minheight:250,height:clientHeight, minWidth:225,
                    width:clientWidth, overflow:"hidden", position:"relative", borderRadius:8,
                    border:"2px solid rgba(0,0,0, 0.2)",
                    boxSizing:"border-box"
                }} 
            id={uniqueElementId}
            >
            <Link to={`/list/${item.slug}/1`} rel="nofollow">
        {images.map((poster, index) => {
                return(
                    <img src={poster} 
                    key={index}
                    className="mosaic-poster bor-rad-2x"
                    style={{position:"absolute", top:0, left: (index*onePosterWidth/2 ) ,
                        height:clientHeight , width:onePosterWidth,  zIndex:20-index*2, borderColor:"transparent"}}
                    alt=""
                    />
            )})
        }
            </Link>
        </div>    
    )
}

function calculatePosterWidth(parentWidth, imageNum){
    const PosterWidth = parentWidth / (0.5 + 0.5*imageNum) 
    return PosterWidth
}

export default MosaicPoster;