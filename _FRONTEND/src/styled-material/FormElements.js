import React, { useEffect, useState, useContext, useCallback, useMemo, useRef } from "react";
import { makeStyles, fade } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import NativeSelect from '@material-ui/core/NativeSelect';
import TextField from '@material-ui/core/TextField';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';


import { compose,typography, color, space, shadow, layout, border, background, flexbox, position, system } from 'styled-system'
import { FlexBox, NewLink, Box,WatchIcon, ImdbIcon, ImdbColorfulIcon, styled } from "../styled-components"

import staticTags from "../list/search/tags.json" 


const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        padding:16,
        display:"flex",
        flexDirection:"row",
        alignItems:"center"
      },
      slider:{
          color:"#F3CE13",
          '& .MuiSlider-thumb': {
              background:"black",
              color:"black"
          }
      },
      formControl: {
        margin: 4,
        minWidth: 180,
        background:"rgba(0,0,0, 0.15)",
        borderRadius:8,
        height:"100%",
        '&:hover':{
            border:"0px solid black",
        }
      },
      selectEmpty: {
        marginTop: 4,
        width:"100%",
        maxWidth:120,
        height:40,
        '&:hover':{
            border:"0px solid black",
        }
      },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
      },
      inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: 200,
        },
      },
}));


export const YearSlider = ({ min=1920, max=2020, dispatcher,showLabel, ...props }) => {
    const classes = useStyles();
    const [value, setValue] = useState([min + 70, max]);
    const yearvalues = useMemo(() => ({minYear:value[0], maxYear:value[1]}), [value])

    //console.log("options",minYearOptions, maxYearOptions)
    //console.log(minYear, maxYear, selectedYears)
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
    
    dispatcher(yearvalues)
    //console.log("yearvalues",yearvalues)
    return(
        <div className={classes.root}>
            <WatchIcon title="Release Year" stroke={props.iconColor || "#3f51b5"}  size={34}/>
            <Slider
                min={min}
                max={max}
                value={value}
                onChange={handleChange}
                valueLabelDisplay={showLabel ? "on" :"auto"}
                aria-labelledby="range-slider"
                //valueLabelFormat={valuetext}
            />
        </div>
    )
}

export const RatingSlider = ({ min=2, max=10, dispatcher,showLabel, ...props }) => {
    const classes = useStyles();
    const [value, setValue] = useState([min + 4, max]);
    const ratingvalues = useMemo(() => ({minRating:value[0], maxRating:value[1]}), [value])

    //console.log("options",minYearOptions, maxYearOptions)
    //console.log(minYear, maxYear, selectedYears)
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
    
    dispatcher(ratingvalues)
    //console.log("ratingvalues",ratingvalues)
    return(
        <div className={classes.root}>
            <ImdbColorfulIcon title="IMDb Rating" />
            <Slider
                className={classes.slider}
                step={0.1}
                min={min}
                max={max}
                value={value}
                onChange={handleChange}
                valueLabelDisplay={showLabel ? "on" :"auto"}
                aria-labelledby="range-slider"
                //valueLabelFormat={valuetext}
            />
        </div>
    )
}

export const TagSelect = ({ min=2, max=10, dispatcher, ...props }) => {
    const classes = useStyles();
    const allTags = staticTags.filter(t => t.genreTag === true);
    const [tag, setTag ] = useState("")

    const tagHandler = (e) => (console.log(e.target.value),setTag(e.target.value))
    dispatcher(tag)
    return(
        <NativeSelect
            className={classes.selectEmpty}
            value={tag}
            name='Genre'
            onChange={tagHandler}
            inputProps={{
                id: 'outlined-age-native-simple',
                'aria-label': 'Genre',
            }}
            >
            <option value="">Genre</option>
            {allTags.map(t => (
                <option value={t.slug} key={t.slug}>{t.name}</option>
            ))}
        </NativeSelect>
      
    )
}



export const SearchInputMaterial = (props) => {
    const classes = useStyles();
    return (
    <div className={classes.search}>
        <div className={classes.searchIcon}>
            <SearchIcon />
        </div>
        <InputBase
            placeholder="Search…"
            classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
            {...props}
        />
    </div>
)}