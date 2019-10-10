import React, { useState } from "react";
import Select from 'react-select';


const YearSelect = (props) =>{
    const [minYearObject, setMinYearObject ] = useState(
        {value:props.minyear ? props.minyear : 1980, label:props.minyear ? props.minyear : 1980})
    
    const [maxYearObject, setMaxYearObject ] = useState(
        {value:props.maxyear ? props.maxyear : 2019, label:props.maxyear ? props.maxyear : 2019})
    
    const yearCollection = []
    for (let i=1920; i<2020; i++ ){ yearCollection.push(i)}

    const minYearOptions = yearCollection.map(year => ({value:year, label:year})).filter(x => x.value <= maxYearObject.value)
    const maxYearOptions = minYearOptions.filter(x => x.value >= minYearObject.value)


    const exportHandler = () => {
        //console.log("export item",{min:minYearObject.value, max:maxYearObject.value})
        props.export({min:minYearObject.value, max:maxYearObject.value})
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
            maxHeight:200
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
        <div className="year-select-box">
            <Select
                defaultValue={minYearObject}
                name="YEAR"
                options={minYearOptions}
                captureMenuScroll

                value={minYearObject}
                onChange={e => selectHandler(e, setMinYearObject)}
                styles={styles}
                className="year-select-menu select-menu min-year"
                classNamePrefix="year-select-item min-year"
            />
            <Select
                defaultValue={maxYearObject}
                captureMenuScroll
                name="YEAR"
                options={maxYearOptions}
                
                value={maxYearObject}
                onChange={e => selectHandler(e, setMaxYearObject)}
                styles={styles}
                className="year-select-menu select-menu max-year"
                classNamePrefix="year-select-item max-year"
            />
        </div>

    )
}




export default YearSelect;