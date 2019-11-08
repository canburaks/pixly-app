import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";

const ExploreBanner = ({header, items, paragraph, styles}) => {
    const defaultStyle={
        container:{
            position:"relative",
            backgroundColor: "rgba(240, 240, 240, 0.9)",
            minHeight: "20vh",
            boxShadow: "0px 5px 1px 1px rgba(200, 200, 200, 0.3)",
            ...styles.container
        },
        header:{
            color: "rgba(0,0,0, 0.8)",
            flexGrow:1,
            ...styles.header
        },
        paragraph:{
            color:  "rgba(50,50,50, 0.9)",
            fontWeight:  400,
            flexGrow: 1,
            ...styles.paragraph
        },
        itemContainer: {
            padding:20,
            flexGrow: 3,
            ...styles.itemContainer
        },
        itemBox:{
            boxShadow:  "0px 3px 10px 0.1px rgba(0, 0, 0, 0.3)",
            margin:10,
            ...styles.itemBox
        },
        item:{
            color:  "rgba(0,0,0, 0.6)",
            ...styles.item
        }
    }
    return(
        <div className="fbox-c jcfs aic bor-rad-2x mar-5x pad-3x"  style={defaultStyle.container}>
            <h2 style={defaultStyle.header}>{header}</h2>
            {paragraph && <p style={defaultStyle.paragraph} className="pad-lr-5vw">{paragraph}</p> }

            <div className="fbox-r jcc aic pad-lr-5x w100" style={defaultStyle.itemContainer}>
                {(items && items.length>0) && items.map((item,i) => (
                    <Link to={item.url} key={i}>
                        <div className="bor-rad-2x pad-2x button-hover" style={defaultStyle.itemBox}>
                            {item.text}
                        </div>
                    </Link>
                ))}
            </div>
    </div>
    )
}

export default withRouter(ExploreBanner);