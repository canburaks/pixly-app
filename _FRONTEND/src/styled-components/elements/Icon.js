import React from "react";
import { compose,typography, color, space, shadow, layout, border, background, flexbox, position, system } from 'styled-system'
import {  styled } from "../"
import { themeGet } from '@styled-system/theme-get'
import css from '@styled-system/css'

import { Svg, MovieSvg, SocialMediaSvg, UnFollowAnimatedSvg,OuterLink, LockSvg, Text, FlexBox, HiddenText } from "../"


const iconchecker = (prevProps, nextProps) => prevProps.id === nextProps.id
const movieiconchecker = (prevProps, nextProps) => (prevProps.id === nextProps.id && prevProps.active === nextProps.active)


export const LikeIcon = (props) => <Heart   {...props} title={!props.authStatus && "Like/Dislike"}/>
export const BookmarkIcon = (props) => <Bookmark   title={!props.authStatus && "Add/Remove Watchlist"} {...props}/>

export const FacebookIcon = (props) => <Facebook title="See Facebook Page" {...props} />
export const TwitterIcon = (props) => <Twitter title="See Twitter Page" {...props} />
export const InstagramIcon = (props) => <Instagram title="See Instagram Page" {...props} />
export const ImdbIcon = (props) => <Imdb title="See Internet Movie Database Page" {...props} />
export const HomeIcon = (props) => <Home title="See Home Page" {...props}/>

export const YoutubeIcon = (props) => <Youtube {...props} />


export const FollowIcon = (props) => <Follow {...props}  clickable/>
export const FollowSuccessIcon = (props) => <FollowSuccess {...props} />
export const UnfollowIcon = (props) => <Unfollow {...props} />
export const FollowAnimateIcon = (props) => <FollowAnimate {...props} title={!props.authStatus && "Follow/Unfollow"} clickable/>
export const FollowSuccessAnimateIcon = (props) => <FollowSuccessAnimate {...props} title={!props.authStatus && "Follow/Unfollow"} clickable/>

export const UserIcon = (props) => <User {...props} />
export const UsersIcon = (props) => <Users {...props} />
export const EyeIcon = (props) => <Eye {...props} />

export const LogoutIcon = (props) => <Logout size={props.size || 24} {...props} />
export const CloseIcon = (props) => <Close {...props} />
export const WatchIcon = (props) => <Watch {...props} />
export const ClockIcon = (props) => <Clock {...props} />

export const YearIcon = (props) => <ClockYear title="Release Year" {...props} />
export const ProfileIcon = (props) => <Profile size={props.size || 24} clickable {...props} />

//export const YearIcon = (props) => <WatchYear title="Release Year" {...props} />
//export const HourGlassIcon = (props) => <HourGlass title="Release Year" {...props} />
//export const YearGlassIcon = (props) => <HourGlassYear title="Release Year" {...props} />Download icon

const Path = styled.path`
    box-shadow:${props => props.boxShadow && props.boxShadow};
	color:red;
	${layout};
	${position};
	${color};
`

export const ImdbColorfulIcon = ({size=40,...props}) => {
	return (
		<Svg width={30} height={30} viewBox="0 0 30 30" fill="none" {...props}>
			<rect width={30} height={30} rx={15} fill="#181818" />
			<path
			d="M26.786 0H3.214A3.215 3.215 0 000 3.214v23.572A3.215 3.215 0 003.214 30h23.572A3.215 3.215 0 0030 26.786V3.214A3.215 3.215 0 0026.786 0zM1.426 13.205h-.02c.007-.006.014-.02.02-.026v.026zm5.07 6.067h-2.21v-8.558h2.21v8.558zm7.58 0h-1.922v-5.785l-.777 5.785h-1.38l-.816-5.658v5.658H7.239v-8.558h2.866c.22 1.326.402 2.672.582 4.011l.51-4.01h2.879v8.557zm.763 0v-8.558h1.648c1.178 0 2.993-.107 3.28 1.4.115.509.095 1.091.095 1.634 0 5.926.743 5.531-5.023 5.524zm10.775-1.955c0 1.051-.16 2.07-1.487 2.07-.602 0-1.018-.202-1.4-.657l-.127.542h-1.995v-8.558h2.123v2.793c.401-.436.803-.616 1.4-.616 1.432 0 1.486.857 1.486 2.015v2.411zm-7.869-4.065c0-.65.108-1.071-.69-1.071v5.605c.818.02.69-.583.69-1.232v-3.302zM23.471 15c0-.362.074-.85-.415-.85-.402 0-.328.595-.328.85 0 .04-.074 2.652.073 2.993.054.107.148.161.255.161.522 0 .415-.603.415-.964V15z"
			fill="#F3CE13"
			/>
	  	</Svg>
	)
  }
  

export const FourSquareIcon = (props) => (
<Svg viewBox="0 0 24 24" 
	fill="none" stroke="#000000" 
	strokeWidth="2" strokeLinecap="round" 
	strokeLinejoin="round"
	{...props}
>
	<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect>
	<rect x="14" y="14" width="7" height="7"></rect>
	<rect x="3" y="14" width="7" height="7"></rect>
</Svg>

)

export const ListItemCaret = (props) => (
<Svg viewBox="0 0 24 24" 
	fill="none" stroke="#000000" 
	strokeWidth="2" strokeLinecap="round" 
	strokeLinejoin="round"
	{...props}
>
	<path d="M9 18l6-6-6-6"/>
</Svg>

)

export const DropdownCaretIcon = (props) => (
	<Svg 
		viewBox="0 0 24 24" 
		fill="none" 
		stroke="#000000" 
		strokeWidth="2" 
		strokeLinecap="round" 
		strokeLinejoin="round"
		{...props}
	>
		<path d="M6 9l6 6 6-6"/>
	</Svg>
)

export const LinkIcon = ({ title,  ...props }) =>  (
<Svg xmlns="http://www.w3.org/2000/svg" 
	viewBox="0 0 24 24" 
	fill="none" stroke="#000000" 
	strokeWidth="2" strokeLinecap="round" 
	strokeLinejoin="round"
	{...props}
>
	<g fill="none" fillRule="evenodd">
		<path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h5M15 3h6v6M10 14L20.2 3.8"/>
	</g>
</Svg>
)

export const KeyIcon = ({ title,  ...props }) =>  (
	<Svg
		ariaHidden="true"
		dataPrefix="fas"
		viewBox="0 0 512 512"
		{...props}
	>
		{title ? <title >{title}</title> : null}
		<path
			fill="currentColor"
			d="M512 176.001C512 273.203 433.202 352 336 352c-11.22 0-22.19-1.062-32.827-3.069l-24.012 27.014A23.999 23.999 0 01261.223 384H224v40c0 13.255-10.745 24-24 24h-40v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24v-78.059c0-6.365 2.529-12.47 7.029-16.971l161.802-161.802C163.108 213.814 160 195.271 160 176 160 78.798 238.797.001 335.999 0 433.488-.001 512 78.511 512 176.001zM336 128c0 26.51 21.49 48 48 48s48-21.49 48-48-21.49-48-48-48-48 21.49-48 48z"
		/>
	</Svg>
)
  
export const UserStatsIcon = (props) => (
	<FlexBox {...props} alignItems="center">
		<FilmIcon title="Points" fill="rgba(0,0,0, 0.9)"/>
		<Text mr={[2]} fontWeight="bold" minWidth={"8px"}>{props.points}</Text>

		<RegularBookmarkIcon title="Number of movies in the watchlist" fill="rgba(255,20,20, 0.7)"/>
		<Text mr={[2]} fontWeight="bold" minWidth={"8px"}>{props.lenBookmarks}</Text>

		<RegularHeartIcon title="Number favourite movies" fill="rgba(255,0,0, 0.7)"/>
		<Text mr={[2]} fontWeight="bold" minWidth={"8px"}>{props.lenLikes}</Text>
	</FlexBox>
)
const RegularHeartIcon = (props) => (
	<Svg xmlns="http://www.w3.org/2000/svg" 
		viewBox="0 0 24 24"
		strokeLinecap="square" strokeLinejoin="arcs"
		strokeWidth="2"
		{...props}
	>   
		{props.title && <title>{props.title}</title>}
		<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
	</Svg>
)
const RegularBookmarkIcon = (props) => (
	<Svg xmlns="http://www.w3.org/2000/svg" 
		viewBox="0 0 24 24" 
		strokeLinecap="square" strokeLinejoin="arcs"
		{...props}
	>  
		{props.title && <title>{props.title}</title>}
		<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
	</Svg>
)
export const FilmIcon = (props) => (
<Svg 
	viewBox="0 0 24 24" 
	fill="none"
	strokeWidth="2" 
	strokeLinecap="round" strokeLinejoin="round"
	{...props}
	>
	<rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
	<line x1="7" y1="2" x2="7" y2="22"></line>
	<line x1="17" y1="2" x2="17" y2="22"></line>
	<line x1="2" y1="12" x2="22" y2="12"></line>
	<line x1="2" y1="7" x2="7" y2="7"></line>
	<line x1="2" y1="17" x2="7" y2="17"></line>
	<line x1="17" y1="17" x2="22" y2="17"></line>
	<line x1="17" y1="7" x2="22" y2="7"></line>
</Svg>
)

export const TumblrIcon = (props) => (
<SocialMediaSvg
viewBox="0 0 24 24" 
fill="#000"
{...props}
m={[0]} p={[0]}
>
	<path d="M20 0a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h16zm-7.38 5H10.6c-.1.72-.26 1.32-.5 1.78-.25.47-.57.87-.97 1.2-.35.3-.9.53-1.4.7l-.22.07v1.99h1.95v4.9c0 .65.07 1.14.2 1.47.14.34.39.66.74.96a4.49 4.49 0 0 0 2.83.93 7.28 7.28 0 0 0 2.98-.63l.3-.13v-2.21c-.72.46-1.44.69-2.17.69-.4 0-.76-.1-1.08-.28a1.3 1.3 0 0 1-.55-.6 3.14 3.14 0 0 1-.08-.92v-4.18h3.32v-2.5h-3.32V5z"/>
</SocialMediaSvg>
)


//More Complex Icons
export const ImdbRatingIconLink = (props) => (
	<OuterLink href={props.link} mr={[1]} display="flex" alignItems="flex-end" follow={props.follow}>
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
export const ImdbRatingIcon = (props) => (
<FlexBox mr={[1]} display="flex" alignItems="flex-end" follow={props.follow}>
	<ImdbIcon title="See IMDb Page" fill="#f1f1f1" {...props} className="no-click"/>
	{props.rating && 
	<Text 
		fontWeight="bold"
		fontSize={["14px"]}
		color="light"
		textShadow="-2px 2px 1px rgba(0,0,0, 0.6)"
		position="relative"
		m={[0]} p={[0]}
		ml={[1]}
	>
		{props.rating}/10
	</Text>}
	<HiddenText>IMDb Page</HiddenText>
</FlexBox>
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

export const PlaceIcon = (props) => (
<FlexBox  mx={[1]} display="flex" alignItems="center">
	<Svg xmlns="http://www.w3.org/2000/svg" 
		viewBox="0 0 24 24" fill="none"
		strokeWidth="2" strokeLinecap="round" 
		strokeLinejoin="round"
		{...props}
	>
		<path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
		<circle cx="12" cy="10" r="3"/>
	</Svg>
	{props.text && <Text fontWeight="bold" fontSize={["14px"]} color="light" {...props}>{props.text}</Text>}
</FlexBox>
)



//Only SVG Icons

export const SettingsIcon = (props) => (
<Svg 
	viewBox="0 0 24 24" 
	fill="none" strokeWidth="2" 
	strokeLinecap="round" strokeLinejoin="round"
	clickable
	{...props}
>
	<title>Settings</title>
	<circle cx="12" cy="12" r="3"></circle>
	<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
</Svg>
)

export const ListIcon = (props) =>(
	<Svg viewBox="0 0 24 24" 
		viewBox="0 0 24 24" fill="none" 
		strokeWidth="2" 
		strokeLinecap="round" strokeLinejoin="round"
		clickable
		{...props}
	>
		{props.title && <title>{props.title}</title>}
		<line x1="8" y1="6" x2="21" y2="6"></line>
		<line x1="8" y1="12" x2="21" y2="12"></line>
		<line x1="8" y1="18" x2="21" y2="18"></line>
		<line x1="3" y1="6" x2="3" y2="6"></line>
		<line x1="3" y1="12" x2="3" y2="12"></line>
		<line x1="3" y1="18" x2="3" y2="18"></line>
	</Svg>
)
export const PinterestIcon = props => (
<SocialMediaSvg
	viewBox="0 0 448 512"
	{...props}
	m={[0]} p={[0]}
>
	<path
	fill="currentColor"
	d="M448 80v352c0 26.5-21.5 48-48 48H154.4c9.8-16.4 22.4-40 27.4-59.3 3-11.5 15.3-58.4 15.3-58.4 8 15.3 31.4 28.2 56.3 28.2 74.1 0 127.4-68.1 127.4-152.7 0-81.1-66.2-141.8-151.4-141.8-106 0-162.2 71.1-162.2 148.6 0 36 19.2 80.8 49.8 95.1 4.7 2.2 7.1 1.2 8.2-3.3.8-3.4 5-20.1 6.8-27.8.6-2.5.3-4.6-1.7-7-10.1-12.3-18.3-34.9-18.3-56 0-54.2 41-106.6 110.9-106.6 60.3 0 102.6 41.1 102.6 99.9 0 66.4-33.5 112.4-77.2 112.4-24.1 0-42.1-19.9-36.4-44.4 6.9-29.2 20.3-60.7 20.3-81.8 0-53-75.5-45.7-75.5 25 0 21.7 7.3 36.5 7.3 36.5-31.4 132.8-36.1 134.5-29.6 192.6l2.2.8H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48z"
	/>
</SocialMediaSvg>
)


const Profile = (props) =>(
	<Svg viewBox="0 0 24 24" {...props}>
		<rect width={props.size} height={props.size} fill="none" rx="0" ry="0"/>
		<path fillRule="evenodd" clipRule="evenodd" d="M17 7C17 9.76142 14.7614 12 12 12C9.23858 12 7 9.76142 7 7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7ZM11 13C6.58172 13 3 16.5817 3 21C3 21 6 22 12 22C18 22 21 21 21 21C21 16.5817 17.4183 13 13 13H11Z" fill="#ffffff"/>
	</Svg>
)
const Heart = (props) => (
	<MovieSvg xmlns="http://www.w3.org/2000/svg" 
		viewBox="0 0 24 24"
		strokeLinecap="square" strokeLinejoin="arcs"
		strokeWidth="2"
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
	<Svg xmlns="http://www.w3.org/2000/svg" 
		viewBox="0 0 24 24" fill="#f1f1f1"
		{...props}
	>
		{props.title && <title>{props.title}</title>}

		<Path  d="M12.04 3.5c.59 0 7.54.02 9.34.5a3.02 3.02 0 0 1 2.12 2.15C24 8.05 24 12 24 12v.04c0 .43-.03 4.03-.5 5.8A3.02 3.02 0 0 1 21.38 20c-1.76.48-8.45.5-9.3.51h-.17c-.85 0-7.54-.03-9.29-.5A3.02 3.02 0 0 1 .5 17.84c-.42-1.61-.49-4.7-.5-5.6v-.5c.01-.9.08-3.99.5-5.6a3.02 3.02 0 0 1 2.12-2.14c1.8-.49 8.75-.51 9.34-.51zM9.54 8.4v7.18L15.82 12 9.54 8.41z"/>
	</Svg>
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
		viewBox="0 0 576 512" fill="#f1f1f1"
		strokeWidth="2"
		xmlns="http://www.w3.org/2000/svg" 
		{...props}
	>
		{props.title && <title>{props.title}</title>}
		<path  d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path>
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

export const SearchIcon = (props) => (
<Svg xmlns="http://www.w3.org/2000/svg" 
	viewBox="0 0 24 24" fill="none" 
	strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
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

const BrandSvg = props => (
	<svg width={44} height={44} fill="none" {...props}>
	<circle cx={22} cy={22} r={22} fill="url(#prefix__paint0_angular)" />
	<circle cx={22} cy={22} r={20} fill="#000" />
	<path
	d="M10.92 17.52c.79 0 1.504.181 2.144.544.64.352 1.141.853 1.504 1.504.363.65.544 1.392.544 2.224 0 .843-.181 1.59-.544 2.24a3.888 3.888 0 01-1.504 1.52c-.63.352-1.344.528-2.144.528a4.092 4.092 0 01-1.856-.416 3.582 3.582 0 01-1.344-1.248v4.688H6.584v-11.52h1.088v1.664c.341-.555.79-.981 1.344-1.28.565-.299 1.2-.448 1.904-.448zm-.08 7.552c.587 0 1.12-.133 1.6-.4.48-.277.853-.667 1.12-1.168.277-.501.416-1.072.416-1.712 0-.64-.139-1.205-.416-1.696a2.883 2.883 0 00-1.12-1.168 3.14 3.14 0 00-1.6-.416c-.597 0-1.136.139-1.616.416-.47.277-.843.667-1.12 1.168-.267.49-.4 1.056-.4 1.696 0 .64.133 1.21.4 1.712.277.501.65.89 1.12 1.168.48.267 1.019.4 1.616.4zm6.028-7.488h1.136V26h-1.136v-8.416zm.576-1.84a.804.804 0 01-.592-.24.786.786 0 01-.24-.576c0-.213.08-.4.24-.56.16-.16.357-.24.592-.24.234 0 .432.08.592.24.16.15.24.33.24.544 0 .235-.08.432-.24.592a.804.804 0 01-.592.24zM25.964 26l-2.671-3.52L20.605 26h-1.28l3.328-4.32-3.168-4.096h1.28l2.528 3.296 2.528-3.296h1.248L23.9 21.68 27.26 26h-1.296zm2.628-11.872h1.136V26H28.59V14.128zM39.4 17.584l-4.208 9.424c-.341.79-.736 1.35-1.184 1.68-.448.33-.986.496-1.616.496-.405 0-.784-.064-1.136-.192a2.462 2.462 0 01-.912-.576l.528-.848c.427.427.939.64 1.536.64.384 0 .71-.107.976-.32.278-.213.534-.576.768-1.088l.368-.816-3.76-8.4h1.184l3.168 7.152 3.168-7.152h1.12z"
	fill="#fff"
	/>
	<defs>
	<radialGradient
		id="prefix__paint0_angular"
		cx={0}
		cy={0}
		r={1}
		gradientUnits="userSpaceOnUse"
		gradientTransform="matrix(0 22 -22 0 22 22)"
	>
		<stop offset={0.104} stopColor="#3437C7" />
		<stop offset={0.24} stopColor="#3D33CC" />
		<stop offset={0.389} stopColor="#5606FF" />
		<stop offset={0.537} stopColor="#4900C0" />
		<stop offset={0.758} stopColor="#3B04AD" />
		<stop offset={0.93} stopColor="#0025A8" />
	</radialGradient>
	</defs>
</svg>
)



export const HeroPatternBottom = props => (
	<svg width={807} height={708} {...props}>
	<defs>
		<linearGradient
		x1="73.351%"
		y1="86.398%"
		x2="-8.617%"
		y2="-18.811%"
		id="prefix__a"
		>
		<stop stopColor="#0270D7" stopOpacity={0} offset="0%" />
		<stop stopColor="#00BFFB" offset="51.568%" />
		<stop stopColor="#0270D7" offset="100%" />
		</linearGradient>
		<linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="prefix__b">
		<stop stopColor="#FFF" stopOpacity={0.32} offset="0%" />
		<stop stopColor="#0270D7" stopOpacity={0} offset="100%" />
		</linearGradient>
		<linearGradient x1="0%" y1="0%" y2="88.353%" id="prefix__c">
		<stop stopColor="#00BFFB" offset="0%" />
		<stop stopColor="#FFF" stopOpacity={0} offset="100%" />
		</linearGradient>
	</defs>
	<g fill="none" fillRule="evenodd">
		<path
		d="M548.329 331.135c-10.827-5.575-22.39-9.473-34.118-12.358-11.764-2.804-23.737-4.498-35.687-5.502-23.927-2.09-47.793-1.674-71.383-3.41l-8.853-.65-8.833-.895-4.417-.45c-1.47-.163-2.936-.372-4.404-.557l-8.81-1.14c-11.71-1.755-23.406-3.69-34.983-6.237-5.812-1.164-11.563-2.6-17.33-3.971-2.892-.652-5.738-1.49-8.61-2.227-2.86-.781-5.741-1.48-8.582-2.327-5.687-1.681-11.403-3.266-17.034-5.13-2.822-.912-5.66-1.777-8.47-2.728l-8.41-2.904c-2.812-.942-5.593-1.976-8.37-3.017l-8.34-3.107-8.27-3.29-4.135-1.644-4.098-1.735-8.196-3.474-8.122-3.643c-5.436-2.38-10.755-5.018-16.124-7.545-21.341-10.395-42.111-21.953-62.298-34.423-20.131-12.562-39.717-25.988-58.606-40.308-4.697-3.613-9.433-7.175-14.044-10.893l-6.948-5.538-6.862-5.64a343.29 343.29 0 01-6.81-5.7l-6.763-5.75-6.67-5.856c-2.225-1.948-4.447-3.901-6.624-5.902-9.988-9.067-11.182-7.79-1.261 1.388 2.167 2.029 4.378 4.01 6.594 5.986l6.638 5.943 6.732 5.837a339.623 339.623 0 006.778 5.789l6.83 5.729 6.916 5.628c4.59 3.78 9.306 7.402 13.98 11.079 18.81 14.569 38.32 28.26 58.397 41.096 20.135 12.742 40.87 24.585 62.217 35.266 5.37 2.6 10.69 5.309 16.133 7.762l8.132 3.75 8.21 3.582 4.106 1.789 4.145 1.698 8.29 3.397 8.367 3.213c2.788 1.076 5.577 2.146 8.4 3.123l8.446 3.009c2.82.987 5.673 1.885 8.508 2.832 5.659 1.932 11.406 3.587 17.126 5.333 2.857.884 5.759 1.613 8.636 2.426 2.89.77 5.754 1.642 8.666 2.326 5.808 1.43 11.602 2.934 17.46 4.158 11.67 2.67 23.474 4.714 35.3 6.578l8.9 1.214 4.453.598 4.465.482 8.932.964 8.957.712c23.907 1.898 47.776 1.584 71.289 3.7 11.759 1.016 23.409 2.684 34.785 5.4 11.344 2.794 22.466 6.546 32.785 11.845 1.254.623 2.465 1.236 3.602 1.887a7129.6 7129.6 0 003.335 1.829c2.085 1.273 4.095 2.352 5.838 3.518.89.557 1.745 1.09 2.562 1.6.799.539 1.562 1.05 2.289 1.54l2.097 1.374 1.839 1.287c1.153.812 2.223 1.464 3.102 2.07a29.24 29.24 0 002.282 1.45c1.283.717 2.084.936 2.366.659.283-.278.048-1.054-.741-2.328a29.382 29.382 0 00-1.603-2.284c-.677-.884-1.568-1.81-2.576-2.89-.511-.532-1.05-1.108-1.646-1.685-.617-.553-1.27-1.138-1.954-1.753-.695-.607-1.417-1.258-2.203-1.9-.806-.617-1.648-1.261-2.528-1.932-1.741-1.38-3.78-2.642-5.936-4.068-1.096-.682-2.263-1.334-3.46-2.03-1.188-.71-2.455-1.367-3.773-2.025"
		fillOpacity={0.32}
		fill="url(#prefix__a)"
		transform="rotate(31 293.468 227.547)"
		/>
		<path
		d="M325.998 406.651c9.565 7.539 20.17 13.571 31.134 18.641 11.012 4.997 22.442 8.945 33.981 12.21 23.089 6.618 46.596 10.763 69.421 16.969l8.566 2.326 8.5 2.565 4.25 1.283c1.412.442 2.811.927 4.217 1.388l8.43 2.8c11.16 3.958 22.272 8.089 33.15 12.798 5.484 2.252 10.855 4.759 16.255 7.205 2.714 1.192 5.348 2.556 8.026 3.828 2.658 1.313 5.354 2.548 7.98 3.922 5.263 2.736 10.571 5.382 15.743 8.286 2.596 1.434 5.217 2.825 7.793 4.294l7.701 4.456c2.582 1.461 5.115 3.007 7.642 4.558l7.594 4.642 7.49 4.806 3.745 2.404 3.692 2.485 7.383 4.974 7.277 5.126c4.882 3.373 9.6 6.978 14.388 10.483 18.966 14.276 37.149 29.585 54.586 45.678 17.364 16.172 34.028 33.088 49.838 50.75 3.921 4.442 7.89 8.843 11.707 13.372l5.764 6.762 5.66 6.845a343.29 343.29 0 015.596 6.894l5.543 6.935 5.429 7.022c1.813 2.337 3.621 4.678 5.377 7.058 8.074 10.806 9.49 9.78 1.502-1.122-1.74-2.405-3.532-4.772-5.33-7.134l-5.382-7.1-5.495-7.015a339.623 339.623 0 00-5.549-6.976l-5.611-6.927-5.715-6.844c-3.785-4.586-7.723-9.042-11.61-13.543-15.684-17.89-32.223-35.053-49.482-51.484-17.334-16.35-35.428-31.931-54.345-46.49-4.775-3.576-9.481-7.25-14.355-10.697l-7.267-5.233-7.376-5.082-3.69-2.54-3.744-2.458-7.49-4.916-7.6-4.75c-2.531-1.589-5.065-3.171-7.65-4.67l-7.716-4.564c-2.581-1.507-5.21-2.933-7.812-4.404-5.186-2.976-10.512-5.697-15.793-8.503-2.636-1.412-5.346-2.682-8.015-4.029-2.69-1.307-5.335-2.71-8.063-3.937-5.428-2.513-10.829-5.093-16.347-7.413-10.945-4.847-22.142-9.106-33.396-13.193l-8.505-2.89-4.256-1.436-4.29-1.325-8.585-2.65-8.656-2.409c-23.106-6.425-46.596-10.67-69.274-17.234-11.349-3.241-22.466-7.102-33.115-11.94-10.603-4.906-20.804-10.71-29.923-17.881-1.112-.851-2.184-1.684-3.175-2.54a7129.6 7129.6 0 00-2.925-2.432c-1.804-1.647-3.571-3.09-5.06-4.567-.768-.717-1.504-1.404-2.21-2.06-.68-.681-1.332-1.33-1.952-1.948l-1.797-1.749-1.56-1.614c-.976-1.017-1.902-1.861-2.65-2.625a29.24 29.24 0 00-1.963-1.858c-1.122-.948-1.867-1.316-2.197-1.098-.33.219-.248 1.025.284 2.426.265.7.644 1.55 1.137 2.548.496.997 1.194 2.075 1.978 3.329.4.62.818 1.288 1.294 1.968l1.583 2.094c.567.728 1.151 1.505 1.8 2.285l2.113 2.379c1.446 1.686 3.206 3.314 5.051 5.126.946.878 1.967 1.741 3.008 2.652 1.032.923 2.15 1.811 3.318 2.708"
		fillOpacity={0.48}
		fill="#1D2026"
		/>
		<path
		d="M279.236 342.842c21.126.122 42.298.388 63.513-.171 21.204-.56 42.464-1.952 63.528-5.152 2.638-.361 5.254-.865 7.877-1.318 2.62-.479 5.253-.885 7.86-1.425 5.207-1.118 10.444-2.105 15.603-3.435 10.382-2.399 20.595-5.457 30.757-8.64l7.567-2.556 3.78-1.288 3.748-1.38 7.493-2.765 7.421-2.952 3.71-1.478 3.673-1.567 7.343-3.135 7.268-3.305 3.633-1.655 3.598-1.73 7.187-3.472 7.115-3.618c4.764-2.372 9.41-4.965 14.108-7.46 9.302-5.16 18.54-10.437 27.578-16.038 18.143-11.088 35.716-23.055 52.924-35.474 34.397-24.886 67.16-51.775 99.673-78.699 9.273-7.68 8.706-8.346-.596-.723-32.704 26.796-65.626 53.476-100.11 78.095-17.25 12.287-34.848 24.107-52.99 35.043-9.036 5.524-18.265 10.724-27.554 15.806-4.69 2.455-9.328 5.01-14.08 7.343l-7.1 3.56-7.168 3.413-3.586 1.701-3.621 1.625-7.243 3.25-7.316 3.078-3.659 1.538-3.693 1.452-7.388 2.895-7.457 2.712-3.73 1.353c-1.245.443-2.506.841-3.759 1.264l-7.527 2.503c-10.102 3.12-20.252 6.11-30.56 8.455-5.124 1.299-10.321 2.264-15.491 3.353-2.586.534-5.2.92-7.8 1.39-2.604.436-5.197.936-7.816 1.284-20.901 3.115-42.04 4.454-63.183 4.986-21.15.53-42.329.255-63.51.15-40.935-.243-40.97 2.912-.02 3.187"
		fillOpacity={0.64}
		fill="#FFF"
		/>
		<path
		d="M317.207 613.49a115.075 115.075 0 01-16.962 38.129c-7.896 11.559-17.952 21.637-29.469 29.602a115.153 115.153 0 01-38.089 17.168c-13.599 3.384-27.833 4.119-41.737 2.419-13.904-1.707-27.517-5.942-39.873-12.578a116.18 116.18 0 01-32.738-26.035c-9.227-10.555-16.526-22.795-21.387-35.95-.219-.597-.428-1.197-.637-1.796.39.2.837.415 1.356.645a30.717 30.717 0 004.293 1.57c1.751.52 3.8 1.135 6.201 1.56 1.235.237 2.465.505 3.706.715l3.736.543 1.87.266 1.88.178 3.763.354c5.028.26 10.08.417 15.113.042 10.078-.54 20.057-2.56 29.664-5.657 19.17-6.347 36.766-17.59 50.325-32.588 13.672-14.897 23.201-33.44 27.693-53.055 4.476-19.631 3.815-40.355-1.912-59.525a41.554 41.554 0 00-.548-1.633c.511.178 1.02.354 1.54.543 13.076 4.82 25.255 12.062 35.776 21.22a116.054 116.054 0 0126.005 32.52c13.275 24.59 17.05 54.148 10.431 81.344m-7.58-82.72a118.994 118.994 0 00-26.697-33.5c-10.819-9.436-23.36-16.898-36.837-21.856-6.523-2.376-12.442-3.803-17.542-4.785-5.123-.887-9.434-1.33-12.888-1.46-1.729-.052-3.239-.103-4.534-.092a79.164 79.164 0 00-3.236.185c-1.724.143-2.58.319-2.58.517-.002.198.853.419 2.551.648.848.114 1.908.23 3.177.349 1.266.162 2.741.35 4.426.567 3.366.42 7.548 1.1 12.511 2.135 4.283.978 9.161 2.226 14.518 4.049.143.609.34 1.345.607 2.232 5.48 19.112 5.838 39.63 1.168 58.91-4.688 19.27-14.296 37.329-27.837 51.74-13.434 14.52-30.706 25.302-49.42 31.372-9.384 2.954-19.106 4.882-28.924 5.378-4.904.355-9.823.188-14.722-.064l-3.666-.347-1.832-.173-1.823-.26-3.643-.525c-1.209-.203-2.409-.464-3.614-.692-2.337-.41-4.35-.91-6.102-1.25l-4.392-.846c-1.096-.19-1.946-.281-2.568-.291-4.006-12.132-5.96-24.926-5.83-37.7.084-14.028 2.881-28.008 8.013-41.043 5.137-13.04 12.681-25.121 22.118-35.482 9.43-10.372 20.785-18.968 33.276-25.293a115.85 115.85 0 0140.06-11.824l5.22-.45c1.491-.143 2.74-.154 3.737-.241 1.994-.136 2.994-.275 2.992-.388 0-.113-1.003-.201-3.014-.238-1.004 0-2.263-.063-3.768.027-1.504.09-3.26.198-5.263.357a116.958 116.958 0 00-40.514 11.792c-12.649 6.344-24.157 14.996-33.74 25.447a117.426 117.426 0 00-22.519 35.834c-5.244 13.184-8.14 27.343-8.28 41.565-.2 14.213 2.137 28.48 6.995 41.873 4.878 13.383 12.246 25.854 21.582 36.628A118.335 118.335 0 00150 690.22c12.555 6.815 26.416 11.197 40.594 13.005 14.175 1.804 28.702 1.115 42.618-2.276a117.727 117.727 0 0039.032-17.377 117.543 117.543 0 0030.302-30.18 117.9 117.9 0 0017.556-39.03c6.882-27.88 3.143-58.261-10.474-83.59"
		fill="url(#prefix__b)"
		transform="rotate(-153 202.226 587.462)"
		/>
		<path
		d="M225.208 378.092c-4.67-3.148-10.014-4.876-15.42-5.49-2.708-.347-5.455-.286-8.184-.023l-2.043.265-1.968.38c-.66.114-1.297.303-1.945.453-.648.154-1.292.319-1.922.516-10.215 2.978-18.986 8.399-27.77 12.792-17.4 8.892-37.08 13.095-56.65 12.62-19.566-.574-39.019-5.98-55.849-16.114l-1.59-.925-1.546-.997-3.089-2-2.996-2.136-1.497-1.07-1.449-1.134-2.893-2.277-2.788-2.402c-1.894-1.565-3.6-3.333-5.402-5-3.427-3.508-6.794-7.096-9.772-11-1.57-1.887-2.928-3.934-4.38-5.911-.7-1.007-1.343-2.052-2.017-3.076-.667-1.03-1.35-2.05-1.944-3.122-2.802-4.824-4.37-4.045-1.619.944.58 1.107 1.251 2.16 1.906 3.224.663 1.058 1.294 2.139 1.984 3.18 1.43 2.049 2.77 4.168 4.322 6.132 2.945 4.052 6.287 7.798 9.703 11.47 1.794 1.75 3.5 3.6 5.395 5.25l2.792 2.533 2.901 2.408 1.456 1.199 1.506 1.137 3.017 2.27 3.117 2.136 1.562 1.064 1.608.995c17.017 10.866 37.046 17.04 57.376 18.105 20.32.982 41.065-2.995 59.48-12.082 9.134-4.445 17.706-9.543 26.837-12.118 4.586-1.322 9.074-1.888 13.622-1.34 4.514.507 8.94 1.98 12.568 4.418 3.477 2.383 5.472 4.705 6.934 6.354.776.809 1.31 1.493 1.847 1.917.532.426 1.01.612 1.394.513.384-.1.674-.486.83-1.206.15-.718.223-1.795-.142-3.123a21.669 21.669 0 00-.28-1.072c-.11-.378-.298-.737-.47-1.135a36.352 36.352 0 00-.596-1.232c-.215-.432-.52-.82-.808-1.254-1.136-1.76-2.906-3.46-5.128-5.036"
		fill="url(#prefix__c)"
		transform="rotate(-29 117.147 385.807)"
		/>
	</g>
	</svg>
)


export const HeroPatternTop = props => (
	<svg width={302} height={348} {...props}>
	<defs>
		<linearGradient x1="0%" y1="0%" y2="88.353%" id="prefix__a">
		<stop stopColor="#FFF" offset="0%" />
		<stop stopColor="#FFF" stopOpacity={0} offset="100%" />
		</linearGradient>
	</defs>
	<g fill="none" fillRule="evenodd">
		<g fill="#FFF">
		<path d="M76.919 45.44c.294-1.08-.108-1.132-.405-.14a7.215 7.215 0 01-.25.611 7.85 7.85 0 00.456-1.368v-.003c.175.033.389-.146.604-.588.11-.223.176-.52.25-.881.034-.362.079-.794.008-1.278-.217-2.003-1.179-3.896-2.65-5.221-1.468-1.335-3.434-2.046-5.399-2.012a8.017 8.017 0 00-5.373 2.226c-1.463 1.376-2.391 3.316-2.592 5.318a8.254 8.254 0 001.488 5.66 7.814 7.814 0 004.757 3.118c1.884.403 3.906.032 5.559-.97a8.214 8.214 0 003.547-4.471" />
		<path
			d="M48.497 61.03c-.266.979.15 1.034.422.143.067-.185.144-.365.227-.543a6.826 6.826 0 00-.412 1.225v.003c-.182-.036-.398.12-.61.517-.108.202-.174.47-.244.798-.033.328-.074.722-.004 1.163a7.612 7.612 0 002.54 4.775c1.397 1.227 3.257 1.89 5.11 1.874a7.523 7.523 0 007.448-6.804c.19-1.825-.356-3.702-1.452-5.159a7.55 7.55 0 00-4.507-2.867 7.428 7.428 0 00-5.223.842 7.323 7.323 0 00-3.295 4.032"
			fillOpacity={0.64}
		/>
		<path
			d="M34.452 73.065a6.814 6.814 0 003.06-3.758c.247-.912-.185-.97-.437-.15a5.814 5.814 0 01-.208.496c.157-.357.287-.731.378-1.125v-.003c.188.038.409-.101.621-.468.107-.187.176-.437.246-.743.035-.306.076-.674.01-1.086a7.11 7.11 0 00-2.372-4.463c-1.305-1.147-3.043-1.766-4.774-1.75a7.067 7.067 0 00-4.716 1.856 7.021 7.021 0 00-2.237 4.502c-.176 1.705.336 3.456 1.36 4.813a7.038 7.038 0 004.205 2.67 6.92 6.92 0 004.864-.791"
			fillOpacity={0.48}
		/>
		<path
			d="M15.556 53.978c.21-.78-.209-.836-.423-.144a5.167 5.167 0 01-.175.415c.132-.3.241-.616.318-.947v-.003c.182.037.39-.075.588-.387.1-.158.165-.372.23-.634.035-.262.073-.578.017-.932a6.098 6.098 0 00-2.035-3.831c-1.12-.985-2.612-1.516-4.097-1.502-1.49.01-2.963.59-4.046 1.595a6.025 6.025 0 00-1.914 3.864 5.915 5.915 0 001.169 4.124 6.017 6.017 0 003.603 2.28 5.91 5.91 0 004.158-.683 5.818 5.818 0 002.607-3.215"
			fillOpacity={0.32}
		/>
		<path
			d="M11.076 29.26c.175-.648-.263-.711-.445-.148a3.8 3.8 0 01-.148.334c.112-.244.203-.5.265-.77v-.001c.191.04.403-.043.596-.297.181-.257.325-.705.229-1.305-.186-1.232-.886-2.412-1.928-3.252-1.043-.847-2.416-1.32-3.773-1.334-1.362-.019-2.697.441-3.667 1.266A4.671 4.671 0 00.531 26.96c-.107 1.222.324 2.487 1.148 3.474.816.994 2.032 1.705 3.327 1.967 1.297.273 2.669.078 3.769-.502 1.105-.575 1.938-1.535 2.301-2.639"
			fillOpacity={0.24}
		/>
		<path
			d="M23.609 8.986c.152-.581-.268-.638-.425-.145-.037.1-.08.196-.126.291.094-.214.172-.438.226-.674v-.001c.182.038.384-.032.567-.259.174-.227.315-.633.247-1.17a4.582 4.582 0 00-1.53-2.887 4.63 4.63 0 00-3.084-1.13 4.522 4.522 0 00-4.473 4.114 4.437 4.437 0 00.887 3.09 4.49 4.49 0 002.699 1.692 4.394 4.394 0 003.092-.525 4.313 4.313 0 001.92-2.396"
			fillOpacity={0.16}
		/>
		<path
			d="M48.657 4.656c.115-.449-.277-.502-.398-.135-.012.032-.032.06-.046.093.047-.123.09-.249.12-.38v-.002c.17.037.355-.008.52-.18.157-.172.282-.488.23-.908A3.57 3.57 0 0047.893.89a3.604 3.604 0 00-2.406-.88 3.526 3.526 0 00-3.48 3.213c-.082.855.18 1.729.695 2.4a3.478 3.478 0 002.096 1.305c.82.165 1.69.003 2.388-.417a3.326 3.326 0 001.47-1.855"
			fillOpacity={0.08}
		/>
		<path
			d="M63.347 17.009c-.095.381.327.438.428.146.017-.045.044-.085.065-.128a2.285 2.285 0 00-.122.362.617.617 0 00-.548.127c-.164.141-.291.413-.247.776a3.07 3.07 0 001.021 1.942c.567.5 1.32.768 2.07.757a3.03 3.03 0 002.983-2.77 2.954 2.954 0 00-.603-2.054 2.953 2.953 0 00-1.792-1.104 2.875 2.875 0 00-2.025.368 2.812 2.812 0 00-1.23 1.578"
			fillOpacity={0.04}
		/>
		</g>
		<path
		d="M216.17 38.887c-4.67-3.148-10.015-4.876-15.422-5.49-2.707-.347-5.454-.286-8.183-.023l-2.043.265-1.968.381c-.66.113-1.297.302-1.945.452-.648.154-1.292.32-1.922.516-10.215 2.978-18.986 8.4-27.77 12.792-17.4 8.892-37.08 13.095-56.65 12.621-19.566-.575-39.019-5.98-55.849-16.115l-1.59-.925-1.546-.997-3.089-1.999-2.996-2.137-1.497-1.07-1.449-1.134-2.893-2.277-2.788-2.402c-1.894-1.565-3.6-3.333-5.402-5-3.427-3.508-6.794-7.096-9.772-10.999-1.57-1.888-2.928-3.935-4.38-5.912-.7-1.007-1.343-2.052-2.017-3.076-.667-1.03-1.35-2.049-1.944-3.122-2.802-4.824-4.37-4.045-1.619.944.58 1.107 1.251 2.16 1.906 3.224.663 1.058 1.294 2.14 1.984 3.18 1.43 2.05 2.77 4.168 4.322 6.132 2.945 4.052 6.287 7.798 9.703 11.47 1.794 1.75 3.5 3.6 5.395 5.251l2.792 2.532 2.901 2.408 1.456 1.2 1.506 1.136 3.017 2.271 3.117 2.135 1.562 1.064 1.608.995c17.017 10.866 37.046 17.04 57.376 18.105 20.32.982 41.065-2.995 59.48-12.082 9.134-4.445 17.706-9.543 26.837-12.118 4.586-1.322 9.074-1.888 13.622-1.34 4.514.507 8.94 1.981 12.568 4.418 3.477 2.383 5.472 4.705 6.934 6.354.776.81 1.31 1.493 1.847 1.917.532.426 1.01.612 1.394.513.384-.099.674-.486.83-1.206.15-.718.223-1.795-.142-3.123a21.669 21.669 0 00-.28-1.072c-.11-.378-.298-.737-.47-1.135a36.352 36.352 0 00-.596-1.232c-.215-.432-.52-.819-.808-1.254-1.136-1.76-2.906-3.459-5.128-5.036"
		transform="translate(78 282)"
		fill="url(#prefix__a)"
		/>
	</g>
	</svg>
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