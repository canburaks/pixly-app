import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";

import { useAuthCheck, useValues } from "../../functions/hooks";

import {  SearchBox} from "cbs-react-components"


import { movieAutoComplete } from "../../functions/grec";
import { GlobalContext } from "../../";
import { AuthForm, ForgetForm } from "../../forms/AuthForm"
import { development } from "../../index"

import { 
    UnderlineEffect, NewLink,Box, HomeDropdown, ProfileDropdown,
    Text, Paragraph, NavBarBox,SearchInput,
    Image, ImageShim,ImagePlaceholder, //AspectRatioImage, 
    FlexBox, ListBox,SuperBox, AbsoluteBox, 
    CoverLink,Input, HiddenText, 
    TextSection, HeaderMini, LinkButton,
    BookmarkMutation, RatingMutation,TagBox,
    ImdbRatingIcon, YearClockIcon, ProfileIcon, LogoutIcon,
    HomeIcon,ListIcon,FilmListMenu,
    LogoutMutation,SearchQueryBox,
    navbarheight
} from "../"

import { SearchAppBar } from "../../styled-material"

const NB = props => {
    const { username, history, isAuthenticated, logoutDispatcher } = props;
    const authStatus = useAuthCheck()
    const [ keywords, setKeywords ] = useState("")
    const state = useContext(GlobalContext)
    const keywordsHandler = useCallback((e) => setKeywords(e.target.value), [keywords])
    const isSearchPage = window.location.pathname.includes("advance-search")
    const isTransparentBg = (window.location.pathname.includes("/list/") 
        || window.location.pathname.includes("/movie/")  
        || window.location.pathname.includes("/topics") 
        || window.location.pathname === "/"  )


    const MiddleBar = () => (
		<FlexBox height={"auto"} minWidth={"100%"} justifyContent="center" alignItems="center" py={[1]}>
			{/*
			<NewLink 
				color="#f1f1f1 !important" 
				link={"/lists-of-films"} fontSize={["12px", "12px", "12px", "16px"]} 
				px={[1,1,2]}
				>
				<UnderlineEffect >List Of Films</UnderlineEffect>
			</NewLink>
<NewLink 
				color="#f1f1f1 !important" 
				link={"/directors/1"} fontSize={["12px", "12px", "12px", "16px"]} 
				px={[1,1,2]} title="The List of the Famous Directors"
				>
				<UnderlineEffect >Directors</UnderlineEffect>
			</NewLink>
			*/}

			<FilmListMenu />
			
			<NewLink 
				color="#f1f1f1 !important" 
				link={"/similar-movie-finder"} fontSize={["12px", "12px", "12px", "16px"]} 
				px={[1,1,2]} title="Find Similar Movies" fontWeight="bold"
				>
				<UnderlineEffect >Similar Finder</UnderlineEffect>
			</NewLink>
			{authStatus && 
      <NewLink 
	  	color="#f1f1f1 !important" fontWeight="bold"
		  link={"/people/1"} fontSize={["12px", "12px", "12px", "16px"]} 
	  	px={[1,1,2]}
		  >
				<UnderlineEffect >People</UnderlineEffect>
			</NewLink>}

			<NewLink 
				color="#f1f1f1 !important" fontWeight="bold"
				link={"/advance-search"} fontSize={["12px", "12px", "12px", "16px"]} 
				px={[1,1,2]}
				>
				<UnderlineEffect >Search</UnderlineEffect>
			</NewLink>
			{(window.innerWidth > 900 && !window.location.pathname.includes("search")) && <SearchQueryBox />}
		</FlexBox>
	)
	
	const insertform = useCallback(() => state.methods.insertAuthForm("login"),[])
    return (
        <NavBarBox 
            bg={isTransparentBg ? "rgba(40,40,40, 0.3)" : "rgba(40, 40, 40, 0.8)"} 
            height={navbarheight}
			opacity={isTransparentBg ? 1 : 0.98}

		>
            <Box width={"10vw"}>
                <NewLink to="/" rel="nofollow" ><Brand /></NewLink>
            </Box>
            
            <Box width={"85vw"} flexGrow={1} maxWidth={"80vw"}>
				<MiddleBar />
            {/*isSearchPage ? <LinkBar /> : <SearchAndLinkBar />*/}
            </Box>

            <FlexBox width={"10vw"} justifyContent={"center"} maxWidth={"20vw"}>
                {authStatus 
                ?   <ProfileDropdown username={state.username}/>

                :   <Box onClick={insertform} 
                        rel="nofollow" fontWeight="bold"
                        color="light"
                        mr={[4]}
                        clickable
                        fontSize={["12px", "12px", "12px", "16px"]}
                    >
                        Login
                    </Box>
                    }

            </FlexBox>



        </NavBarBox>
    );
}


const Brand = (props) => (
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


export const NavBar = withRouter(SearchAppBar)
