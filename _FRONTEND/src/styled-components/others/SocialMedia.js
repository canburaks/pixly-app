import React from "react";
import { 
    Box, OuterLink, FacebookIcon, TwitterIcon, InstagramIcon,
    HomeIcon, ImdbIcon,ImdbRatingIcon, HiddenText 
} from "../"


export const SocialBox = ({ item, size, styles, ...props}) => (
    <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" overflow="hidden" my={[0]} {...props}>
        {item.homepage && <SocialMedia homepage={item.homepage} size={size} name={item.name} />}
        {item.facebook && <SocialMedia facebook={item.facebook} size={size} name={item.name} />}
        {item.twitter && <SocialMedia twitter={item.twitter} size={size} name={item.name} />}
        {item.instagram && <SocialMedia instagram={item.instagram} size={size} name={item.name} />}
        {item.imdb && <SocialMedia imdb={item.imdb} size={size} name={item.name} rating={item.imdbRating ? item.imdbRating : null} styles={styles} />}
    </Box>
)


export const SocialMedia = (props) => {
    if (props.homepage) return  <HomeLink link={props.homepage} size={props.size} styles={props.styles} name={props.name} />
    else if (props.imdb) return  <ImdbRatingIcon link={props.imdb} size={props.size + 2} rating={props.rating}  name={props.name} />
    else if (props.facebook) return  <FacebookLink link={props.facebook} size={props.size} styles={props.styles} name={props.name} />
    else if (props.twitter) return  <TwitterLink link={props.twitter} size={props.size} styles={props.styles} name={props.name} />
    else if (props.instagram) return  <InstagramLink link={props.instagram} size={props.size} styles={props.styles} name={props.name} />
    else return <div className="hidden"></div>

}


export const FacebookLink = ({link, name, size, className="", }) => (
    <OuterLink href={link} mr={[1]}>
        <FacebookIcon facebook />
        <HiddenText>{name + "'s Facebook"} </HiddenText>
    </OuterLink>
)
export const InstagramLink = ({link, name, size, className="", }) => (
    <OuterLink href={link} mr={[1]}>
        <InstagramIcon instagram/>
        <HiddenText>{name + "'s Instagram"} </HiddenText>
    </OuterLink>
)
export const TwitterLink = ({link, name, size, className="", }) => (
    <OuterLink  href={link} mr={[1]}>
        <TwitterIcon twitter/>
        <HiddenText>{name + "'s Twitter"} </HiddenText>
    </OuterLink>
)
export const HomeLink = ({link, name, size, className="", }) => (
    <OuterLink  href={link} mr={[1]}>
        <HomeIcon />
        <HiddenText>{name + "'s Home Page"} </HiddenText>
    </OuterLink>
)
