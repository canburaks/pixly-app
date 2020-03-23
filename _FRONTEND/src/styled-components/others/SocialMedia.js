import React from "react";
import { 
    Box, OuterLink, FacebookIcon, TwitterIcon, InstagramIcon,
    HomeIcon, ImdbIcon,ImdbRatingIcon, HiddenText 
} from "../"


export const SocialBox = ({ item, size, fill,imdblink, styles, ...props}) => (
    <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" overflow="hidden" my={[0]} {...props}>
        {item.homepage && <SocialMedia homepage={item.homepage} size={size} name={item.name} fill={fill}/>}
        {item.facebook && <SocialMedia facebook={item.facebook} size={size} name={item.name} fill={fill}/>}
        {item.twitter && <SocialMedia twitter={item.twitter} size={size} name={item.name} fill={fill}/>}
        {item.instagram && <SocialMedia instagram={item.instagram} size={size} name={item.name} fill={fill}/>}
        {item.imdb && <SocialMedia imdb={item.imdb} size={size} name={item.name} imdblink={imdblink} rating={item.imdbRating ? item.imdbRating : null} styles={styles} fill={fill}/>}
    </Box>
)


export const SocialMedia = (props) => {
    if (props.homepage) return  <HomeLink link={props.homepage} size={props.size} styles={props.styles} name={props.name} fill={props.fill} />
    else if (props.imdb) return  <ImdbRatingIcon link={props.imdb} size={props.size + 2} rating={props.rating}  name={props.name} follow={true}  fill={props.fill} imdblink={props.imdblink}/>
    else if (props.facebook) return  <FacebookLink link={props.facebook} size={props.size} styles={props.styles} name={props.name}  fill={props.fill}/>
    else if (props.twitter) return  <TwitterLink link={props.twitter} size={props.size} styles={props.styles} name={props.name} fill={props.fill} />
    else if (props.instagram) return  <InstagramLink link={props.instagram} size={props.size} styles={props.styles} name={props.name}  fill={props.fill}/>
    else return <div className="hidden"></div>

}


export const FacebookLink = ({link, name, fill, size, className="", }) => (
    <OuterLink href={link} mr={[1]} title={name + "'s Facebook"}>
        <FacebookIcon facebook fill={fill} />
        <HiddenText>{name + "'s Facebook"} </HiddenText>
    </OuterLink>
)
export const InstagramLink = ({link, name, fill, size, className="", }) => (
    <OuterLink href={link} mr={[1]} title={name + "'s Facebook"}>
        <InstagramIcon instagramfill={fill} />
        <HiddenText>{name + "'s Instagram"} </HiddenText>
    </OuterLink>
)
export const TwitterLink = ({link, name, fill, size, className="", }) => (
    <OuterLink  href={link} mr={[1]} title={name + "'s Facebook"}>
        <TwitterIcon twitterfill={fill} />
        <HiddenText>{name + "'s Twitter"} </HiddenText>
    </OuterLink>
)
export const HomeLink = ({link, name, fill, size, className="", }) => (
    <OuterLink  href={link} mr={[1]} title={name + "'s Facebook"}>
        <HomeIcon fill={fill} />
        <HiddenText>{name + "'s Home Page"} </HiddenText>
    </OuterLink>
)
