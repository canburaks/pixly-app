import React, { useState } from "react";
import Select from 'react-select';


const RatingSelect = (props) =>{
    const [minRatingObject, setMinRatingObject ] = useState(
        {value:props.minrating ? props.minrating : 8.0, label:props.minrating ? props.minrating : 8.0})

    const [maxRatingObject, setMaxRatingObject ] = useState(
        {value:props.maxrating ? props.maxrating : 10, label:props.maxrating ? props.maxrating : 10})
    
    const ratingCollection = []
    for (let i=1; i<=10; i += (1/10)){ ratingCollection.push( Math.round( i * 10 ) / 10 )}

    const minRatingOptions = ratingCollection.map(rating => ({value:rating, label:rating})).filter(x => x.value <= maxRatingObject.value)

    const maxRatingOptions = ratingCollection.map(rating => ({value:rating, label:rating})).filter(x => x.value >= minRatingObject.value)
    //const maxRatingOptions = minRatingOptions.filter(x => x.value >= minRatingObject.value)


    const exportHandler = () => {
        //console.log("export item",{min:minYearObject.value, max:maxYearObject.value})
        props.export({min:minRatingObject.value, max:maxRatingObject.value})
    }
    
    const selectHandler = (e, setter) => {
        //console.log("e",e)
        setter(e)
    }


    //console.log("selection: ", maxYearOptions)
    //console.log("years: ", minYearObject, maxYearObject)

    const styles={
        container: base => ({
            ...base,
            minHeight:50,
            padding: 5,
        }),
        control: base => ({...base,
            border:"1px solid rgba(40, 40, 40, 0.3)", 
            borderRadius:12,
            minHeight:40,
            backgroundColor:"rgba(255,255,255,0.2)"
        }),
        placeholder: base => ({...base,
            color:"white"
        }),
        valueContainer: base => ({...base,
            minHeight:40,
            //backgroundColor:"white"
        }),
        menu: base => ({...base,
            //height:"100%"
            borderRadius:18,

            scrollBehavior: "smooth"
        }),
        menuList: base => ({...base,
            //height:"100%"
            borderRadius:18,
            scrollBehavior: "smooth",
            maxHeight:200,
        }),
        singleValue: (base, { data }) => ({...base, 
            height:36,
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            //border:"2px solid rgba(255, 255, 255, 0.7)", 
            borderRadius:12,
            fontWeight:600,
            padding:"0px 4px",
            margin:"4px 2px",
            boxShadow:"0 10px 29px -8px rgba(255, 255, 255, 0.17)",
            color:"white"
        }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            return {
            ...styles,
            color:"black",
            fontWeight:600
            };
        },
        clearIndıcator: base => ({...base,
            color:"rgba(40,40,40, 0.6)"
        }),
          
        dropdownIndicator: base => ({...base,
            color:"rgba(40,40,40, 0.6)"
        }),

    }

    exportHandler()
    return(
        <div className="rating-select-box">
            <Select
                defaultValue={minRatingObject}
                name="RATING"
                options={minRatingOptions}
                captureMenuScroll

                value={minRatingObject}
                onChange={e => selectHandler(e, setMinRatingObject)}
                styles={styles}
                className="rating-select-menu select-menu min-rating"
                classNamePrefix="rating-select-item min-rating"
            />
            <Select
                defaultValue={maxRatingObject}
                captureMenuScroll

                name="RATING"
                options={maxRatingOptions}
                
                value={maxRatingObject}
                onChange={e => selectHandler(e, setMaxRatingObject)}
                styles={styles}
                className="rating-select-menu select-menu max-rating"
                classNamePrefix="rating-select-item max-rating"
            />
        </div>

    )
}

export default RatingSelect;