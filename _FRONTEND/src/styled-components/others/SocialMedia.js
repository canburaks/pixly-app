import React from "react";
import { Box, OuterLink, FacebookIcon, TwitterIcon, InstagramIcon, HomeIcon, ImdbIcon } from "../"


export const SocialBox = ({ item, size, styles, ...props}) => (
    <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" my={[0]} {...props}>
        {item.homepage && <SocialMedia homepage={item.homepage} size={size} />}
        {item.facebook && <SocialMedia facebook={item.facebook} size={size} />}
        {item.twitter && <SocialMedia twitter={item.twitter} size={size} />}
        {item.instagram && <SocialMedia instagram={item.instagram} size={size} />}
        {item.imdb && <SocialMedia imdb={item.imdb} size={size} rating={item.imdbRating ? item.imdbRating : null} styles={styles} />}
    </Box>
)


export const SocialMedia = (props) => {
    if (props.homepage) return  <HomeLink link={props.homepage} size={props.size} styles={props.styles} />
    else if (props.imdb) return  <ImdbLink link={props.imdb} size={props.size} rating={props.rating} styles={props.styles} />
    else if (props.facebook) return  <FacebookLink link={props.facebook} size={props.size} styles={props.styles} />
    else if (props.twitter) return  <TwitterLink link={props.twitter} size={props.size} styles={props.styles} />
    else if (props.instagram) return  <InstagramLink link={props.instagram} size={props.size} styles={props.styles} />
    else return <div className="hidden"></div>

}


export const ImdbLink = ({link, rating, size, styles, className="" }) => (
    <OuterLink href={link} mr={[1]} display="flex" flexDirection="row">
        <ImdbIcon imdb/>
        {rating && 
            <p className="mar-l-x  t-bold imdb-rating" 
                style={{
                    ...styles,
                    fontWeight:"900", 
                    fontSize:14,
                    color:"rgba(255,255,255, 0.9)",
                    textShadow:"0px 1px 1px rgba(0,0,0, 0.8)",
                    position:"relative", 
                    /* 
                    border:"1px solid black",
                    padding:"1px 2px",
                    borderRadius:"100%", 
                    bottom:0, right:-25, 
                   */
                }}
                >{rating}/10</p>}
    </OuterLink>
)
export const FacebookLink = ({link, size, className="", }) => (
    <OuterLink href={link} mr={[1]}>
        <FacebookIcon facebook />
    </OuterLink>
)
export const InstagramLink = ({link, size, className="", }) => (
    <OuterLink href={link} mr={[1]}>
        <InstagramIcon instagram/>
    </OuterLink>
)
export const TwitterLink = ({link, size, className="", }) => (
    <OuterLink  href={link} mr={[1]}>
        <TwitterIcon twitter/>
    </OuterLink>
)
export const HomeLink = ({link, size, className="", }) => (
    <OuterLink  href={link} mr={[1]}>
        <HomeIcon />
    </OuterLink>
)
