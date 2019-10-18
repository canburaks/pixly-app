import React from "react";
import { compose,typography, color, space, shadow, layout, border, background, flexbox, position, system } from 'styled-system'
import {  styled } from "../"
import { themeGet } from '@styled-system/theme-get'
import css from '@styled-system/css'

import { Svg, MovieSvg, SocialMediaSvg, UnFollowAnimatedSvg,OuterLink, LockSvg, Text, FlexBox, HiddenText } from "../"


const iconchecker = (prevProps, nextProps) => prevProps.id === nextProps.id
const movieiconchecker = (prevProps, nextProps) => (prevProps.id === nextProps.id && prevProps.active === nextProps.active)


export const LikeIcon = (props) => <Heart   {...props} title={!props.authStatus && "Like/Dislike"}/>
export const BookmarkIcon = (props) => <Bookmark  {...props} title={!props.authStatus && "Add/Remove Watchlist"} />

export const FacebookIcon = (props) => <Facebook title="See Facebook Page" {...props} />
export const TwitterIcon = (props) => <Twitter title="See Twitter Page" {...props} />
export const InstagramIcon = (props) => <Instagram title="See Instagram Page" {...props} />
export const ImdbIcon = (props) => <Imdb title="See Internet Movie Database Page" {...props} />
export const HomeIcon = (props) => <Home title="See Home Page" {...props} />

export const YoutubeIcon = (props) => <Youtube {...props} />


export const FollowIcon = (props) => <Follow {...props} />
export const FollowSuccessIcon = (props) => <FollowSuccess {...props} />
export const UnfollowIcon = (props) => <Unfollow {...props} />
export const FollowAnimateIcon = (props) => <FollowAnimate {...props} title={!props.authStatus && "Follow/Unfollow"} />
export const FollowSuccessAnimateIcon = (props) => <FollowSuccessAnimate {...props} title={!props.authStatus && "Follow/Unfollow"} />

export const UserIcon = (props) => <User {...props} />
export const UsersIcon = (props) => <Users {...props} />
export const EyeIcon = (props) => <Eye {...props} />

export const LogoutIcon = (props) => <Logout {...props} />
export const CloseIcon = (props) => <Close {...props} />
export const WatchIcon = (props) => <Watch {...props} />
export const SearchIcon = (props) => <Search {...props} />
export const ClockIcon = (props) => <Clock {...props} />

export const YearIcon = (props) => <ClockYear title="Release Year" {...props} />

//export const YearIcon = (props) => <WatchYear title="Release Year" {...props} />
//export const HourGlassIcon = (props) => <HourGlass title="Release Year" {...props} />
//export const YearGlassIcon = (props) => <HourGlassYear title="Release Year" {...props} />


export const ImdbRatingIcon = (props) => (
    <OuterLink href={props.link} mr={[1]} display="flex" alignItems="flex-end">
        <ImdbIcon imdb title="See IMDb Page" fill="#f1f1f1" {...props}/>
        {props.rating && 
        <Text 
            fontWeight="bold"
            fontSize={["14px"]}
            color="light"
            textShadow="textDark"
            position="relative"
            m={[0]} p={[0]}
            ml={[1]}
        >
            {props.rating}/10
        </Text>}
        <HiddenText>IMDb Page</HiddenText>
    </OuterLink>
)

export const YearClockIcon = (props) => (
    <FlexBox  mr={[1]} display="flex" alignItems="center">
        <ClockIcon title="Release Year"  {...props}/>
        {props.year && 
        <Text 
            fontWeight="bold"
            fontSize={["14px"]}
            color="light"
            textShadow="textDark"
            position="relative"
            ml={[1]}
        >
            {props.year}
        </Text>}
    </FlexBox>
)


const Heart = (props) => (
	<MovieSvg xmlns="http://www.w3.org/2000/svg" 
		viewBox="0 0 24 24"
		strokeLinecap="square" strokeLinejoin="arcs"
		{...props}
	>   
        {props.title && <title>{props.title}</title>}
		<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
	</MovieSvg>
)
const Bookmark = (props) => (
	<MovieSvg xmlns="http://www.w3.org/2000/svg" 
		viewBox="0 0 24 24" 
		strokeLinecap="square" strokeLinejoin="arcs"
		{...props}
	>
        {props.title && <title>{props.title}</title>}
		<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
	</MovieSvg>
)

const Facebook = (props) => (
    <SocialMediaSvg xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" fill="#f1f1f1"
        {...props}
    >
        {props.title && <title>{props.title}</title>}
        <path d="M20 0a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h16zm-4 7.28V4.5h-2.29c-2.1 0-3.42 1.6-3.42 3.89v1.67H8v2.77h2.29v6.67h2.85v-6.67h2.29l.57-2.77h-2.86V8.94c0-1.1.58-1.66 1.72-1.66H16z"/>
    </SocialMediaSvg>
)

const Twitter = (props) => (
    <SocialMediaSvg xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" fill="#f1f1f1"
        {...props}
    >
        {props.title && <title>{props.title}</title>}
        <path d="M20 0a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h16zm-4.42 5.8a3.28 3.28 0 0 0-3.2 4.03A9.32 9.32 0 0 1 5.61 6.4a3.26 3.26 0 0 0 1.02 4.38 3.27 3.27 0 0 1-1.49-.4v.03a3.28 3.28 0 0 0 2.64 3.22 3.3 3.3 0 0 1-1.49.06 3.29 3.29 0 0 0 3.07 2.28 6.59 6.59 0 0 1-4.86 1.36 9.29 9.29 0 0 0 5.03 1.47c6.04 0 9.34-5 9.34-9.34v-.42a6.65 6.65 0 0 0 1.63-1.7c-.59.26-1.22.44-1.89.52.68-.41 1.2-1.05 1.45-1.82-.64.38-1.34.65-2.09.8a3.28 3.28 0 0 0-2.4-1.04z"/>
    </SocialMediaSvg>
)

const InstagramSquare = (props) => (
    <SocialMediaSvg xmlns="http://www.w3.org/2000/svg"  
        viewBox="0 0 24 24" fill="#f1f1f1"
        {...props}
    >
        {props.title && <title>{props.title}</title>}
        <path d="M20 0a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h16zm-4.89 4.5H8.9C6.33 4.5 4.6 6.15 4.5 8.66V15.09c0 1.3.42 2.41 1.27 3.23a4.34 4.34 0 0 0 2.88 1.17l.27.01h6.16c1.3 0 2.4-.42 3.18-1.18a4.25 4.25 0 0 0 1.23-2.95l.01-.26V8.9c0-1.28-.42-2.36-1.21-3.15a4.24 4.24 0 0 0-2.92-1.23l-.26-.01zm-6.2 1.4h6.24c.9 0 1.66.26 2.2.8.47.5.77 1.18.81 1.97V15.1c0 .94-.32 1.7-.87 2.21-.5.47-1.17.74-1.98.78H8.92c-.91 0-1.67-.26-2.21-.78-.5-.5-.77-1.17-.81-2V8.88c0-.9.26-1.66.8-2.2a2.98 2.98 0 0 1 2-.78h6.45-6.23zM12 8.1a3.88 3.88 0 0 0 0 7.74 3.88 3.88 0 0 0 0-7.74zm0 1.39a2.5 2.5 0 0 1 2.48 2.48A2.5 2.5 0 0 1 12 14.45a2.5 2.5 0 0 1-2.48-2.48A2.5 2.5 0 0 1 12 9.49zm4.02-2.36a.88.88 0 1 0 0 1.76.88.88 0 0 0 0-1.76z"/>
    </SocialMediaSvg>
)
const Instagram = (props) => (
    <SocialMediaSvg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24" fill="#f1f1f1"
        {...props}
    >
        {props.title && <title>{props.title}</title>}
        <path d="M16.98 0a6.9 6.9 0 0 1 5.08 1.98A6.94 6.94 0 0 1 24 7.02v9.96c0 2.08-.68 3.87-1.98 5.13A7.14 7.14 0 0 1 16.94 24H7.06a7.06 7.06 0 0 1-5.03-1.89A6.96 6.96 0 0 1 0 16.94V7.02C0 2.8 2.8 0 7.02 0h9.96zm.05 2.23H7.06c-1.45 0-2.7.43-3.53 1.25a4.82 4.82 0 0 0-1.3 3.54v9.92c0 1.5.43 2.7 1.3 3.58a5 5 0 0 0 3.53 1.25h9.88a5 5 0 0 0 3.53-1.25 4.73 4.73 0 0 0 1.4-3.54V7.02a5 5 0 0 0-1.3-3.49 4.82 4.82 0 0 0-3.54-1.3zM12 5.76c3.39 0 6.2 2.8 6.2 6.2a6.2 6.2 0 0 1-12.4 0 6.2 6.2 0 0 1 6.2-6.2zm0 2.22a3.99 3.99 0 0 0-3.97 3.97A3.99 3.99 0 0 0 12 15.92a3.99 3.99 0 0 0 3.97-3.97A3.99 3.99 0 0 0 12 7.98zm6.44-3.77a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z"/>
    </SocialMediaSvg>
)
const Imdb2 = props => (
    <SocialMediaSvg  xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" fill="#f1f1f1"
        {...props}
    >   
        {props.title && <title>{props.title}</title>}
    <path d="M14.46 10.321a2.302 2.302 0 00-.644-.132v3.847c.284 0 .659-.004.726-.091.066-.087.099-.324.099-.709v-2.249c0-.262-.012-.43-.033-.504a.25.25 0 00-.148-.162zm4.946 1.27c-.115 0-.194.033-.229.098s-.052.23-.052.494v1.533c0 .255.02.418.057.49.042.071.122.108.239.108.121 0 .281-.038.317-.111.038-.074.216-.252.216-.532v-1.448c0-.245-.02-.445-.061-.52-.044-.074-.368-.112-.487-.112z" />
    <path d="M19.64.062L4.444.102C1.405.102.143 1.493.143 3.941L.142 20.339c-.039 2.168.696 3.559 3.376 3.559l16.845.04c2.72-.08 3.416-1.671 3.416-3.719l.158-16.439C23.897 1.812 22.723.062 19.64.062zM4.983 15.615H3.145V8.492h1.838v7.123zm6.321 0H9.7l-.007-4.809-.642 4.809H7.903l-.678-4.704-.005 4.704H5.612V8.492h2.385c.067.432.138.937.217 1.518l.263 1.808.425-3.326h2.402v7.123zm4.802-2.113c0 .638-.035 1.065-.094 1.279a.958.958 0 01-.311.506 1.3 1.3 0 01-.554.254c-.218.05-.547.074-.988.074h-2.226V8.492h1.37c.891 0 1.404.04 1.717.123.314.081.553.215.714.403.164.188.268.396.307.626.041.23.066.681.066 1.355v2.503h-.001zm4.791.476c0 .429-.031.747-.086.954-.06.211-.191.392-.406.547-.21.152-.459.229-.75.229-.207 0-.479-.046-.659-.137a1.507 1.507 0 01-.494-.413l-.114.456h-1.655V8.492h1.769v2.316c.146-.171.311-.299.492-.382a1.71 1.71 0 01.661-.127c.244 0 .456.039.634.116.18.076.312.182.408.32.094.138.15.272.169.405.021.131.031.413.031.84v1.998z" />
    </SocialMediaSvg>
)
const Imdb = props => (
    <SocialMediaSvg
      aria-hidden="true"
      viewBox="0 0 448 512"
      {...props}
    >
      <path
        d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM21.3 229.2H21c.1-.1.2-.3.3-.4zM97 319.8H64V192h33zm113.2 0h-28.7v-86.4l-11.6 86.4h-20.6l-12.2-84.5v84.5h-29V192h42.8c3.3 19.8 6 39.9 8.7 59.9l7.6-59.9h43zm11.4 0V192h24.6c17.6 0 44.7-1.6 49 20.9 1.7 7.6 1.4 16.3 1.4 24.4 0 88.5 11.1 82.6-75 82.5zm160.9-29.2c0 15.7-2.4 30.9-22.2 30.9-9 0-15.2-3-20.9-9.8l-1.9 8.1h-29.8V192h31.7v41.7c6-6.5 12-9.2 20.9-9.2 21.4 0 22.2 12.8 22.2 30.1zM265 229.9c0-9.7 1.6-16-10.3-16v83.7c12.2.3 10.3-8.7 10.3-18.4zm85.5 26.1c0-5.4 1.1-12.7-6.2-12.7-6 0-4.9 8.9-4.9 12.7 0 .6-1.1 39.6 1.1 44.7.8 1.6 2.2 2.4 3.8 2.4 7.8 0 6.2-9 6.2-14.4z"
      />
    </SocialMediaSvg>
  )
  
const Youtube = (props) => (
    <SocialMediaSvg xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" fill="#f1f1f1"
        {...props}
    >
        {props.title && <title>{props.title}</title>}

        <path d="M12.04 3.5c.59 0 7.54.02 9.34.5a3.02 3.02 0 0 1 2.12 2.15C24 8.05 24 12 24 12v.04c0 .43-.03 4.03-.5 5.8A3.02 3.02 0 0 1 21.38 20c-1.76.48-8.45.5-9.3.51h-.17c-.85 0-7.54-.03-9.29-.5A3.02 3.02 0 0 1 .5 17.84c-.42-1.61-.49-4.7-.5-5.6v-.5c.01-.9.08-3.99.5-5.6a3.02 3.02 0 0 1 2.12-2.14c1.8-.49 8.75-.51 9.34-.51zM9.54 8.4v7.18L15.82 12 9.54 8.41z"/>
    </SocialMediaSvg>
)
const Power = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg"  
        viewBox="0 0 24 24" fill="none" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="arcs"
        {...props}
    >
        {props.title && <title>{props.title}</title>}

        <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
        <line x1="12" y1="2" x2="12" y2="12"></line>
    </Svg>
)
const Follow = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" fill="none" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="arcs"
        ref={props.ref}
        {...props}
    >
        {props.title && <title>{props.title}</title>}

        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
    </Svg>
)
const FollowSuccess = (props) => (
    <UnFollowAnimatedSvg xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" fill="none" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="arcs"
        {...props}
    >
        {props.title && <title>{props.title}</title>}

        <path  d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </UnFollowAnimatedSvg>
)
const Unfollow = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" fill="none" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="arcs"
        {...props}
    >
        {props.title && <title>{props.title}</title>}

        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
    </Svg>
)
const Lock = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" fill="none" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="arcs"
        {...props}
    >
        {props.title && <title>{props.title}</title>}

        <rect className="lock" x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path className="lock" d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </Svg>
    )
const Notification = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" fill="none" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="arcs"
        {...props}
    >
        {props.title && <title>{props.title}</title>}
        <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>
    </Svg>
)
const Home = props => (
    <Svg
        viewBox="0 0 24 24"
        fill="none"
        strokeLinecap="square"
        strokeLinejoin="arcs"
        {...props}
    >
        {props.title && <title>{props.title}</title>}
        <path d="M20 9v11a2 2 0 01-2 2H6a2 2 0 01-2-2V9" />
        <path d="M9 22V12h6v10M2 10.6L12 2l10 8.6" />
    </Svg>
)
const Close = Unfollow;
const Logout = Power;

const User = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg"  
        viewBox="0 0 24 24" 
        fill="none" stroke="#000000" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="arcs"
        {...props}
    >
        {props.title && <title>{props.title}</title>}
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </Svg>
)
const Users = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" fill="none" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="arcs"
        {...props}
    >
        {props.title && <title>{props.title}</title>}
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4" style={{transform: "rotate(0deg)"}}></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </Svg>
)
const Eye = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" fill="none"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="arcs"
        {...props}
    >
        {props.title && <title>{props.title}</title>}
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </Svg>
)

// ANIMATED ICONS
export const FollowAnimate = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" fill="none" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="arcs"
        {...props}
    >
        {props.title && <title>{props.title}</title>}

        <circle cx="12" cy="12" r="10"></circle>
        <line className="fol" x1="12" y1="8" x2="12" y2="16"></line>
        <line className="fol" x1="8" y1="12" x2="16" y2="12"></line>
    </Svg>
)

const FollowSuccessAnimate = (props) => (
    <UnFollowAnimatedSvg xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" fill="none" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="arcs"
        {...props}
    >
        {props.title && <title>{props.title}</title>}

        <circle className="circle" cx="12" cy="12" r="10"></circle>
        <polyline className="tick" points="22 4 12 14.01 9 11.01"></polyline>
        
        <line className="unf" x1="15" y1="9" x2="9" y2="15"></line>
        <line className="unf" x1="9" y1="9" x2="15" y2="15"></line>
    </UnFollowAnimatedSvg>
)

const Watch = (props) => (
<Svg xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" fill="none"  
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    {...props}
>
    {props.title && <title>{props.title}</title>}
    <circle cx="12" cy="12" r="7"></circle>
    <polyline points="12 9 12 12 13.5 13.5"></polyline>
    <path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83">
</path>
</Svg>
)

const Search = (props) => (
<Svg xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" fill="none" 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    {...props}
>
    {props.title && <title>{props.title}</title>}
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
</Svg>
)
const HourGlass = props => (
    <Svg
      aria-hidden="true"
      viewBox="0 0 384 512"
      {...props}
    >
    {props.title && <title>{props.title}</title>}
      <path fill={props.fill}
        d="M368 48h4c6.627 0 12-5.373 12-12V12c0-6.627-5.373-12-12-12H12C5.373 0 0 5.373 0 12v24c0 6.627 5.373 12 12 12h4c0 80.564 32.188 165.807 97.18 208C47.899 298.381 16 383.9 16 464h-4c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h360c6.627 0 12-5.373 12-12v-24c0-6.627-5.373-12-12-12h-4c0-80.564-32.188-165.807-97.18-208C336.102 213.619 368 128.1 368 48zM64 48h256c0 101.62-57.307 184-128 184S64 149.621 64 48zm256 416H64c0-101.62 57.308-184 128-184s128 82.38 128 184z"
      />
    </Svg>
  )

  const Clock = props => (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M11 2a10 10 0 1010 10A10 10 0 0011 2zm0 18a8 8 0 118-8 8 8 0 01-8 8zm3.1-7.37L12 11.42V7a1 1 0 00-2 0v5.12a.65.65 0 00.05.2.89.89 0 00.08.17.86.86 0 00.1.16l.16.13.09.09 2.6 1.5a1 1 0 00.5.13 1 1 0 00.5-1.87z" />
    </Svg>
  )

  /*


const WatchYear = (props) => (
    <FlexBox  mr={[1]} display="flex" alignItems="center">
        <WatchIcon imdb {...props}/>
        {props.year && 
        <Text 
            fontWeight="bold"
            fontSize={["14px"]}
            color="light"
            textShadow="textDark"
            position="relative"
            ml={[1]}
        >
            {props.year}
        </Text>}
    </FlexBox>
)

const HourGlassYear = (props) => (
    <FlexBox  mr={[1]} display="flex" alignItems="center">
        <HourGlassIcon {...props}/>
        {props.year && 
        <Text 
            fontWeight="bold"
            fontSize={["14px"]}
            color="light"
            textShadow="textDark"
            position="relative"
            ml={[1]}
        >
            {props.year}
        </Text>}
    </FlexBox>
)
*/