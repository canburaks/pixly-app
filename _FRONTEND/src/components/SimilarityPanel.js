import React from "react";
import { Progress } from "semantic-ui-react"
import  { p2p, preprocess } from "../functions/persona"
import { ProgressBar,Popup } from "cbs-react-components";
import { MessageBox } from "./MessageBox"

const SimilarityPanel = ({profile1, profile2, cls }) => {
    const ratingset1 = profile1.ratingset
    const quantity1 = Object.keys( preprocess(ratingset1))

    const ratingset2 = profile2.ratingset
    const quantity2 = Object.keys( preprocess(ratingset2))
    const info = p2p(ratingset1, ratingset2)

    const message = ()=>{
        if(quantity1.length<40 || quantity2.length<40) return `You or ${profile1.username} should at least rate 40 movies`
        else if(info.quantity<10) return `Similarity calculation at least need 10 common movies. You and ${profile1.username} both watched ${info.quantity} movies`
        else return `You and ${profile1.username} has ${similarityPercent()} percent similar cinema taste. You both watched ${info.quantity} same movies.`
    }
    const similarityPercent =()=>{
        if(quantity1.length<40 || quantity2.length<40 || info.quantity<10) return 0
        else return Math.round((0.5 + info.similarity/2)*100)
    }
    const color = () =>{
        const similarity = similarityPercent();
        if (similarity===0) return "var(--silver)"
        if (similarity<40)return "var(--semantic-warning)"
        else if (similarity>=40 && similarity<60) return { success: false, warning: true, error:false }
        else if (similarity >= 60) return { success: true, warning: false, error: false }
    }

    const status = () => {
        const similarity = similarityPercent();
        if (similarity < 40) return " error"
        else if (similarity >= 40 && similarity < 60) return " warning" 
        else if (similarity >= 60) return " success"
    }
    //console.log(" color",color())
    if (quantity1.length < 40 || quantity2.length < 40 || info.quantity < 10){return <div></div>}
    //console.log("s-percent", similarityPercent())
    //console.log(message())
    return(
        <MessageBox
            header={"Similarity Panel"}
            text={message()}
            content={<ProgressBar
                value={similarityPercent()}                          //required
                max={100}                           //default 100
                height={24}                         //default 30(px)
                fontSize={16}                       //default 16(px)
                borderRadius={8}                    //default 4(px)
                backgroundColor={"white"}           //default white
                progressColor={"#4CAF50"}           //default #4CAF50
                textColor={"white"}                 //default white
                percent                             //options-> percent,onlyvalue nolabel 
                spectrum={{ start: 0, stop: 120, tranparency: 0.5 }} //default none
            />}
        />

    );
}

export default SimilarityPanel;


/*
        <div className={"fbox-c jcc aic  w100" + status() + ` ${cls}`}
            title={`You and ${profile1.username} has ${similarityPercent()} similar cinema taste. Both of you watched ${info.quantity} number of movies.`}
        >
            <CircularProgress
                className="no-click"
                value={similarityPercent()}
                max={100}
                size={50}
                strokeWidth={10}
                //spectrum={{start:215, stop:240}}
                baseStroke={"rgb(240, 240, 240)"}
                fill={"rgb(40, 40, 40)"}
                textColor={"rgb(255, 255, 255)"}
                fontSize={12}
                fontWeight={600}
                percent
                spectrum={{ start: 30, stop: 100, tranparency: 1 }} //default none

            />

        </div>


const SimilarityPanel = ({profile1, profile2, cls }) => {
    const ratingset1 = profile1.ratingset
    const quantity1 = Object.keys( preprocess(ratingset1))

    const ratingset2 = profile2.ratingset
    const quantity2 = Object.keys( preprocess(ratingset2))
    const info = p2p(ratingset1, ratingset2)

    const message = ()=>{
        if(quantity1.length<40 || quantity2.length<40) return `You or ${profile1.username} should at least rate 40 movies`
        else if(info.quantity<10) return `Similarity calculation at least need 10 movies. You and ${profile1.username} both watched ${info.quantity} movies`
        else return `You and ${profile1.username} both watched ${info.quantity} movies`
    }
    const similarityPercent =()=>{
        if(quantity1.length<40 || quantity2.length<40 || info.quantity<10) return -100
        else return Math.round((0.5 + info.similarity/2)*100)
    }
    const color = () =>{
        const similarity = similarityPercent();
        if (similarity<40)return { success:false ,warning:false, error:true}
        else if (similarity>=40 && similarity<60) return { success: false, warning: true, error:false }
        else if (similarity >= 60) return { success: true, warning: false, error: false }
    }

    const status = () => {
        const similarity = similarityPercent();
        if (similarity < 40) return "error"
        else if (similarity >= 40 && similarity < 60) return "warning"
        else if (similarity >= 60) return "success"
    }
    //console.log(" color",color())

    //console.log(similarityPercent())
    return(
        <div className={"fbox-c jcc aic  box-shadow bor-rad-2x  bor-w1 bor-color-light  mar-bt-5x pad-4x" + status() + ` ${cls}`}>
            <p className="">SIMILARITY PANEL</p>
            <div className="w100 mar-t-3x">
                <Progress indicating {...color()}
                    id="sim-panel"
                    percent={similarityPercent()}
                    disabled={similarityPercent()===-100} progress={similarityPercent()!==-100}/>
            </div>
            <p className="t-s t-color-light" >{message()}</p>
        </div>
    );
}
*/