import React, { useState, useMemo } from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useQuery } from '@apollo/react-hooks';
import { TAG_LIST } from "../../functions/query"

import { Loading } from "../../styled-components"
import staticTags from "./tags.json" 


const TagSelectStatic = React.memo((props) =>{    
    const [tags, setTags ] = useState(staticTags)

    const animatedComponents = makeAnimated();
    const exportHandler = (tags) => {
        tags && tags.length > 0 ? props.export(tags.map(t => t.value)) : props.export([])
    }
    
    const selectHandler = (e) => props.tagSetter(e)

    const mapper = (tagList, tagType) => tagList.map(tag => ({value:tag.slug, label:tag.name, tagType:tagType}))
    const genres = useMemo( () => mapper(tags.filter(x => x.genreTag === true), "Genre"))
    const subgenres = useMemo( () => mapper(tags.filter(x => x.subgenreTag === true), "Subgenre"))
    const base = useMemo( () => mapper(tags.filter(x => x.baseType === true), "Based"))
    //const awards = mapper(props.tags.filter(x => x.awardTag === true))

    const tagOptions = [
        {label:"BASED ON", options:base},
        {label:"GENRES", options:genres},
        {label:"SUBGENRES", options:subgenres},
    ]

    const styles={
        container: base => ({
            ...base,
            minHeight:50,
            padding: 5,
            zIndex:5
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
            maxHeight:250
        }),
        multiValue: (base, { data }) => ({...base, 
            height:30,
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            //border:"2px solid rgba(255, 255, 255, 0.7)", 
            borderRadius:8,
            border:"1px solid rgba(40,40,40, 0.3)",
            backgroundColor:"rgba(255,255,255, 0.7)",
            fontWeight:600,
            padding:"0px 4px",
            margin:"2px 2px",
            boxShadow:"0 10px 29px -8px rgba(40, 40, 40, 0.17)"
        }),
        multiValueLabel: (base, { data }) => ({...base,
           color:setTagColor(data, 1),
           
        }),
        multiValueRemove: base => ({...base,
            //border: `1px dotted ${colourOptions[2].color}`,
            height: 25,
            width:25,
            borderRadius:"100%",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            backgroundColor:"rgba(140, 140, 140, 0.9)",
            margin:"2px 4px"
        }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            return {
            ...styles,
            color:setTagColor(data, 1),
            fontWeight:600
            };
        },
        clearIndıcator: base => ({...base,
            color:"rgba(40,40,40, 0.6)"
        }),
          
        dropdownIndicator: base => ({...base,
            color:"rgba(40,40,40, 0.6)"
        }),
        placeholder: base => ({...base,
            color:"rgba(40,40,40, 0.8)"
        })
    }


    return(
        <Select
            closeMenuOnSelect={false}
            defaultValue={[]}
            isMulti
            options={tagOptions}
            onChange={e => selectHandler(e)}

            placeholder="Choose genre"
            components={animatedComponents}
            captureMenuScroll
            className="tag-select-menu select-menu"
            classNamePrefix="tag-select-item"
            styles={styles}
            value={props.tags}
            getValue={e => console.log("e", e)}
        />
    )
})

function setTagColor(item, opacity=1){
    switch(item.tagType){
        case "base":
            return `rgba(46, 49, 49, ${opacity})` 
        case "award":
            return `rgba(3, 166, 120, ${opacity})`
        case "Genre":
            return `rgba(57, 61, 204, ${opacity})`
        case "tag":
            return `rgba(102, 51, 153, ${opacity})`
    }
}


export default TagSelectStatic;